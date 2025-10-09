"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Users, 
  Award, 
  Globe, 
  Shield, 
  Zap,
  Target,
  Heart,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Lightbulb,
  Database
} from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  const timeline = [
    {
      year: "2020",
      title: "Founded",
      description: "Securitify was founded with a vision to revolutionize security management through technology."
    },
    {
      year: "2021",
      title: "First Launch",
      description: "Launched our MVP with basic guard tracking and attendance management features."
    },
    {
      year: "2022",
      title: "Mobile Apps",
      description: "Released native iOS and Android apps with offline capabilities and real-time tracking."
    },
    {
      year: "2023",
      title: "SaaS Platform",
      description: "Transformed into a complete multi-tenant SaaS platform with advanced features."
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded to serve security companies worldwide with enterprise-grade features."
    }
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security and privacy of our customers' data above all else."
    },
    {
      icon: Users,
      title: "Customer-Centric",
      description: "Our customers' success is our success. We build solutions that solve real problems."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "We continuously innovate and improve our platform to stay ahead of industry needs."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We operate with transparency, honesty, and ethical business practices."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Guards" },
    { number: "500+", label: "Security Companies" },
    { number: "25+", label: "Countries" },
    { number: "99.9%", label: "Uptime" }
  ];

  const team = [
    {
      name: "Rajesh Kumar",
      role: "CEO & Founder",
      bio: "Former security operations manager with 15+ years of industry experience.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Priya Sharma",
      role: "CTO",
      bio: "Technology leader with expertise in SaaS platforms and real-time systems.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Amit Patel",
      role: "Head of Product",
      bio: "Product visionary focused on user experience and market needs.",
      image: "/api/placeholder/150/150"
    },
    {
      name: "Sneha Reddy",
      role: "VP of Engineering",
      bio: "Engineering leader with a passion for scalable and secure systems.",
      image: "/api/placeholder/150/150"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              About Us
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Revolutionizing Security
              <span className="block text-blue-300">Management Worldwide</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              We're building the future of security management with innovative technology 
              and a customer-first approach.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower security companies worldwide with cutting-edge technology that 
                streamlines operations, enhances safety, and delivers exceptional value to 
                both security providers and their clients.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                We believe that security management should be efficient, transparent, and 
                accessible to organizations of all sizes. Our platform bridges the gap 
                between traditional security operations and modern digital transformation.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Target className="w-4 h-4 mr-2" />
                  Innovation
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Customer Focus
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The core principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
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

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From startup to industry leader in security management technology
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-blue-200"></div>
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="w-1/2 pr-8">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <Badge className="bg-blue-600 text-white">{item.year}</Badge>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-600 rounded-full border-4 border-white"></div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Meet the experienced professionals leading our mission
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <CardDescription className="text-base font-medium text-blue-600">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {member.bio}
                  </p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Building2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Technology Stack</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built with modern, scalable, and secure technologies
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <span>Frontend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Next.js 15 with App Router</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>TypeScript 5</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Tailwind CSS 4</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>shadcn/ui Components</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-blue-600" />
                  <span>Backend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Node.js with TypeScript</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Prisma ORM</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>SQLite/PostgreSQL</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>NextAuth.js Authentication</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-green-600" />
                  <span>Infrastructure</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>WebSocket Real-time</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>RESTful API</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Multi-tenant Architecture</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span>Cloud-Native Deployment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Join Us in Transforming Security Management
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Whether you're a security company looking to modernize your operations or 
            a talented professional wanting to make a difference, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                Get Started
              </Button>
            </Link>
            <Link href="/company/careers">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                Join Our Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}