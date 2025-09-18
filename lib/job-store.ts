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
  jobType: "full-time" | "part-time" | "contract" | "remote" | "internship"
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
  getJobById: (id: number) => Job | undefined
  toggleLike: (id: number) => void
}

// Initial sample jobs with diverse roles, locations, and companies
const initialJobs: Job[] = [
  // Tech Companies - Software Development
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
    description: "Manage cloud infrastructure on AWS, implement CI/CD pipelines, and ensure high availability of services. Experience with Docker and Kubernetes required.",
    postedTime: "8h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    isLiked: true,
    likesCount: 32,
  },
  {
    id: 4,
    title: "Data Scientist",
    company: "Microsoft",
    logo: "/microsoft-logo.svg",
    experience: "1-3 yr Exp",
    location: "Pune",
    salary: "18 LPA",
    salaryValue: 18,
    description: "Analyze large datasets, build predictive models, and derive insights to drive business decisions. Strong background in Python, SQL, and machine learning required.",
    postedTime: "12h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isLiked: false,
    likesCount: 15,
  },
  {
    id: 5,
    title: "Frontend Developer",
    company: "Flipkart",
    logo: "/flipkart-logo.svg",
    experience: "1-2 yr Exp",
    location: "Bangalore",
    salary: "15 LPA",
    salaryValue: 15,
    description: "Create responsive and user-friendly interfaces using React.js, TypeScript, and modern CSS frameworks. Focus on performance and accessibility.",
    postedTime: "1d Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isLiked: false,
    likesCount: 27,
  },
  
  // Design and Creative
  {
    id: 6,
    title: "Senior UX/UI Designer",
    company: "Adobe",
    logo: "/adobe-logo.svg",
    experience: "4-6 yr Exp",
    location: "Remote",
    salary: "28 LPA",
    salaryValue: 28,
    description: "Lead design initiatives for creative software products. Create user-centered designs and collaborate with cross-functional teams to deliver exceptional user experiences.",
    postedTime: "6h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 7,
    title: "Product Designer",
    company: "Swiggy",
    logo: "/swiggy-logo-orange.jpg",
    experience: "2-4 yr Exp",
    location: "Bangalore",
    salary: "16 LPA",
    salaryValue: 16,
    description: "Design end-to-end user experiences for food delivery platform. Work on mobile and web interfaces, conduct user research, and create design systems.",
    postedTime: "10h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
  {
    id: 8,
    title: "Graphic Designer",
    company: "Zomato",
    logo: "/zomato-logo.svg",
    experience: "1-3 yr Exp",
    location: "Delhi",
    salary: "12 LPA",
    salaryValue: 12,
    description: "Create visual content for marketing campaigns, social media, and brand communications. Strong portfolio in digital design and brand identity required.",
    postedTime: "2d Ago",
    jobType: "contract",
    status: "published",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },

  // Marketing and Business
  {
    id: 9,
    title: "Digital Marketing Manager",
    company: "Paytm",
    logo: "/paytm-logo.svg",
    experience: "3-5 yr Exp",
    location: "Noida",
    salary: "14 LPA",
    salaryValue: 14,
    description: "Lead digital marketing strategies, manage campaigns across multiple channels, and optimize performance metrics. Experience with SEO, SEM, and social media marketing.",
    postedTime: "4h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 10,
    title: "Business Analyst",
    company: "Infosys",
    logo: "/infosys-logo.svg",
    experience: "2-4 yr Exp",
    location: "Chennai",
    salary: "13 LPA",
    salaryValue: 13,
    description: "Analyze business processes, gather requirements, and work with stakeholders to implement technology solutions. Strong analytical and communication skills required.",
    postedTime: "7h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
  },

  // Sales and Customer Success
  {
    id: 11,
    title: "Sales Development Representative",
    company: "HubSpot",
    logo: "/hubspot-logo.svg",
    experience: "0-2 yr Exp",
    location: "Remote",
    salary: "8 LPA",
    salaryValue: 8,
    description: "Generate leads, qualify prospects, and support the sales team. Great opportunity for freshers to start their sales career with comprehensive training.",
    postedTime: "3h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 12,
    title: "Customer Success Manager",
    company: "Salesforce",
    logo: "/salesforce-logo.svg",
    experience: "2-4 yr Exp",
    location: "Hyderabad",
    salary: "17 LPA",
    salaryValue: 17,
    description: "Ensure customer satisfaction and retention by providing ongoing support and guidance. Build strong relationships with enterprise clients.",
    postedTime: "9h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 9 * 60 * 60 * 1000),
  },

  // Finance and Operations
  {
    id: 13,
    title: "Financial Analyst",
    company: "Goldman Sachs",
    logo: "/goldman-sachs-logo.svg",
    experience: "1-3 yr Exp",
    location: "Mumbai",
    salary: "19 LPA",
    salaryValue: 19,
    description: "Perform financial modeling, analysis, and reporting. Work with investment teams to evaluate opportunities and support decision-making processes.",
    postedTime: "11h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 11 * 60 * 60 * 1000),
  },
  {
    id: 14,
    title: "Operations Manager",
    company: "Uber",
    logo: "/uber-logo.svg",
    experience: "3-5 yr Exp",
    location: "Bangalore",
    salary: "21 LPA",
    salaryValue: 21,
    description: "Oversee daily operations, optimize processes, and manage cross-functional teams. Strong leadership and project management skills required.",
    postedTime: "1d Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },

  // Entry Level and Internships
  {
    id: 15,
    title: "Software Engineer Intern",
    company: "Tesla",
    logo: "/tesla-logo.png",
    experience: "0-1 yr Exp",
    location: "Pune",
    salary: "6 LPA",
    salaryValue: 6,
    description: "6-month internship program for recent graduates. Work on autonomous driving software and electric vehicle systems. Opportunity for full-time conversion.",
    postedTime: "6h Ago",
    jobType: "internship",
    status: "published",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 16,
    title: "Content Writer",
    company: "Byju's",
    logo: "/byjus-logo.svg",
    experience: "1-2 yr Exp",
    location: "Remote",
    salary: "7 LPA",
    salaryValue: 7,
    description: "Create educational content, blog posts, and marketing materials. Strong writing skills and understanding of digital learning platforms required.",
    postedTime: "15h Ago",
    jobType: "part-time",
    status: "published",
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
  },

  // Hybrid and Remote Opportunities
  {
    id: 17,
    title: "Cloud Solutions Architect",
    company: "IBM",
    logo: "/ibm-logo.svg",
    experience: "5-8 yr Exp",
    location: "Hybrid",
    salary: "35 LPA",
    salaryValue: 35,
    description: "Design and implement cloud infrastructure solutions for enterprise clients. Lead technical discussions and provide architectural guidance.",
    postedTime: "13h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 13 * 60 * 60 * 1000),
  },
  {
    id: 18,
    title: "Cybersecurity Specialist",
    company: "TCS",
    logo: "/tcs-logo.svg",
    experience: "2-5 yr Exp",
    location: "Remote",
    salary: "16 LPA",
    salaryValue: 16,
    description: "Implement security measures, conduct vulnerability assessments, and respond to security incidents. CISSP or similar certification preferred.",
    postedTime: "18h Ago",
    jobType: "full-time",
    status: "published",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
  }
]

export const useJobStore = create<JobStore>((set, get) => ({
  jobs: initialJobs,

  addJob: (jobData) => {
    const newJob: Job = {
      ...jobData,
      id: Math.max(...get().jobs.map((j) => j.id), 0) + 1,
      createdAt: new Date(),
      postedTime: "Just now",
    }
    set((state) => ({ jobs: [newJob, ...state.jobs] }))
  },

  updateJob: (id, updates) => {
    set((state) => ({
      jobs: state.jobs.map((job) => (job.id === id ? { ...job, ...updates } : job)),
    }))
  },

  deleteJob: (id) => {
    set((state) => ({
      jobs: state.jobs.filter((job) => job.id !== id),
    }))
  },

  getJobById: (id) => {
    return get().jobs.find((job) => job.id === id)
  },

  toggleLike: (id) => {
    set((state) => ({
      jobs: state.jobs.map((job) => 
        job.id === id 
          ? { 
              ...job, 
              isLiked: !job.isLiked, 
              likesCount: (job.likesCount || 0) + (job.isLiked ? -1 : 1) 
            }
          : job
      ),
    }))
    
    // Optionally sync with API in the background
    // In a real app, you'd want to handle this properly with error handling
    // const job = get().jobs.find(j => j.id === id)
    // if (job?.isLiked) {
    //   apiClient.likeJob(id.toString()).catch(console.error)
    // } else {
    //   apiClient.unlikeJob(id.toString()).catch(console.error)
    // }
  },
}))
