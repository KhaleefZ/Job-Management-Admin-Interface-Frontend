"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { Job } from "@/lib/job-store"
import { toast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import Image from "next/image"

interface ApplicationModalProps {
  job: Job
  isOpen: boolean
  onClose: () => void
}

export function ApplicationModal({ job, isOpen, onClose }: ApplicationModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    currentCompany: "",
    currentRole: "",
    noticePeriod: "",
    expectedSalary: "",
    resume: null as File | null,
    coverLetter: "",
    linkedinProfile: "",
    portfolioWebsite: "",
    whyInterested: "",
    availableForInterview: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
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

    return companyLogos[company.toLowerCase()] || job.logo || "/placeholder.svg"
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({ ...prev, resume: "File size should be less than 5MB" }))
        return
      }
      if (!file.type.includes('pdf') && !file.type.includes('doc')) {
        setErrors(prev => ({ ...prev, resume: "Please upload PDF or DOC file only" }))
        return
      }
      setFormData(prev => ({ ...prev, resume: file }))
      setErrors(prev => ({ ...prev, resume: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) newErrors.phone = "Phone number is invalid"
    if (!formData.experience) newErrors.experience = "Experience level is required"
    if (!formData.noticePeriod) newErrors.noticePeriod = "Notice period is required"
    if (!formData.expectedSalary.trim()) newErrors.expectedSalary = "Expected salary is required"
    if (!formData.resume) newErrors.resume = "Resume is required"
    if (!formData.whyInterested.trim()) newErrors.whyInterested = "Please tell us why you're interested"
    if (!formData.availableForInterview) newErrors.availableForInterview = "Interview availability is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: "Please fill all required fields",
        description: "Check the form for errors and try again",
        variant: "destructive"
      })
      return
    }

    setIsSubmitting(true)

    try {
      console.log('Job being applied for:', {
        id: job.id,
        title: job.title,
        company: job.company,
        status: job.status
      });

      const applicationData = {
        jobId: String(job.id),
        jobTitle: job.title,
        company: job.company,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        experience: formData.experience,
        currentCompany: formData.currentCompany,
        currentRole: formData.currentRole,
        noticePeriod: formData.noticePeriod,
        expectedSalary: formData.expectedSalary,
        coverLetter: formData.coverLetter,
        linkedinProfile: formData.linkedinProfile,
        portfolioWebsite: formData.portfolioWebsite,
        whyInterested: formData.whyInterested,
        availableForInterview: formData.availableForInterview
      }

      console.log('Application data being submitted:', applicationData);

      await apiClient.submitApplication(applicationData, formData.resume!)
      
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application for ${job.title} at ${job.company} has been submitted. We'll get back to you soon.`
      })
      
      onClose()
      
      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        experience: "",
        currentCompany: "",
        currentRole: "",
        noticePeriod: "",
        expectedSalary: "",
        resume: null,
        coverLetter: "",
        linkedinProfile: "",
        portfolioWebsite: "",
        whyInterested: "",
        availableForInterview: ""
      })
    } catch (error) {
      console.error('Application submission error:', error);
      
      // Extract detailed error message
      let errorMessage = "There was an error submitting your application. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Apply for {job.title} at {job.company}
          </DialogTitle>
        </DialogHeader>

        <Card className="p-4 bg-blue-50/50 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0">
              {!imageError ? (
                <Image
                  src={getCompanyLogo(job.company)}
                  alt={`${job.company} logo`}
                  width={48}
                  height={48}
                  className="w-full h-full object-contain p-2"
                  onError={() => setImageError(true)}
                  unoptimized
                  loading="lazy"
                  style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm border border-primary/20 rounded">
                  {job.company.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company} • {job.location} • ₹{job.salary}</p>
            </div>
          </div>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  className={errors.fullName ? "border-red-500" : ""}
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+91 9876543210"
                className={errors.phone ? "border-red-500" : ""}
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Professional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select value={formData.experience} onValueChange={(value) => handleInputChange("experience", value)}>
                  <SelectTrigger className={errors.experience ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-1">0-1 years</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-8">5-8 years</SelectItem>
                    <SelectItem value="8+">8+ years</SelectItem>
                  </SelectContent>
                </Select>
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>

              <div>
                <Label htmlFor="currentCompany">Current Company</Label>
                <Input
                  id="currentCompany"
                  value={formData.currentCompany}
                  onChange={(e) => handleInputChange("currentCompany", e.target.value)}
                  placeholder="Your current employer"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currentRole">Current Role</Label>
              <Input
                id="currentRole"
                value={formData.currentRole}
                onChange={(e) => handleInputChange("currentRole", e.target.value)}
                placeholder="Your current job title"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="noticePeriod">Notice Period *</Label>
                <Select value={formData.noticePeriod} onValueChange={(value) => handleInputChange("noticePeriod", value)}>
                  <SelectTrigger className={errors.noticePeriod ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select notice period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="immediate">Immediate</SelectItem>
                    <SelectItem value="15days">15 days</SelectItem>
                    <SelectItem value="1month">1 month</SelectItem>
                    <SelectItem value="2months">2 months</SelectItem>
                    <SelectItem value="3months">3 months</SelectItem>
                  </SelectContent>
                </Select>
                {errors.noticePeriod && <p className="text-red-500 text-sm mt-1">{errors.noticePeriod}</p>}
              </div>

              <div>
                <Label htmlFor="expectedSalary">Expected Salary (LPA) *</Label>
                <Input
                  id="expectedSalary"
                  value={formData.expectedSalary}
                  onChange={(e) => handleInputChange("expectedSalary", e.target.value)}
                  placeholder="e.g., 12"
                  className={errors.expectedSalary ? "border-red-500" : ""}
                />
                {errors.expectedSalary && <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>}
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Documents & Links</h3>
            
            <div>
              <Label htmlFor="resume">Upload Resume *</Label>
              <Input
                id="resume"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className={errors.resume ? "border-red-500" : ""}
              />
              <p className="text-sm text-gray-500 mt-1">PDF or DOC format, max 5MB</p>
              {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="linkedinProfile">LinkedIn Profile</Label>
                <Input
                  id="linkedinProfile"
                  value={formData.linkedinProfile}
                  onChange={(e) => handleInputChange("linkedinProfile", e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label htmlFor="portfolioWebsite">Portfolio Website</Label>
                <Input
                  id="portfolioWebsite"
                  value={formData.portfolioWebsite}
                  onChange={(e) => handleInputChange("portfolioWebsite", e.target.value)}
                  placeholder="https://yourportfolio.com"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Additional Information</h3>
            
            <div>
              <Label htmlFor="whyInterested">Why are you interested in this role? *</Label>
              <Textarea
                id="whyInterested"
                value={formData.whyInterested}
                onChange={(e) => handleInputChange("whyInterested", e.target.value)}
                placeholder="Tell us what excites you about this opportunity..."
                rows={4}
                className={errors.whyInterested ? "border-red-500" : ""}
              />
              {errors.whyInterested && <p className="text-red-500 text-sm mt-1">{errors.whyInterested}</p>}
            </div>

            <div>
              <Label htmlFor="coverLetter">Cover Letter (Optional)</Label>
              <Textarea
                id="coverLetter"
                value={formData.coverLetter}
                onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                placeholder="Additional information about your background and qualifications..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="availableForInterview">When are you available for an interview? *</Label>
              <Select value={formData.availableForInterview} onValueChange={(value) => handleInputChange("availableForInterview", value)}>
                <SelectTrigger className={errors.availableForInterview ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="anytime">Any time</SelectItem>
                  <SelectItem value="weekdays">Weekdays only</SelectItem>
                  <SelectItem value="weekends">Weekends only</SelectItem>
                  <SelectItem value="evenings">Evenings only</SelectItem>
                  <SelectItem value="specific">Will specify later</SelectItem>
                </SelectContent>
              </Select>
              {errors.availableForInterview && <p className="text-red-500 text-sm mt-1">{errors.availableForInterview}</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}