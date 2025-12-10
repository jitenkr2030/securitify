"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Building2,
  Heart,
  Zap,
  Shield,
  Search,
  Filter,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  Globe,
  Coffee,
  Wifi,
  Car,
  HeartHandshake,
  GraduationCap,
  Code,
  Palette,
  BarChart3
} from "lucide-react";
import Link from "next/link";

export default function CareersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const departments = [
    { id: "all", name: "All Departments", count: 12 },
    { id: "engineering", name: "Engineering", count: 5 },
    { id: "product", name: "Product", count: 2 },
    { id: "sales", name: "Sales", count: 2 },
    { id: "marketing", name: "Marketing", count: 1 },
    { id: "operations", name: "Operations", count: 2 }
  ];

  const jobOpenings = [
    {
      id: 1,
      title: "Senior Full Stack Developer",
      department: "engineering",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "5+ years",
      salary: "₹18-25 LPA",
      description: "We're looking for an experienced full-stack developer to join our engineering team and help build the future of security management.",
      requirements: [
        "5+ years of experience with React, Node.js, and TypeScript",
        "Experience with Next.js and modern web frameworks",
        "Strong understanding of database design and optimization",
        "Experience with cloud platforms and DevOps practices",
        "Excellent problem-solving and communication skills"
      ],
      benefits: ["Competitive salary", "Stock options", "Flexible work hours", "Remote work options"],
      posted: "2024-01-15",
      deadline: "2024-02-15",
      featured: true
    },
    {
      id: 2,
      title: "Product Manager",
      department: "product",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹15-20 LPA",
      description: "Join our product team to shape the future of security management software and drive product strategy.",
      requirements: [
        "3+ years of product management experience",
        "Experience with SaaS products or B2B software",
        "Strong analytical and problem-solving skills",
        "Excellent communication and leadership abilities",
        "Experience with agile development methodologies"
      ],
      benefits: ["Competitive salary", "Stock options", "Health insurance", "Professional development"],
      posted: "2024-01-12",
      deadline: "2024-02-12",
      featured: false
    },
    {
      id: 3,
      title: "Mobile App Developer (React Native)",
      department: "engineering",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹12-18 LPA",
      description: "Help us build amazing mobile experiences for security guards and managers using React Native.",
      requirements: [
        "3+ years of React Native development experience",
        "Strong knowledge of iOS and Android development",
        "Experience with mobile app architecture and performance optimization",
        "Familiarity with RESTful APIs and real-time communication",
        "Experience with testing frameworks and CI/CD"
      ],
      benefits: ["Competitive salary", "Stock options", "Flexible work hours", "Learning budget"],
      posted: "2024-01-10",
      deadline: "2024-02-10",
      featured: false
    },
    {
      id: 4,
      title: "Sales Development Representative",
      department: "sales",
      location: "Delhi, India",
      type: "Full-time",
      experience: "1-2 years",
      salary: "₹8-12 LPA + Commission",
      description: "Drive our growth by identifying and qualifying new business opportunities in the security industry.",
      requirements: [
        "1-2 years of sales or business development experience",
        "Excellent communication and interpersonal skills",
        "Experience with CRM software and sales tools",
        "Self-motivated with strong work ethic",
        "Ability to work in a fast-paced environment"
      ],
      benefits: ["Competitive salary + commission", "Uncapped earning potential", "Sales training", "Career growth"],
      posted: "2024-01-08",
      deadline: "2024-02-08",
      featured: false
    },
    {
      id: 5,
      title: "DevOps Engineer",
      department: "engineering",
      location: "Bangalore, India",
      type: "Full-time",
      experience: "4+ years",
      salary: "₹15-22 LPA",
      description: "Build and maintain our cloud infrastructure and ensure the reliability and scalability of our platform.",
      requirements: [
        "4+ years of DevOps or infrastructure experience",
        "Experience with AWS, Azure, or GCP",
        "Knowledge of containerization and orchestration (Docker, Kubernetes)",
        "Experience with CI/CD pipelines and infrastructure as code",
        "Strong understanding of security best practices"
      ],
      benefits: ["Competitive salary", "Stock options", "Remote work options", "Conference budget"],
      posted: "2024-01-05",
      deadline: "2024-02-05",
      featured: false
    },
    {
      id: 6,
      title: "UX/UI Designer",
      department: "product",
      location: "Mumbai, India",
      type: "Full-time",
      experience: "3+ years",
      salary: "₹10-15 LPA",
      description: "Create intuitive and beautiful user experiences for our security management platform.",
      requirements: [
        "3+ years of UX/UI design experience",
        "Proficiency in design tools (Figma, Sketch, Adobe Creative Suite)",
        "Strong portfolio demonstrating design thinking and problem-solving",
        "Experience with user research and usability testing",
        "Understanding of web and mobile design principles"
      ],
      benefits: ["Competitive salary", "Creative freedom", "Design budget", "Flexible work environment"],
      posted: "2024-01-03",
      deadline: "2024-02-03",
      featured: false
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "Competitive Compensation",
      description: "Market-leading salaries and comprehensive benefits package"
    },
    {
      icon: HeartHandshake,
      title: "Stock Options",
      description: "Own a piece of the company and share in our success"
    },
    {
      icon: Calendar,
      title: "Flexible Work Hours",
      description: "Work-life balance with flexible scheduling options"
    },
    {
      icon: Wifi,
      title: "Remote Work",
      description: "Work from anywhere with our remote-friendly culture"
    },
    {
      icon: GraduationCap,
      title: "Learning & Development",
      description: "Continuous learning opportunities and professional growth"
    },
    {
      icon: Coffee,
      title: "Great Office Culture",
      description: "Collaborative environment with amazing colleagues"
    }
  ];

  const cultureValues = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize security and privacy in everything we build"
    },
    {
      icon: Users,
      title: "Customer Obsessed",
      description: "Our customers' success is our primary focus"
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description: "We continuously push boundaries and embrace new technologies"
    },
    {
      icon: Heart,
      title: "Inclusive & Diverse",
      description: "We celebrate diversity and foster an inclusive workplace"
    }
  ];

  const filteredJobs = jobOpenings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = selectedDepartment === "all" || job.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Join Our Team
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Build the Future of
              <span className="block text-green-300">Security Management</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Join a passionate team building innovative solutions that transform 
              how security companies operate worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#openings">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                  View Open Positions
                  <Briefcase className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="#culture">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
                  Learn About Culture
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Join Securitify?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We offer more than just a job - we offer a career with purpose and growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Our Culture */}
      <section id="culture" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Culture</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The values that define who we are and how we work
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cultureValues.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section id="openings" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're always looking for talented people to join our team
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-12">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search positions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <Button
                  key={department.id}
                  variant={selectedDepartment === department.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(department.id)}
                  className="flex items-center space-x-2"
                >
                  <span>{department.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {department.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className={`hover:shadow-lg transition-shadow ${job.featured ? 'border-green-500' : ''}`}>
                {job.featured && (
                  <div className="bg-green-500 text-white px-4 py-2 text-sm font-medium">
                    🔥 Featured Position
                  </div>
                )}
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-2xl mb-2">{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="w-4 h-4" />
                          <span>{job.experience}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{job.salary}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Badge variant="outline" className="capitalize">
                        {job.department}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{job.description}</p>
                  
                  <Tabs defaultValue="requirements" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="requirements">Requirements</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits</TabsTrigger>
                      <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="requirements" className="mt-4">
                      <ul className="space-y-2">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="benefits" className="mt-4">
                      <ul className="space-y-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>
                    
                    <TabsContent value="details" className="mt-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Posted:</span>
                          <span className="ml-2 text-muted-foreground">
                            {new Date(job.posted).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Deadline:</span>
                          <span className="ml-2 text-muted-foreground">
                            {new Date(job.deadline).toLocaleDateString()}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Department:</span>
                          <span className="ml-2 text-muted-foreground capitalize">
                            {job.department}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium">Type:</span>
                          <span className="ml-2 text-muted-foreground">
                            {job.type}
                          </span>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Posted {new Date(job.posted).toLocaleDateString()} • 
                      Apply by {new Date(job.deadline).toLocaleDateString()}
                    </div>
                    <Button>
                      Apply Now
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No positions found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Hiring Process */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Hiring Process</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A transparent and efficient process designed to find the best talent
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <CardTitle>Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Submit your application and resume through our career portal
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <CardTitle>Screening</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Initial review by our HR team and hiring managers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <CardTitle>Interviews</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Technical and cultural fit interviews with the team
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-orange-600">4</span>
                </div>
                <CardTitle>Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Receive and accept your offer to join our team
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Join Our Team?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            We're always looking for passionate individuals who want to make a difference 
            in the security industry.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#openings">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                Browse Open Positions
              </Button>
            </Link>
            <Link href="/company/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
                Contact HR Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}