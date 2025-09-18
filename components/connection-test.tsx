"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2, AlertCircle, Copy } from "lucide-react"

interface ConnectionStatus {
  status: 'checking' | 'connected' | 'failed' | 'no-backend'
  message: string
  details?: string
}

export function ConnectionTest() {
  const [backendStatus, setBackendStatus] = useState<ConnectionStatus>({
    status: 'checking',
    message: 'Checking backend connection...'
  })

  const [apiStatus, setApiStatus] = useState<ConnectionStatus>({
    status: 'checking', 
    message: 'Testing API endpoints...'
  })

  const testBackendConnection = async () => {
    setBackendStatus({ status: 'checking', message: 'Checking backend connection...' })
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
      console.log('Testing connection to:', apiUrl)
      
      const response = await fetch(`${apiUrl}/api/jobs`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setBackendStatus({
          status: 'connected',
          message: 'Backend connected successfully!',
          details: `Found ${data.jobs?.length || 0} jobs`
        })
      } else {
        setBackendStatus({
          status: 'failed',
          message: `Backend responded with error: ${response.status}`,
          details: response.statusText
        })
      }
    } catch (error) {
      console.error('Backend connection error:', error)
      setBackendStatus({
        status: 'no-backend',
        message: 'Cannot connect to backend server',
        details: 'Make sure backend is running on port 3001'
      })
    }
  }

  const testApiEndpoints = async () => {
    setApiStatus({ status: 'checking', message: 'Testing API endpoints...' })
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    const endpoints = [
      { name: 'Jobs', path: '/api/jobs', requiresAuth: false },
      { name: 'Users', path: '/api/users', requiresAuth: true },
      { name: 'Applications', path: '/api/applications', requiresAuth: true }
    ]

    type EndpointResult = {
      name: string
      status: string
      code: number | string
    }

    const results: EndpointResult[] = []
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`${apiUrl}${endpoint.path}`)
        let status = 'error'
        let code: number | string = response.status
        
        if (response.ok) {
          status = 'success'
        } else if (endpoint.requiresAuth && response.status === 401) {
          // 401 for auth-required endpoints means the endpoint is working
          status = 'success'
          code = '401 (Auth Required)'
        }
        
        results.push({
          name: endpoint.name,
          status,
          code
        })
      } catch (error) {
        results.push({
          name: endpoint.name, 
          status: 'failed',
          code: 'N/A'
        })
      }
    }

    const successCount = results.filter(r => r.status === 'success').length
    const totalCount = results.length

    if (successCount === totalCount) {
      setApiStatus({
        status: 'connected',
        message: 'All API endpoints working!',
        details: `${successCount}/${totalCount} endpoints responding (some require auth)`
      })
    } else if (successCount > 0) {
      setApiStatus({
        status: 'failed',
        message: 'Some API endpoints failing',
        details: `${successCount}/${totalCount} endpoints working`
      })
    } else {
      setApiStatus({
        status: 'failed',
        message: 'No API endpoints responding',
        details: 'Backend may not be running'
      })
    }
  }

  useEffect(() => {
    testBackendConnection()
    testApiEndpoints()
  }, [])

  const getStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'no-backend':
        return <AlertCircle className="h-5 w-5 text-orange-500" />
    }
  }

  const getStatusBadge = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'checking':
        return <Badge variant="secondary">Checking</Badge>
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      case 'no-backend':
        return <Badge className="bg-orange-100 text-orange-800">No Backend</Badge>
    }
  }

  return (
    <div className="space-y-4 p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Backend-Frontend Connection Test</h2>
        <p className="text-muted-foreground">
          This component tests the connection between frontend and backend services.
        </p>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(backendStatus.status)}
            <div>
              <h3 className="font-semibold">Backend Connection</h3>
              <p className="text-sm text-muted-foreground">{backendStatus.message}</p>
              {backendStatus.details && (
                <p className="text-xs text-muted-foreground mt-1">{backendStatus.details}</p>
              )}
            </div>
          </div>
          {getStatusBadge(backendStatus.status)}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon(apiStatus.status)}
            <div>
              <h3 className="font-semibold">API Endpoints</h3>
              <p className="text-sm text-muted-foreground">{apiStatus.message}</p>
              {apiStatus.details && (
                <p className="text-xs text-muted-foreground mt-1">{apiStatus.details}</p>
              )}
            </div>
          </div>
          {getStatusBadge(apiStatus.status)}
        </div>

        <div className="flex space-x-2 pt-4 border-t">
          <Button 
            onClick={() => {
              testBackendConnection()
              testApiEndpoints()
            }}
            variant="outline" 
            size="sm"
          >
            Test Again
          </Button>
          <Button 
            onClick={() => {
              console.log('Backend Status:', backendStatus)
              console.log('API Status:', apiStatus)
              console.log('API URL:', process.env.NEXT_PUBLIC_API_URL)
            }}
            variant="outline" 
            size="sm"
          >
            Debug Info
          </Button>
        </div>
      </Card>

      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20">
        <h3 className="font-semibold mb-2 flex items-center">
          <AlertCircle className="h-4 w-4 mr-2 text-blue-600" />
          Setup Instructions
        </h3>
        <div className="text-sm space-y-2 text-blue-700 dark:text-blue-300">
          <p>1. Ensure backend is running: <code>cd job-management-backend1 && npm run dev</code></p>
          <p>2. Backend should be on port 3001: <code>http://localhost:3001</code></p>
          <p>3. Frontend should be on port 3000: <code>http://localhost:3000</code></p>
          <p>4. Check environment variables in <code>.env.local</code> files</p>
          <p>5. <strong>Note:</strong> Users/Applications APIs require authentication (401 response is normal)</p>
        </div>
      </Card>
    </div>
  )
}