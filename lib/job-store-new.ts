"use client"

import { create } from "zustand"
import { apiClient } from "@/lib/api-client"

export interface Job {
  id: string
  title: string
  company: string
  logo: string
  experience: string
  location: string
  salary: string
  salaryValue: number
  description: string
  postedTime: string
  jobType: string
  status: "published" | "draft"
  requirements?: string
  responsibilities?: string
  applicationDeadline?: Date
  createdAt: Date
  isLiked?: boolean
  likesCount?: number
}

interface JobStore {
  jobs: Job[]
  isLoading: boolean
  error: string | null
  addJob: (job: Omit<Job, "id" | "createdAt">) => void
  updateJob: (id: string, updates: Partial<Job>) => void
  deleteJob: (id: string) => void
  getJobById: (id: string) => Job | undefined
  toggleLike: (id: string) => void
  loadJobs: () => Promise<void>
}

// Transform backend job data to frontend format
const transformBackendJob = (backendJob: any): Job => {
  return {
    id: backendJob.id,
    title: backendJob.title,
    company: getCompanyFromTitle(backendJob.title), // Extract company from title or use default
    logo: getCompanyLogo(getCompanyFromTitle(backendJob.title)),
    experience: "2-5 yr Exp", // Default since backend doesn't have this field
    location: backendJob.location,
    salary: formatSalary(backendJob.salary_min, backendJob.salary_max),
    salaryValue: backendJob.salary_min || 0,
    description: backendJob.description,
    postedTime: formatPostedTime(backendJob.created_at),
    jobType: backendJob.job_type || "full-time",
    status: backendJob.status === "open" ? "published" : "draft",
    requirements: "Requirements will be detailed during the interview process.",
    responsibilities: "Responsibilities will be discussed during the interview.",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    createdAt: new Date(backendJob.created_at),
    isLiked: false,
    likesCount: Math.floor(Math.random() * 200) + 50 // Random likes for demo
  }
}

// Helper functions
const getCompanyFromTitle = (title: string): string => {
  // Try to extract company from job title patterns
  if (title.includes("Google") || title.includes("Senior Software Engineer")) return "Google"
  if (title.includes("Meta") || title.includes("React Native")) return "Meta"
  if (title.includes("Frontend")) return "Microsoft"
  if (title.includes("Product")) return "Apple"
  if (title.includes("DevOps")) return "Amazon"
  return "TechCorp" // Default
}

const getCompanyLogo = (company: string): string => {
  const logoMap: { [key: string]: string } = {
    "Google": "/google-logo.svg",
    "Microsoft": "/microsoft-logo.svg",
    "Apple": "/apple-logo.svg",
    "Amazon": "/amazon-logo.png",
    "Tesla": "/tesla-logo.png",
    "Meta": "/meta-logo.svg",
    "TechCorp": "/placeholder-logo.svg"
  }
  return logoMap[company] || "/placeholder-logo.svg"
}

const formatSalary = (min?: number, max?: number): string => {
  if (min && max) {
    return `₹${min/100000}-${max/100000} LPA`
  }
  if (min) {
    return `₹${min/100000}+ LPA`
  }
  return "Competitive Salary"
}

const formatPostedTime = (createdAt: string): string => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))
  
  if (diffHours < 24) {
    return `${diffHours}h Ago`
  }
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d Ago`
}

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: [],
  isLoading: false,
  error: null,

  loadJobs: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await apiClient.getJobs()
      const transformedJobs = response.jobs.map(transformBackendJob)
      set({ jobs: transformedJobs, isLoading: false })
    } catch (error) {
      console.error("Failed to load jobs:", error)
      set({ 
        error: "Failed to load jobs",
        isLoading: false,
        // Fallback to sample jobs if API fails
        jobs: []
      })
    }
  },

  addJob: (job) => {
    const newJob: Job = {
      ...job,
      id: Date.now().toString(), // Temporary ID until saved to backend
      createdAt: new Date(),
    }
    set((state) => ({ jobs: [...state.jobs, newJob] }))
  },

  updateJob: (id, updates) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    }))
  },

  deleteJob: (id) => {
    set((state) => ({ jobs: state.jobs.filter((job) => job.id !== id) }))
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id)
  },

  toggleLike: (id) => {
    set((state) => ({
      jobs: state.jobs.map((job) => {
        if (job.id === id) {
          const isLiked = !job.isLiked
          return {
            ...job,
            isLiked,
            likesCount: (job.likesCount || 0) + (isLiked ? 1 : -1),
          }
        }
        return job
      }),
    }))
  },
}))