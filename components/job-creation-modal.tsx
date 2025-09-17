"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, ChevronDown } from "lucide-react"
import { format } from "date-fns"
import { useJobStore } from "@/lib/job-store"
import { toast } from "@/hooks/use-toast"

interface JobCreationModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JobCreationModal({ isOpen, onClose }: JobCreationModalProps) {
  const { addJob } = useJobStore()
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    applicationDeadline: undefined as Date | undefined,
    jobDescription: "",
    requirements: "",
    responsibilities: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      companyName: "",
      location: "",
      jobType: "",
      salaryMin: "",
      salaryMax: "",
      applicationDeadline: undefined,
      jobDescription: "",
      requirements: "",
      responsibilities: "",
    })
  }

  const handleSaveDraft = () => {
    if (!formData.jobTitle || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the job title and company name.",
        variant: "destructive",
      })
      return
    }

    const salaryValue = formData.salaryMax ? Number.parseInt(formData.salaryMax) / 100000 : 0
    const salaryDisplay = formData.salaryMax ? `${Math.round(salaryValue)} LPA` : "Negotiable"

    addJob({
      title: formData.jobTitle,
      company: formData.companyName,
      logo: getCompanyLogo(formData.companyName),
      experience: "1-3 yr Exp", // Default value
      location: formData.location || "Remote",
      salary: salaryDisplay,
      salaryValue: salaryValue,
      description: formData.jobDescription || "Job description to be updated.",
      postedTime: "Just now",
      jobType: formData.jobType || "full-time",
      status: "draft",
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      applicationDeadline: formData.applicationDeadline,
    })

    toast({
      title: "Draft Saved",
      description: "Your job posting has been saved as a draft.",
    })

    resetForm()
  }

  const handlePublish = () => {
    if (!formData.jobTitle || !formData.companyName || !formData.jobDescription) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before publishing.",
        variant: "destructive",
      })
      return
    }

    const salaryValue = formData.salaryMax ? Number.parseInt(formData.salaryMax) / 100000 : 0
    const salaryDisplay = formData.salaryMax ? `${Math.round(salaryValue)} LPA` : "Negotiable"

    addJob({
      title: formData.jobTitle,
      company: formData.companyName,
      logo: getCompanyLogo(formData.companyName),
      experience: "1-3 yr Exp", // Default value
      location: formData.location || "Remote",
      salary: salaryDisplay,
      salaryValue: salaryValue,
      description: formData.jobDescription,
      postedTime: "Just now",
      jobType: formData.jobType || "full-time",
      status: "published",
      requirements: formData.requirements,
      responsibilities: formData.responsibilities,
      applicationDeadline: formData.applicationDeadline,
    })

    toast({
      title: "Job Published",
      description: "Your job posting has been published successfully!",
    })

    resetForm()
    onClose()
  }

  const getCompanyLogo = (company: string) => {
    const companyLogos: Record<string, string> = {
      "amazon": "/amazon-logo.png",
      "tesla": "/tesla-logo.png", 
      "swiggy": "/swiggy-logo-orange.jpg",
      "google": "/google-logo.svg",
      "meta": "/meta-logo.svg",
      "microsoft": "/microsoft-logo.svg",
      "flipkart": "/flipkart-logo.svg",
      "adobe": "/adobe-logo.svg",
      "zomato": "/zomato-logo.svg",
      "paytm": "/paytm-logo.svg",
      "infosys": "/infosys-logo.svg",
      "hubspot": "/hubspot-logo.svg",
      "salesforce": "/salesforce-logo.svg",
      "goldman sachs": "/goldman-sachs-logo.svg",
      "uber": "/uber-logo.svg",
      "byju's": "/byjus-logo.svg",
      "ibm": "/ibm-logo.svg",
      "tcs": "/tcs-logo.svg"
    }

    return companyLogos[company.toLowerCase()] || "/placeholder.svg"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Create Job Opening</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Job Title and Company Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                Job Title
              </Label>
              <Input
                id="jobTitle"
                placeholder="Full Stack Developer"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                className="h-12 border-gray-300 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
                Company Name
              </Label>
              <Input
                id="companyName"
                placeholder="Amazon, Microsoft, Swiggy"
                value={formData.companyName}
                onChange={(e) => handleInputChange("companyName", e.target.value)}
                className="h-12 border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Location and Job Type Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                Location
              </Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger className="h-12 border-gray-300 rounded-lg">
                  <SelectValue placeholder="Choose Preferred Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">Onsite</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">
                Job Type
              </Label>
              <Select value={formData.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
                <SelectTrigger className="h-12 border-gray-300 rounded-lg">
                  <SelectValue placeholder="Full-time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full-time</SelectItem>
                  <SelectItem value="part-time">Part-time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="internship">Internship</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Salary Range and Application Deadline Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Salary Range</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    placeholder="0"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    className="pl-8 h-12 border-gray-300 rounded-lg"
                  />
                </div>
                <span className="flex items-center text-gray-500">–</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <Input
                    placeholder="12,00,000"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    className="pl-8 h-12 border-gray-300 rounded-lg"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Application Deadline</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-12 justify-start text-left font-normal border-gray-300 rounded-lg bg-transparent"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.applicationDeadline ? (
                      format(formData.applicationDeadline, "PPP")
                    ) : (
                      <span className="text-gray-500">Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.applicationDeadline}
                    onSelect={(date) => setFormData((prev) => ({ ...prev, applicationDeadline: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Job Description */}
          <div className="space-y-2">
            <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
              Job Description
            </Label>
            <Textarea
              id="jobDescription"
              placeholder="Please share a description to let the candidate know more about the job role"
              value={formData.jobDescription}
              onChange={(e) => handleInputChange("jobDescription", e.target.value)}
              className="min-h-[100px] border-gray-300 rounded-lg resize-none"
            />
          </div>

          {/* Requirements */}
          <div className="space-y-2">
            <Label htmlFor="requirements" className="text-sm font-medium text-gray-700">
              Requirements
            </Label>
            <Textarea
              id="requirements"
              placeholder="List the key requirements for this position"
              value={formData.requirements}
              onChange={(e) => handleInputChange("requirements", e.target.value)}
              className="min-h-[80px] border-gray-300 rounded-lg resize-none"
            />
          </div>

          {/* Responsibilities */}
          <div className="space-y-2">
            <Label htmlFor="responsibilities" className="text-sm font-medium text-gray-700">
              Responsibilities
            </Label>
            <Textarea
              id="responsibilities"
              placeholder="Describe the main responsibilities of this role"
              value={formData.responsibilities}
              onChange={(e) => handleInputChange("responsibilities", e.target.value)}
              className="min-h-[80px] border-gray-300 rounded-lg resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-2 px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
          >
            Save Draft
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            onClick={handlePublish}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-medium"
          >
            Publish »
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
