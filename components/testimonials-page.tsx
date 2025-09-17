"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Quote, TrendingUp, Users, Briefcase, MapPin } from "lucide-react"

export function TestimonialsPage() {
  const testimonials = [
    {
      id: 1,
      name: "Arjun Patel",
      role: "Senior Software Engineer",
      company: "Tesla",
      location: "Bangalore, India",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "JobBoard completely transformed my job search experience. Within 2 weeks, I had multiple offers from top tech companies. The platform's matching algorithm is incredibly accurate!",
      outcome: "Got dream job in 2 weeks",
      category: "job-seeker"
    },
    {
      id: 2,
      name: "Priya Sharma",
      role: "HR Director",
      company: "Amazon",
      location: "Hyderabad, India",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "As a recruiter, I've used many platforms, but JobBoard stands out. The quality of candidates is exceptional, and the interface makes screening so much easier. We've hired 15+ people through this platform.",
      outcome: "Hired 15+ quality candidates",
      category: "employer"
    },
    {
      id: 3,
      name: "Ravi Kumar",
      role: "Product Manager",
      company: "Google",
      location: "Mumbai, India",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "I was skeptical about online job platforms, but JobBoard proved me wrong. The personalized job recommendations were spot-on, and I found my current role within a month.",
      outcome: "Found perfect role in 1 month",
      category: "job-seeker"
    },
    {
      id: 4,
      name: "Vikram Singh",
      role: "Startup Founder",
      company: "TechStart Inc",
      location: "Pune, India",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "Building our founding team was crucial, and JobBoard helped us find exceptional talent. The platform's filtering options and candidate profiles made our hiring process incredibly efficient.",
      outcome: "Built founding team successfully",
      category: "employer"
    },
    {
      id: 5,
      name: "Sneha Reddy",
      role: "UX Designer",
      company: "Microsoft",
      location: "Chennai, India",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "The job search can be overwhelming, but JobBoard made it manageable. I loved the clean interface and the fact that employers actually respond quickly. Landed my dream design role!",
      outcome: "Landed dream design role",
      category: "job-seeker"
    },
    {
      id: 6,
      name: "Amit Gupta",
      role: "Engineering Manager",
      company: "Netflix",
      location: "Delhi, India",
      image: "/placeholder-user.jpg",
      rating: 5,
      text: "We needed to scale our engineering team quickly. JobBoard's advanced search and candidate matching helped us identify and hire 8 engineers in just 3 months. Impressive platform!",
      outcome: "Hired 8 engineers in 3 months",
      category: "employer"
    }
  ]

  const stats = [
    { number: "4.9/5", label: "Average Rating", icon: Star },
    { number: "95%", label: "Success Rate", icon: TrendingUp },
    { number: "10K+", label: "Happy Users", icon: Users },
    { number: "500+", label: "Companies", icon: Briefcase }
  ]

  const categories = [
    { name: "All", value: "all", count: testimonials.length },
    { name: "Job Seekers", value: "job-seeker", count: testimonials.filter(t => t.category === "job-seeker").length },
    { name: "Employers", value: "employer", count: testimonials.filter(t => t.category === "employer").length }
  ]

  const successStories = [
    {
      title: "From Unemployed to Google",
      description: "Rahul went from 6 months of unemployment to landing a senior role at Google",
      timeframe: "3 weeks",
      industry: "Technology"
    },
    {
      title: "Startup Success",
      description: "TechCorp built their entire 20-person team through our platform",
      timeframe: "6 months",
      industry: "Startup"
    },
    {
      title: "Career Pivot",
      description: "Priya successfully transitioned from finance to product management",
      timeframe: "2 months",
      industry: "Fintech"
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-6">Success Stories</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          Discover how JobBoard has helped thousands of professionals advance their careers 
          and companies build exceptional teams.
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
          {stats.map((stat, index) => (
            <Card key={index} className="p-6 text-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>
      </section>

      {/* Success Stories Highlight */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Featured Success Stories</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {successStories.map((story, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="secondary">{story.timeframe}</Badge>
                <Badge variant="outline">{story.industry}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{story.title}</h3>
              <p className="text-sm text-muted-foreground">{story.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">What Our Users Say</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="p-6 hover:shadow-lg transition-shadow relative">
              <Quote className="absolute top-4 right-4 h-6 w-6 text-primary/20" />
              
              {/* Header */}
              <div className="flex items-center space-x-3 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <span>{testimonial.company}</span>
                    <span>•</span>
                    <MapPin className="h-3 w-3" />
                    <span>{testimonial.location}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-sm text-muted-foreground mb-4">"{testimonial.text}"</p>

              {/* Outcome */}
              <div className="pt-4 border-t border-border">
                <Badge 
                  variant={testimonial.category === "job-seeker" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {testimonial.outcome}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-none">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
            Join thousands of professionals who have transformed their careers with JobBoard. 
            Your next opportunity is just one click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-6 py-3 text-base">
              🎯 Personalized Matches
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-base">
              ⚡ Fast Hiring
            </Badge>
            <Badge variant="outline" className="px-6 py-3 text-base">
              🤝 Trusted Platform
            </Badge>
          </div>
        </Card>
      </section>

      {/* Review Prompt */}
      <section className="mt-16 text-center">
        <Card className="p-6 max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold text-foreground mb-3">Share Your Experience</h3>
          <p className="text-muted-foreground mb-4">
            Found your dream job or hired amazing talent through JobBoard? We'd love to hear your story!
          </p>
          <Badge variant="secondary" className="px-4 py-2">
            📝 Submit Your Testimonial
          </Badge>
        </Card>
      </section>
    </div>
  )
}