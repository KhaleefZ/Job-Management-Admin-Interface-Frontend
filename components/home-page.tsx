"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search, MapPin, Briefcase, Users, Building, TrendingUp } from "lucide-react"

interface HomePageProps {
  onFindJobsClick: () => void
  onCreateJobClick: () => void
}

export function HomePage({ onFindJobsClick, onCreateJobClick }: HomePageProps) {
  const stats = [
    { icon: Briefcase, label: "Active Jobs", value: "18+" },
    { icon: Building, label: "Companies", value: "15+" },
    { icon: Users, label: "Job Seekers", value: "1000+" },
    { icon: TrendingUp, label: "Success Rate", value: "85%" }
  ]

  const featuredCompanies = [
    "Google", "Meta", "Microsoft", "Amazon", "Tesla", "Adobe", "Salesforce", "Uber"
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Find Your Dream Job
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with top companies and discover opportunities that match your skills and aspirations. 
            Start your career journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
              onClick={onFindJobsClick}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Jobs
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-3 text-lg"
              onClick={onCreateJobClick}
            >
              <Building className="mr-2 h-5 w-5" />
              Post a Job
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <stat.icon className="h-10 w-10 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            Trusted by Leading Companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
            {featuredCompanies.map((company, index) => (
              <div key={index} className="text-center">
                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {company.charAt(0)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Search Jobs</h3>
              <p className="text-muted-foreground">
                Browse through hundreds of job opportunities from top companies across various industries.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply Easily</h3>
              <p className="text-muted-foreground">
                Submit your application with just a few clicks and track your progress in real-time.
              </p>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Get Hired</h3>
              <p className="text-muted-foreground">
                Connect with recruiters and land your dream job with our high success rate platform.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}