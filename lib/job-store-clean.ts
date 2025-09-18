"use client"

import { create } from "zustand"

export interface Job {
  id: number
  title: string
  company: string
  logo?: string
  experience: string
  location: string
  salary: string
  salaryValue: number
  description: string
  postedTime: string
  jobType: "full-time" | "part-time" | "contract" | "remote"
  status: "published" | "draft"
  applicationDeadline?: Date
  createdAt: Date
  isLiked?: boolean
  likesCount?: number
}

interface JobStore {
  jobs: Job[]
  addJob: (job: Omit<Job, "id" | "createdAt">) => void
  updateJob: (id: number, updates: Partial<Job>) => void
  deleteJob: (id: number) => void
  toggleLike: (id: number) => void
  getFilteredJobs: (searchTerm: string, location: string, jobType: string, salaryRange: number[]) => Job[]
}

const initialJobs: Job[] = [
  {
    id: 1,
    title: "Senior Full Stack Developer",
    company: "Google",
    logo: "/google-logo.svg",
    experience: "3-5 yr Exp",
    location: "Bangalore",
    salary: "25 LPA",
    salaryValue: 25,
    description: "Join our core platform team to build scalable web applications using React, Node.js, and cloud technologies. Work on products used by millions of users worldwide.",
    postedTime: "2h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isLiked: false,
    likesCount: 24,
  },
  {
    id: 2,
    title: "React Native Developer",
    company: "Meta",
    logo: "/meta-logo.svg",
    experience: "2-4 yr Exp",
    location: "Hyderabad", 
    salary: "22 LPA",
    salaryValue: 22,
    description: "Build mobile applications for iOS and Android using React Native. Experience with native modules and performance optimization required.",
    postedTime: "5h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    isLiked: false,
    likesCount: 18,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "Amazon",
    logo: "/amazon-logo.png",
    experience: "2-4 yr Exp",
    location: "Mumbai",
    salary: "20 LPA",
    salaryValue: 20,
    description: "Manage cloud infrastructure, deployment pipelines, and monitoring systems. Experience with AWS, Docker, and Kubernetes essential.",
    postedTime: "1d Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isLiked: true,
    likesCount: 32,
  },
  {
    id: 4,
    title: "UI/UX Designer",
    company: "Tesla",
    logo: "/tesla-logo.png",
    experience: "1-3 yr Exp",
    location: "Pune",
    salary: "18 LPA",
    salaryValue: 18,
    description: "Design intuitive user interfaces and exceptional user experiences for our automotive software products. Strong portfolio in product design required.",
    postedTime: "3h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    isLiked: false,
    likesCount: 15,
  },
  {
    id: 5,
    title: "Data Scientist",
    company: "Microsoft",
    logo: "/microsoft-logo.svg",
    experience: "2-5 yr Exp",
    location: "Bangalore",
    salary: "28 LPA",
    salaryValue: 28,
    description: "Work on machine learning models, data analysis, and AI-driven insights. Experience with Python, R, and cloud platforms required.",
    postedTime: "6h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    isLiked: true,
    likesCount: 41,
  }
]

export const useJobStore = create<JobStore>()((set, get) => ({
  jobs: initialJobs,
  
  addJob: (jobData) =>
    set((state) => ({
      jobs: [
        {
          ...jobData,
          id: Math.max(...state.jobs.map((j) => j.id)) + 1,
          createdAt: new Date(),
        },
        ...state.jobs,
      ],
    })),

  updateJob: (id, updates) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id ? { ...job, ...updates } : job
      ),
    })),

  deleteJob: (id) =>
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    })),

  toggleLike: (id) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === id
          ? { 
              ...job, 
              isLiked: !job.isLiked,
              likesCount: job.isLiked 
                ? (job.likesCount || 0) - 1 
                : (job.likesCount || 0) + 1
            }
          : job
      ),
    })),

  getFilteredJobs: (searchTerm, location, jobType, salaryRange) => {
    const jobs = get().jobs
    return jobs.filter((job) => {
      const matchesSearch = searchTerm === "" || 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLocation = location === "" || 
        job.location.toLowerCase().includes(location.toLowerCase())
      
      const matchesJobType = jobType === "" || job.jobType === jobType
      
      const matchesSalaryMin = job.salaryValue >= salaryRange[0]
      const matchesSalaryMax = job.salaryValue <= salaryRange[1]
      
      return matchesSearch && matchesLocation && matchesJobType && matchesSalaryMin && matchesSalaryMax
    })
  },
}))