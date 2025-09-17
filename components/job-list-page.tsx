"use client"

import { useState, useMemo } from "react"
import { Search, MapPin, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { JobCard } from "@/components/job-card"
import { useJobStore } from "@/lib/job-store"

interface JobListPageProps {
  onCreateJob: () => void
}

export function JobListPage({ onCreateJob }: JobListPageProps) {
  const { jobs } = useJobStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [salaryRange, setSalaryRange] = useState([0, 50])

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => job.status === "published") // Only show published jobs
      .filter((job) => {
        // Search term filter (job title or company)
        const matchesSearch =
          searchTerm === "" ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())

        // Location filter
        const matchesLocation =
          locationFilter === "all" || job.location.toLowerCase().includes(locationFilter.toLowerCase())

        // Job type filter
        const matchesJobType = jobTypeFilter === "all" || job.jobType === jobTypeFilter

        // Salary range filter (convert LPA to comparable value)
        const matchesSalary = job.salaryValue >= salaryRange[0] && job.salaryValue <= salaryRange[1]

        return matchesSearch && matchesLocation && matchesJobType && matchesSalary
      })
  }, [jobs, searchTerm, locationFilter, jobTypeFilter, salaryRange])

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Filters Section */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Job Title Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search By Job Title, Role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-input rounded-lg"
            />
          </div>

          {/* Location Filter */}
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="pl-10 h-12 border-input rounded-lg">
                <SelectValue placeholder="Preferred Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="onsite">Onsite</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Job Type Filter */}
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 z-10" />
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="pl-10 h-12 border-input rounded-lg">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Salary Range */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Salary Per Month</span>
              <span className="text-sm text-muted-foreground">
                ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
              </span>
            </div>
            <Slider value={salaryRange} onValueChange={setSalaryRange} max={50} min={0} step={2} className="w-full" />
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredJobs.length} job{filteredJobs.length !== 1 ? "s" : ""}
          {searchTerm && ` for "${searchTerm}"`}
        </p>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No jobs found matching your criteria.</p>
            <p className="text-muted-foreground/70 text-sm mt-2">Try adjusting your filters to see more results.</p>
          </div>
        )}
      </div>
    </div>
  )
}
