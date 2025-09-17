"use client"

import { Navigation } from "@/components/navigation"
import { JobListPage } from "@/components/job-list-page"
import { JobCreationModal } from "@/components/job-creation-modal"
import { HomePage } from "@/components/home-page"
import { FindTalentsPage } from "@/components/find-talents-page"
import { AboutUsPage } from "@/components/about-us-page"
import { TestimonialsPage } from "@/components/testimonials-page"
import { Toaster } from "@/components/ui/toaster"
import { useState } from "react"

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState("Home")

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePage 
          onFindJobsClick={() => setActiveTab("Find Jobs")}
          onCreateJobClick={() => setShowCreateModal(true)} 
        />
      case "Find Jobs":
        return <JobListPage onCreateJob={() => setShowCreateModal(true)} />
      case "Find Talents":
        return <FindTalentsPage />
      case "About us":
        return <AboutUsPage />
      case "Testimonials":
        return <TestimonialsPage />
      default:
        return <HomePage 
          onFindJobsClick={() => setActiveTab("Find Jobs")}
          onCreateJobClick={() => setShowCreateModal(true)} 
        />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateJobClick={() => setShowCreateModal(true)} 
      />
      
      {renderActiveComponent()}

      <JobCreationModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />

      <Toaster />
    </div>
  )
}
