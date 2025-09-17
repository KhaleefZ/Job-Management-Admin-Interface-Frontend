"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { Search, MapPin, Users, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useState } from "react"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onCreateJobClick?: () => void
  onSearch?: (searchTerm: string, location: string, jobType: string, salaryRange: number[]) => void
}

export function Navigation({ activeTab, onTabChange, onCreateJobClick, onSearch }: NavigationProps) {
  const { theme, setTheme } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [selectedJobType, setSelectedJobType] = useState("")
  const [salaryRange, setSalaryRange] = useState([50, 80])

  const navItems = ["Home", "Find Jobs", "Find Talents", "About us", "Testimonials"]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const handleSearch = () => {
    onSearch?.(searchTerm, selectedLocation, selectedJobType, salaryRange)
  }

  return (
    <div className="bg-background border-b border-border">
      {/* Top Navigation Bar */}
      <nav className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Image src="/cube-logo.svg" alt="JobBoard Logo" width={40} height={40} className="mr-3" />
            <span className="text-xl font-bold text-foreground">JobBoard</span>
          </div>

          {/* Navigation Items - Centered */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => onTabChange(item)}
                className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                  activeTab === item 
                    ? "text-purple-600 font-semibold" 
                    : "text-gray-600 hover:text-purple-600"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-10 w-10 p-0"
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Create Jobs Button */}
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium"
              onClick={() => {
                onTabChange("Create Jobs")
                onCreateJobClick?.()
              }}
            >
              Create Jobs
            </Button>
          </div>
        </div>
      </nav>

      {/* Search and Filter Bar */}
      {(activeTab === "Find Jobs" || activeTab === "Home") && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search By Job Title, Role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 dark:border-gray-700"
                />
              </div>

              {/* Location Dropdown */}
              <div className="min-w-[200px] relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger className="pl-10 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Preferred Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                    <SelectItem value="chennai">Chennai</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Job Type Dropdown */}
              <div className="min-w-[160px] relative">
                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
                <Select value={selectedJobType} onValueChange={setSelectedJobType}>
                  <SelectTrigger className="pl-10 border-gray-200 dark:border-gray-700">
                    <SelectValue placeholder="Job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Salary Range */}
              <div className="min-w-[200px]">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salary Per Month
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
                </div>
                <Slider
                  value={salaryRange}
                  onValueChange={setSalaryRange}
                  max={200}
                  min={10}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}