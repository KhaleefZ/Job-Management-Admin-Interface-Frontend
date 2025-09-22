"use client"

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ConnectionTest() {
  const [status, setStatus] = useState<{
    backend: 'connected' | 'disconnected' | 'checking'
    database: 'connected' | 'disconnected' | 'checking'
    storage: 'connected' | 'disconnected' | 'checking'
    lastChecked?: string
  }>({
    backend: 'checking',
    database: 'checking',
    storage: 'checking'
  })

  const [testResults, setTestResults] = useState<any>(null)

  const runConnectionTest = async () => {
    setStatus({
      backend: 'checking',
      database: 'checking',
      storage: 'checking'
    })

    try {
      // Test backend connection
      const backendResponse = await fetch('http://localhost:3001/api/health')
      const healthData = await backendResponse.json()
      
      setTestResults(healthData)
      
      setStatus({
        backend: backendResponse.ok ? 'connected' : 'disconnected',
        database: healthData.services?.database === 'Supabase Connected' ? 'connected' : 'disconnected',
        storage: healthData.services?.storage === 'Supabase Storage' ? 'connected' : 'disconnected',
        lastChecked: new Date().toLocaleTimeString()
      })

    } catch (error) {
      console.error('Connection test failed:', error)
      setStatus({
        backend: 'disconnected',
        database: 'disconnected',
        storage: 'disconnected',
        lastChecked: new Date().toLocaleTimeString()
      })
    }
  }

  useEffect(() => {
    runConnectionTest()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'bg-green-500'
      case 'disconnected': return 'bg-red-500'
      case 'checking': return 'bg-yellow-500 animate-pulse'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'connected': return 'Connected'
      case 'disconnected': return 'Disconnected'
      case 'checking': return 'Checking...'
      default: return 'Unknown'
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Backend Connection Status
          <Button onClick={runConnectionTest} size="sm" variant="outline">
            Refresh
          </Button>
        </CardTitle>
        <CardDescription>
          Real-time status of backend services
          {status.lastChecked && (
            <span className="block text-xs text-gray-500 mt-1">
              Last checked: {status.lastChecked}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 border rounded-lg">
            <div className={`w-4 h-4 rounded-full mb-2 ${getStatusColor(status.backend)}`} />
            <span className="text-sm font-medium">Backend API</span>
            <span className="text-xs text-gray-500">{getStatusText(status.backend)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 border rounded-lg">
            <div className={`w-4 h-4 rounded-full mb-2 ${getStatusColor(status.database)}`} />
            <span className="text-sm font-medium">Database</span>
            <span className="text-xs text-gray-500">{getStatusText(status.database)}</span>
          </div>
          
          <div className="flex flex-col items-center p-3 border rounded-lg">
            <div className={`w-4 h-4 rounded-full mb-2 ${getStatusColor(status.storage)}`} />
            <span className="text-sm font-medium">File Storage</span>
            <span className="text-xs text-gray-500">{getStatusText(status.storage)}</span>
          </div>
        </div>

        {/* Detailed Information */}
        {testResults && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Server Information:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Status: <Badge variant="outline">{testResults.status}</Badge></div>
              <div>Environment: <Badge variant="outline">{testResults.environment}</Badge></div>
              <div>Version: <Badge variant="outline">{testResults.version}</Badge></div>
              <div>Uptime: <Badge variant="outline">{Math.floor(testResults.uptime)}s</Badge></div>
            </div>
            
            {testResults.endpoints && (
              <div className="mt-3">
                <h5 className="font-medium text-xs mb-1">Available Endpoints:</h5>
                <div className="text-xs text-gray-600">
                  <div>Jobs: {testResults.endpoints.jobs}</div>
                  <div>Applications: {testResults.endpoints.applications}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Connection Instructions */}
        {status.backend === 'disconnected' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-medium text-red-800 mb-2">Backend Not Connected</h4>
            <p className="text-sm text-red-700 mb-2">
              Make sure your backend server is running:
            </p>
            <code className="block bg-red-100 p-2 rounded text-xs">
              cd job-backend && npm run dev
            </code>
          </div>
        )}

        {status.backend === 'connected' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-medium text-green-800 mb-2">✅ All Systems Operational</h4>
            <p className="text-sm text-green-700">
              Backend is connected and ready to handle job applications.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}