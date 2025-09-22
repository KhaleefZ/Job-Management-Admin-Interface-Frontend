"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Job, useJobStore } from "@/lib/job-store"
import { toast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api-client"
import { ApplicationModal } from "@/components/application-modal"
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar, 
  Briefcase, 
  GraduationCap,
  Heart,
  Share2,
  Send,
  CheckCircle,
  FileText,
  Upload,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  MessageCircle
} from "lucide-react"

interface JobDetailsModalProps {
  job: Job | null
  isOpen: boolean
  onClose: () => void
}

export function JobDetailsModal({ job, isOpen, onClose }: JobDetailsModalProps) {
  const [showApplicationForm, setShowApplicationForm] = useState(false)
  const [applicationSubmitted, setApplicationSubmitted] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false)
  const [applicationData, setApplicationData] = useState({
    fullName: "",
    email: "",
    phone: "",
    coverLetter: "",
    resume: null as File | null
  })
  const toggleLike = useJobStore(state => state.toggleLike)

  if (!job) return null

  const getCompanyLogo = (company: string) => {
    const logoMap: { [key: string]: string } = {
      "Google": "/google-logo.svg",
      "Microsoft": "/microsoft-logo.svg", 
      "Apple": "/apple-logo.svg",
      "Amazon": "/amazon-logo.png",
      "Tesla": "/tesla-logo.png",
      "Netflix": "/netflix-logo.svg",
      "Meta": "/meta-logo.svg",
      "Uber": "/uber-logo.svg",
      "Airbnb": "/airbnb-logo.svg",
      "Spotify": "/spotify-logo.svg",
      "Adobe": "/adobe-logo.svg",
      "Salesforce": "/salesforce-logo.svg",
      "Twitter": "/twitter-logo.svg",
      "LinkedIn": "/linkedin-logo.svg",
      "Stripe": "/stripe-logo.svg",
      "Slack": "/slack-logo.svg",
      "Zoom": "/zoom-logo.svg",
      "Swiggy": "/swiggy-logo-orange.jpg"
    }
    return logoMap[company] || "/placeholder-logo.svg"
  }

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!applicationData.fullName.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter your full name",
        variant: "destructive",
      })
      return
    }
    
    if (!applicationData.email.trim()) {
      toast({
        title: "Validation Error", 
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(applicationData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }
    
    if (!applicationData.resume) {
      toast({
        title: "Validation Error",
        description: "Please upload your resume",
        variant: "destructive",
      })
      return
    }

    try {
      // Show loading state
      toast({
        title: "Submitting Application",
        description: "Please wait while we process your application...",
      })

      // In a real implementation, you would upload the resume file first
      // For this demo, we'll use a placeholder URL
      const resumeUrl = applicationData.resume ? `/uploads/resumes/${applicationData.resume.name}` : undefined

      // Submit application via API
      console.log('Submitting application - isAuthenticated:' );
      console.log('Job ID:', job!.id.toString());
      await apiClient.applyToJob(job!.id.toString(), {
        full_name: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone || undefined,
        cover_letter: applicationData.coverLetter || undefined,
        resume_url: resumeUrl,
        resume_filename: applicationData.resume?.name,
      })
      
      setApplicationSubmitted(true)
      toast({
        title: "Application Submitted Successfully!",
        description: `Your application for ${job?.title} at ${job?.company} has been submitted.`,
      })
      
      setTimeout(() => {
        setShowApplicationForm(false)
        setApplicationSubmitted(false)
        // Reset form data
        setApplicationData({
          fullName: "",
          email: "",
          phone: "",
          coverLetter: "",
          resume: null
        })
        onClose()
      }, 3000)
    } catch (error: any) {
      console.error('Application submission error:', error)
      const errorMessage = error?.response?.data?.error || error?.message || "There was an error submitting your application. Please try again."
      toast({
        title: "Application Failed",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setApplicationData(prev => ({ ...prev, resume: file }))
    }
  }

  const handleLike = () => {
    if (job) {
      toggleLike(job.id)
      toast({
        title: job.isLiked ? "Removed from favorites" : "Added to favorites",
        description: job.isLiked ? "Job removed from your favorites" : "Job saved to your favorites",
      })
    }
  }

  const handleShare = (platform?: string) => {
    if (!job) return
    
    const jobUrl = `${window.location.origin}/jobs/${job.id}`
    const shareText = `Check out this job opportunity: ${job.title} at ${job.company} - ${job.salary}`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(jobUrl)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(jobUrl)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(jobUrl)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + jobUrl)}`, '_blank')
        break
      case 'copy':
      default:
        navigator.clipboard.writeText(jobUrl).then(() => {
          toast({
            title: "Link copied!",
            description: "Job link has been copied to clipboard",
          })
          setShowShareMenu(false)
        }).catch(() => {
          toast({
            title: "Share failed",
            description: "Unable to copy link",
            variant: "destructive",
          })
        })
    }
  }

  const jobRequirements = [
    "Bachelor's degree in Computer Science or related field",
    `${job.experience} years of professional experience`,
    "Strong problem-solving and analytical skills",
    "Experience with modern development frameworks",
    "Excellent communication and teamwork abilities",
    "Knowledge of software development best practices",
    "Experience with version control systems (Git)",
    "Understanding of database design and optimization"
  ]

  const responsibilities = [
    "Design and develop high-quality software solutions",
    "Collaborate with cross-functional teams to deliver projects",
    "Participate in code reviews and maintain code quality",
    "Troubleshoot and debug complex technical issues",
    "Contribute to architectural decisions and technical planning",
    "Mentor junior team members and share knowledge",
    "Stay updated with latest technologies and industry trends",
    "Participate in agile development processes"
  ]

  const benefits = [
    "Competitive salary and equity package",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work arrangements and remote options",
    "Professional development and learning opportunities",
    "Generous PTO and sabbatical programs",
    "State-of-the-art equipment and workspace",
    "Team building events and company retreats",
    "Wellness programs and mental health support"
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto p-8">
        {!showApplicationForm && !applicationSubmitted ? (
          <div>
            <DialogHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={getCompanyLogo(job.company)} alt={job.company} />
                  <AvatarFallback>{job.company[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                    {job.title}
                  </DialogTitle>
                  <div className="flex items-center space-x-4 text-muted-foreground mb-4">
                    <span className="font-semibold text-primary">{job.company}</span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.jobType}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">{job.jobType}</Badge>
                    <Badge variant="outline">{job.experience}</Badge>
                    <Badge variant="outline" className="text-green-600">
                      <span className="text-xs mr-1">₹</span>
                      {job.salary}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleLike}
                    className={`${job.isLiked ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' : 'hover:text-red-600 hover:border-red-200'}`}
                  >
                    <Heart className={`h-4 w-4 ${job.isLiked ? 'fill-current' : ''}`} />
                    <span className="ml-1 text-xs">{job.likesCount || 0}</span>
                  </Button>
                  <div className="relative">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="hover:text-blue-600 hover:border-blue-200"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
                        <div className="py-2">
                          <button
                            onClick={() => handleShare('copy')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Copy className="h-4 w-4" />
                            Copy Link
                          </button>
                          <button
                            onClick={() => handleShare('linkedin')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Linkedin className="h-4 w-4" />
                            LinkedIn
                          </button>
                          <button
                            onClick={() => handleShare('twitter')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Twitter className="h-4 w-4" />
                            Twitter
                          </button>
                          <button
                            onClick={() => handleShare('facebook')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Facebook className="h-4 w-4" />
                            Facebook
                          </button>
                          <button
                            onClick={() => handleShare('whatsapp')}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <MessageCircle className="h-4 w-4" />
                            WhatsApp
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Job Overview */}
              <Card className="p-8 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-8 text-center">Job Overview</h3>
                <div className="grid grid-cols-4 gap-12">
                  <div className="text-center">
                    <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="h-8 w-8 text-blue-600" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Experience</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{job.experience}</div>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-green-600">₹</span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Salary</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{job.salary}</div>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Job Type</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{job.jobType}</div>
                  </div>
                  <div className="text-center">
                    <div className="h-16 w-16 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="h-8 w-8 text-orange-600" />
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Posted</div>
                    <div className="text-xl font-semibold text-gray-900 dark:text-gray-100">{job.postedTime}</div>
                  </div>
                </div>
              </Card>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Job Description</h3>
                <div className="text-muted-foreground space-y-3">
                  <p>
                    We are seeking a talented {job.title} to join our team at {job.company}. 
                    This is an exciting opportunity to work with cutting-edge technology and contribute to 
                    innovative projects that impact millions of users worldwide.
                  </p>
                  <p>
                    In this role, you will be responsible for designing, developing, and maintaining high-quality 
                    software solutions. You'll work closely with cross-functional teams including product managers, 
                    designers, and other engineers to deliver exceptional user experiences.
                  </p>
                  <p>
                    We're looking for someone who is passionate about technology, enjoys solving complex problems, 
                    and thrives in a collaborative environment. This position offers excellent growth opportunities 
                    and the chance to work on meaningful projects.
                  </p>
                </div>
              </div>

              {/* Key Responsibilities */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Responsibilities</h3>
                <ul className="space-y-2">
                  {responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Requirements</h3>
                <ul className="space-y-2">
                  {jobRequirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <GraduationCap className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Benefits & Perks</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              {/* Apply Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">Ready to Apply?</h4>
                    <p className="text-sm text-muted-foreground">
                      Join {job.company} and be part of their amazing team. We'll review your application within 48 hours.
                    </p>
                  </div>
                  <div className="ml-6">
                    <Button 
                      onClick={() => {
                        setIsApplicationModalOpen(true)
                      }}
                      size="lg"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-8 py-3"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Apply Now
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Free to apply
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Quick 2-minute process
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    Direct to employer
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : showApplicationForm && !applicationSubmitted ? (
          <div>
            <DialogHeader>
              <div className="flex items-center space-x-4 mb-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={getCompanyLogo(job.company)} alt={job.company} />
                  <AvatarFallback>{job.company[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-xl font-bold text-foreground">
                    Apply for {job.title}
                  </DialogTitle>
                  <p className="text-muted-foreground">at {job.company}</p>
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  📝 Please fill out all required fields. We'll review your application and get back to you within 48 hours.
                </p>
              </div>
            </DialogHeader>

            <form onSubmit={handleApplicationSubmit} className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={applicationData.fullName}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={applicationData.email}
                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={applicationData.phone}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="resume">Resume/CV *</Label>
                <div className="mt-2">
                  <Input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileUpload}
                    required
                  />
                  {applicationData.resume && (
                    <div className="mt-2 flex items-center space-x-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{applicationData.resume.name}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="coverLetter">Cover Letter</Label>
                <Textarea
                  id="coverLetter"
                  placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                  rows={6}
                  value={applicationData.coverLetter}
                  onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowApplicationForm(false)}
                >
                  Back to Job Details
                </Button>
                <Button type="submit">
                  <Send className="h-4 w-4 mr-2" />
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className="text-center py-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-foreground mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground">
              Thank you for applying to {job.title} at {job.company}. 
              We'll review your application and get back to you within 48 hours.
            </p>
          </div>
        )}
      </DialogContent>
      
      {job && (
        <ApplicationModal
          job={job}
          isOpen={isApplicationModalOpen}
          onClose={() => setIsApplicationModalOpen(false)}
        />
      )}
    </Dialog>
  )
}