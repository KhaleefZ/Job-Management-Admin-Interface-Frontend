"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Star, Briefcase, GraduationCap, Clock } from "lucide-react"
import { useState } from "react"

export function FindTalentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [skillFilter, setSkillFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")

  const talents = [
    {
      id: 1,
      name: "Rahul Sharma",
      title: "Senior Full Stack Developer",
      location: "Bangalore, India",
      experience: "5+ years",
      rating: 4.9,
      skills: ["React", "Node.js", "TypeScript", "AWS"],
      image: "/placeholder-user.jpg",
      hourlyRate: "₹2,500/hr",
      availability: "Available",
      description: "Experienced full-stack developer with expertise in modern web technologies and cloud architecture."
    },
    {
      id: 2,
      name: "Priya Patel",
      title: "UX/UI Designer",
      location: "Mumbai, India",
      experience: "4+ years",
      rating: 4.8,
      skills: ["Figma", "Adobe XD", "Prototyping", "User Research"],
      image: "/placeholder-user.jpg",
      hourlyRate: "₹2,000/hr",
      availability: "Available",
      description: "Creative designer focused on user-centered design and creating intuitive digital experiences."
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Data Scientist",
      location: "Austin, TX",
      experience: "3+ years",
      rating: 4.7,
      skills: ["Python", "Machine Learning", "SQL", "Tableau"],
      image: "/placeholder-user.jpg",
      hourlyRate: "₹2,200/hr",
      availability: "Busy",
      description: "Data scientist specializing in machine learning models and predictive analytics for business insights."
    },
    {
      id: 4,
      name: "Vikram Kumar",
      title: "DevOps Engineer",
      location: "Pune, India",
      experience: "6+ years",
      rating: 4.9,
      skills: ["Docker", "Kubernetes", "AWS", "Terraform"],
      image: "/placeholder-user.jpg",
      hourlyRate: "₹2,800/hr",
      availability: "Available",
      description: "DevOps expert with extensive experience in cloud infrastructure and CI/CD pipeline automation."
    },
    {
      id: 5,
      name: "Sneha Reddy",
      title: "Product Manager",
      location: "Chennai, India",
      experience: "7+ years",
      rating: 4.8,
      skills: ["Product Strategy", "Agile", "Analytics", "Leadership"],
      image: "/placeholder-user.jpg",
      hourlyRate: "₹3,000/hr",
      availability: "Available",
      description: "Strategic product manager with a track record of launching successful digital products and leading cross-functional teams."
    },
    {
      id: 6,
      name: "Amit Gupta",
      title: "Mobile App Developer",
      location: "Delhi, India",
      experience: "4+ years",
      rating: 4.6,
      skills: ["React Native", "Flutter", "iOS", "Android"],
      image: "/placeholder-user.jpg",
      hourlyRate: "₹2,300/hr",
      availability: "Available",
      description: "Mobile development specialist creating high-performance apps for iOS and Android platforms."
    }
  ]

  const filteredTalents = talents.filter(talent => {
    const matchesSearch = searchTerm === "" || 
      talent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      talent.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesSkill = skillFilter === "all" || 
      talent.skills.some(skill => skill.toLowerCase().includes(skillFilter.toLowerCase()))
    
    const matchesExperience = experienceFilter === "all" || talent.experience.includes(experienceFilter)
    
    return matchesSearch && matchesSkill && matchesExperience
  })

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">Find Top Talent</h1>
        <p className="text-muted-foreground">
          Connect with skilled professionals ready to bring your projects to life.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name, title, or skills"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>

          {/* Skills Filter */}
          <Select value={skillFilter} onValueChange={setSkillFilter}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Filter by Skills" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Skills</SelectItem>
              <SelectItem value="react">React</SelectItem>
              <SelectItem value="node">Node.js</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="aws">AWS</SelectItem>
            </SelectContent>
          </Select>

          {/* Experience Filter */}
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="3+">3+ Years</SelectItem>
              <SelectItem value="5+">5+ Years</SelectItem>
              <SelectItem value="7+">7+ Years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-muted-foreground">
          Showing {filteredTalents.length} talent{filteredTalents.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Talent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTalents.map((talent) => (
          <Card key={talent.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={talent.image} alt={talent.name} />
                  <AvatarFallback>
                    {talent.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{talent.name}</h3>
                  <p className="text-sm text-muted-foreground">{talent.title}</p>
                </div>
              </div>
              <Badge 
                variant={talent.availability === "Available" ? "default" : "secondary"}
                className={talent.availability === "Available" ? "bg-green-100 text-green-700" : ""}
              >
                {talent.availability}
              </Badge>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-2" />
                {talent.location}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4 mr-2" />
                {talent.experience}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400" />
                {talent.rating} rating
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {talent.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
              {talent.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {talent.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{talent.skills.length - 3} more
                </Badge>
              )}
            </div>

            {/* Rate & Action */}
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">{talent.hourlyRate}</span>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                Contact
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredTalents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No talents found matching your criteria.</p>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters.</p>
        </div>
      )}
    </div>
  )
}