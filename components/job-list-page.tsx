"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, MapPin, Users } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { JobCard } from "@/components/job-card"
import { useJobStore, Job } from "@/lib/job-store"
import { apiClient } from "@/lib/api-client"
import { toast } from "@/hooks/use-toast"

interface JobListPageProps {
  onCreateJob: () => void
}

export function JobListPage({ onCreateJob }: JobListPageProps) {
  const { jobs: localJobs } = useJobStore()
  const [jobs, setJobs] = useState<Job[]>(localJobs)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [jobTypeFilter, setJobTypeFilter] = useState("all")
  const [salaryRange, setSalaryRange] = useState([0, 50])

  // Convert backend job to frontend job format
  const convertBackendJob = (backendJob: any, index: number = 0): Job => {
    console.log(`Converting job ${index}:`, backendJob)
    
    // Handle different ID formats
    let jobId = 1000 + index; // Default to high number to indicate backend job
    if (backendJob.id) {
      const parsedId = parseInt(backendJob.id.toString());
      if (!isNaN(parsedId)) {
        jobId = parsedId;
      }
    }
    
    // Handle different date formats
    let postedTime = 'Recently';
    if (backendJob.created_at) {
      try {
        postedTime = new Date(backendJob.created_at).toLocaleDateString();
      } catch (e) {
        console.warn('Invalid date format:', backendJob.created_at);
      }
    }
    
    // Handle salary formats
    let salaryDisplay = 'Not specified';
    let salaryValue = 0;
    
    if (backendJob.salary) {
      salaryDisplay = backendJob.salary;
      // Try to extract numeric value
      const salaryMatch = backendJob.salary.match(/(\d+)/);
      if (salaryMatch) {
        salaryValue = parseInt(salaryMatch[1]);
      }
    } else if (backendJob.salary_min || backendJob.salary_max) {
      const min = backendJob.salary_min || 0;
      const max = backendJob.salary_max || min;
      salaryDisplay = `${min}-${max} LPA`;
      salaryValue = max;
    }
    
    const convertedJob = {
      id: jobId,
      title: backendJob.title || backendJob.job_title || 'Unknown Title',
      company: backendJob.company || backendJob.company_name || 'Unknown Company',
      logo: backendJob.logo || backendJob.company_logo || '/placeholder-logo.png',
      experience: backendJob.experience || backendJob.experience_required || 'Not specified',
      location: backendJob.location || backendJob.job_location || 'Remote',
      salary: salaryDisplay,
      salaryValue: salaryValue,
      description: backendJob.description || backendJob.job_description || 'No description available',
      postedTime: postedTime,
      jobType: (backendJob.job_type || backendJob.type || 'full-time') as "full-time" | "part-time" | "contract" | "remote" | "internship",
      status: (backendJob.status || 'published') as "published" | "draft",
      createdAt: backendJob.created_at ? new Date(backendJob.created_at) : new Date(),
      isLiked: false,
      likesCount: 0
    };
    
    console.log(`Converted job ${index}:`, convertedJob);
    return convertedJob;
  }

  // Fetch jobs from backend on component mount
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        console.log('Fetching jobs from backend...')
        
        // First, test direct fetch to see raw response
        try {
          const directResponse = await fetch('http://localhost:3001/api/jobs?simple=true');
          const directData = await directResponse.text();
          console.log('Direct fetch response (raw):', directData);
          
          if (directResponse.ok) {
            const parsedDirectData = JSON.parse(directData);
            console.log('Direct fetch response (parsed):', parsedDirectData);
          }
        } catch (directError) {
          console.log('Direct fetch failed:', directError);
        }
        
        // Try with simple parameter first to avoid relationship issues
        const response = await apiClient.getJobs({ status: 'published' })
        console.log('Backend jobs response:', response)
        console.log('Response type:', typeof response)
        console.log('Response keys:', response ? Object.keys(response) : 'No response')
        
        // Check multiple possible response formats from backend
        let jobsArray = null;
        
        if (response && response.jobs && Array.isArray(response.jobs)) {
          // Expected format: { jobs: [...], total: X, page: Y }
          jobsArray = response.jobs;
          console.log('✅ Found jobs in response.jobs format')
        } else if (response && Array.isArray(response)) {
          // Direct array format: [job1, job2, job3]
          jobsArray = response;
          console.log('✅ Found jobs in direct array format')
        } else if (
          response &&
          typeof response === "object" &&
          "data" in response &&
          Array.isArray((response as any).data)
        ) {
          // Nested data format: { data: [...] }
          jobsArray = (response as any).data;
          console.log('✅ Found jobs in response.data format')
        } else if (response && typeof response === 'object') {
          // Try to find any array property that might contain jobs
          const arrays = Object.values(response).filter(val => Array.isArray(val));
          if (arrays.length > 0) {
            jobsArray = arrays[0] as any[];
            console.log('✅ Found jobs in first array property:', Object.keys(response).find(key => Array.isArray((response as any)[key])))
          }
        }
        
        if (jobsArray && jobsArray.length > 0) {
          console.log('Sample job structure:', jobsArray[0])
          const convertedJobs = jobsArray.map((job: any, index: number) => convertBackendJob(job, index))
          setJobs(convertedJobs)
          console.log(`✅ Loaded ${convertedJobs.length} jobs from backend`)
          
          toast({
            title: "Backend Connected",
            description: `Loaded ${convertedJobs.length} jobs from database`,
            variant: "default"
          })
        } else {
          console.log('❌ No jobs found in any expected format')
          console.log('Full response:', JSON.stringify(response, null, 2))
          setJobs(localJobs)
          
          toast({
            title: "Using Sample Jobs",
            description: "Backend connected but no jobs found. Using sample jobs.",
            variant: "default"
          })
        }
      } catch (error) {
        console.error('Failed to fetch jobs from backend:', error)
        
        // Check if it's the relationship error
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        const isRelationshipError = errorMessage.includes('relationship') || errorMessage.includes('embed')
        
        console.log('Using local jobs as fallback')
        setJobs(localJobs)
        
        toast({
          title: isRelationshipError ? "Database Schema Issue" : "Backend Unavailable",
          description: isRelationshipError 
            ? "Backend database has relationship conflicts. Using sample jobs."
            : "Couldn't connect to backend. Using sample jobs.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [localJobs])

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

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading jobs from backend...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Backend/Local Jobs Indicator */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {jobs.length > 0 ? (
            jobs[0].id > 1000 ? 
              `📡 Showing ${jobs.length} jobs from backend` : 
              `💾 Showing ${jobs.length} local sample jobs (backend issue)`
          ) : (
            "No jobs available"
          )}
        </div>
        
        {/* Retry button for local jobs */}
        {jobs.length > 0 && jobs[0].id <= 1000 && (
          <button
            onClick={() => window.location.reload()}
            className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors"
            disabled={loading}
          >
            🔄 Retry Backend
          </button>
        )}
      </div>
      
      {/* Filters Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-8 shadow-sm">
        <div className="flex items-center gap-4">
          {/* Job Title Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search By Job Title, Role"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-lg"
            />
          </div>

          {/* Location Filter */}
          <div className="min-w-[200px] relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-lg">
                <SelectValue placeholder="Preferred Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
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

          {/* Job Type Filter */}
          <div className="min-w-[160px] relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="pl-10 h-12 border-gray-200 dark:border-gray-700 rounded-lg">
                <SelectValue placeholder="Job type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
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
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Salary Per Month</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                ₹{salaryRange[0]}k - ₹{salaryRange[1]}k
              </span>
            </div>
            <Slider value={salaryRange} onValueChange={setSalaryRange} max={80} min={0} step={5} className="w-full" />
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
