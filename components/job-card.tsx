"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { JobDetailsModal } from "@/components/job-details-modal"
import { Job, useJobStore } from "@/lib/job-store"
import Image from "next/image"
import { useState } from "react"
import { Heart, Share2, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface JobCardProps {
  job: Job
}

export function JobCard({ job }: JobCardProps) {
  const [imageError, setImageError] = useState(false)
  const [showJobDetails, setShowJobDetails] = useState(false)
  const toggleLike = useJobStore(state => state.toggleLike)

  // Map company names to actual logos with fallbacks
  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(job.id)
    toast({
      title: job.isLiked ? "Removed from favorites" : "Added to favorites",
      description: job.isLiked ? "Job removed from your favorites" : "Job saved to your favorites",
    })
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const jobUrl = `${window.location.origin}/jobs/${job.id}`
    const shareData = {
      title: `${job.title} at ${job.company}`,
      text: `Check out this job opportunity: ${job.title} at ${job.company} - ${job.salary}`,
      url: jobUrl,
    }

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData).catch(console.error)
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(jobUrl).then(() => {
        toast({
          title: "Link copied!",
          description: "Job link has been copied to clipboard",
        })
      }).catch(() => {
        toast({
          title: "Share failed",
          description: "Unable to share or copy link",
          variant: "destructive",
        })
      })
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

  return (
    <Card className="relative bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow duration-200">
      {/* Posted Time Badge */}
      <Badge
        variant="secondary"
        className="absolute top-4 right-4 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md font-medium"
      >
        {job.postedTime}
      </Badge>

      {/* Company Logo */}
      <div className="flex items-start mb-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex items-center justify-center mr-4 flex-shrink-0">
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
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{job.title}</h3>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
            {job.experience}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>
            {job.location}
          </span>
          <span className="flex items-center gap-1 font-medium text-foreground">
            <span className="w-1 h-1 bg-muted-foreground rounded-full"></span>₹{job.salary}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{job.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleLike}
            className={`flex items-center gap-1.5 ${job.isLiked ? 'text-red-600 border-red-200 bg-red-50 hover:bg-red-100' : 'hover:text-red-600 hover:border-red-200'}`}
          >
            <Heart className={`h-4 w-4 ${job.isLiked ? 'fill-current' : ''}`} />
            <span className="text-xs">{job.likesCount || 0}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-blue-600 hover:border-blue-200"
          >
            <Share2 className="h-4 w-4" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowJobDetails(true)}
          className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <span className="text-xs">View Details</span>
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      {/* Apply Button */}
      <Button 
        onClick={() => setShowJobDetails(true)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors duration-200"
      >
        Apply Now
      </Button>

      {/* Job Details Modal */}
      <JobDetailsModal 
        job={job}
        isOpen={showJobDetails}
        onClose={() => setShowJobDetails(false)}
      />
    </Card>
  )
}
