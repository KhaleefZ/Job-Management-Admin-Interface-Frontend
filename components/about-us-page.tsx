"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Target, Users, Zap, Shield, Heart, Award } from "lucide-react"

export function AboutUsPage() {
  const values = [
    {
      icon: Target,
      title: "Mission-Driven",
      description: "We're committed to connecting talented individuals with meaningful career opportunities."
    },
    {
      icon: Users,
      title: "People-First",
      description: "Every decision we make prioritizes the success and well-being of our community."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously evolve our platform to provide the best experience for job seekers and employers."
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description: "Your data and privacy are protected with enterprise-grade security measures."
    }
  ]

  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      description: "Former tech executive with 15+ years of experience in talent acquisition and product development.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      description: "Engineering leader who previously built scalable platforms at major tech companies.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Vikram Patel",
      role: "Head of Product",
      description: "Product strategist focused on creating user-centric experiences that drive results.",
      image: "/placeholder-user.jpg"
    },
    {
      name: "Sneha Gupta",
      role: "VP of Operations",
      description: "Operations expert ensuring smooth platform performance and customer success.",
      image: "/placeholder-user.jpg"
    }
  ]

  const stats = [
    { number: "50K+", label: "Active Job Seekers" },
    { number: "500+", label: "Partner Companies" },
    { number: "10K+", label: "Successful Placements" },
    { number: "95%", label: "Customer Satisfaction" }
  ]

  const achievements = [
    "Best Job Platform 2024 - TechAwards",
    "Top 50 Startups to Watch - Business Weekly",
    "Excellence in Innovation - HR Tech Summit",
    "Best User Experience - UX Design Awards"
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-6">About JobBoard</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
          We're revolutionizing the way people find jobs and companies discover talent. 
          Our platform connects ambitious professionals with forward-thinking organizations 
          to create meaningful career opportunities.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Statement */}
      <section className="mb-16">
        <Card className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-none">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-lg text-muted-foreground max-w-4xl mx-auto">
              To democratize access to career opportunities by creating a transparent, efficient, 
              and inclusive platform where talent meets opportunity. We believe everyone deserves 
              a chance to find work they love and companies deserve access to the best talent.
            </p>
          </div>
        </Card>
      </section>

      {/* Core Values */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarImage src={member.image} alt={member.name} />
                <AvatarFallback className="text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold text-foreground mb-1">{member.name}</h3>
              <p className="text-sm text-primary mb-3">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Company Story */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Founded in 2020, JobBoard started with a simple observation: the job search process 
                was broken for both candidates and employers. Traditional job boards were cluttered, 
                impersonal, and inefficient.
              </p>
              <p>
                Our founders, having experienced these frustrations firsthand, set out to build 
                something better. They envisioned a platform that would use modern technology 
                to create meaningful connections between talent and opportunity.
              </p>
              <p>
                Today, we're proud to serve thousands of job seekers and hundreds of companies, 
                facilitating thousands of successful job placements and career transitions.
              </p>
            </div>
          </div>
          <Card className="p-8">
            <h3 className="text-xl font-semibold text-foreground mb-4">Recognition & Awards</h3>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">{achievement}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <Card className="p-8 bg-gradient-to-r from-primary/10 to-secondary/10">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Mission</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Whether you're looking for your next career opportunity or seeking to build an amazing team, 
            we're here to help you succeed. Join thousands who have already found their perfect match.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Badge variant="outline" className="px-4 py-2">🚀 Fast Growing</Badge>
            <Badge variant="outline" className="px-4 py-2">🌟 Award Winning</Badge>
            <Badge variant="outline" className="px-4 py-2">💼 Career Focused</Badge>
          </div>
        </Card>
      </section>
    </div>
  )
}