"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useEffect, useState } from "react"
import { apiClient } from "@/lib/api-client"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onCreateJobClick?: () => void
}

export function Navigation({ activeTab, onTabChange, onCreateJobClick }: NavigationProps) {
  const [backendStatus, setBackendStatus] = useState<'connected' | 'disconnected' | 'checking'>('checking')

  const navItems = ["Home", "Find Jobs", "Find Talents", "About us", "Testimonials"]

  // Test backend connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const isConnected = await apiClient.testConnection()
        setBackendStatus(isConnected ? 'connected' : 'disconnected')
      } catch (error) {
        console.error('Backend connection test failed:', error)
        setBackendStatus('disconnected')
      }
    }

    testConnection()
  }, [])

  return (
    <nav className="bg-background px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Oval Navigation Container */}
        <div className="bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm px-8 py-3">
          <div className="flex items-center justify-center space-x-8">
            <div className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              
              {/* Backend Status Indicator */}
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${
                  backendStatus === 'connected' ? 'bg-green-500' : 
                  backendStatus === 'disconnected' ? 'bg-red-500' : 
                  'bg-yellow-500 animate-pulse'
                }`} />
                <span className={`text-xs ${
                  backendStatus === 'connected' ? 'text-green-600' : 
                  backendStatus === 'disconnected' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  {backendStatus === 'connected' ? 'Online' : 
                   backendStatus === 'disconnected' ? 'Offline' : 
                   'Checking...'}
                </span>
              </div>
            </div>

            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onTabChange(item)}
                className={`text-sm font-medium transition-colors px-4 py-2 rounded-full ${
                  activeTab === item 
                    ? "text-purple-600 bg-purple-50 dark:bg-purple-900/20" 
                    : "text-gray-600 hover:text-purple-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium disabled:opacity-50"
              onClick={() => {
                onCreateJobClick?.()
              }}
              disabled={backendStatus !== 'connected'}
              title={backendStatus !== 'connected' ? 'Backend not connected' : 'Create new job'}
            >
              Create Jobs
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
