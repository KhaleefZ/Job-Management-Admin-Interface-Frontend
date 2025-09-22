"use client"

import { Navigation } from "@/components/navigation"
import { JobListPage } from "@/components/job-list-page"
import { JobCreationModal } from "@/components/job-creation-modal"
import { HomePage } from "@/components/home-page"
import { FindTalentsPage } from "@/components/find-talents-page"
import { AboutUsPage } from "@/components/about-us-page"
import { TestimonialsPage } from "@/components/testimonials-page"
import { ConnectionTest } from "@/components/connection-test"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState("Find Jobs")
  const [showConnectionTest, setShowConnectionTest] = useState(false)

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "Home":
        return <JobListPage onCreateJob={() => setShowCreateModal(true)} />
      case "Find Jobs":
        return <JobListPage onCreateJob={() => setShowCreateModal(true)} />
      case "Find Talents":
        return <FindTalentsPage />
      case "About us":
        return <AboutUsPage />
      case "Testimonials":
        return <TestimonialsPage />
      default:
        return <JobListPage onCreateJob={() => setShowCreateModal(true)} />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateJobClick={() => setShowCreateModal(true)} 
      />
      
      {/* Development Connection Test Toggle */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowConnectionTest(!showConnectionTest)}
            className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-600"
          >
            {showConnectionTest ? 'Hide' : 'Show'} Connection Test
          </button>
        </div>
      )}

      {/* Connection Test Panel */}
      {showConnectionTest && process.env.NODE_ENV === 'development' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Backend Connection Test</h2>
              <button
                onClick={() => setShowConnectionTest(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              <ConnectionTest />
            </div>
          </div>
        </div>
      )}
      
      {renderActiveComponent()}

      <JobCreationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      <Toaster />
    </div>
  )
}
