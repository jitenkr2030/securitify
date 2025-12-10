"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Building2, 
  Users,
  MessageSquare,
  Calendar,
  CheckCircle,
  Send,
  Globe,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowRight,
  Star,
  Headphones,
  BookOpen,
  HelpCircle,
  Zap,
  Shield
} from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    subject: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const offices = [
    {
      city: "Bangalore",
      country: "India",
      address: "123, Tech Park, Electronic City, Bangalore - 560100",
      phone: "+91 80 1234 5678",
      email: "bangalore@securityguard.pro",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      map: "/api/placeholder/400/300"
    },
    {
      city: "Mumbai",
      country: "India",
      address: "456, Business Hub, Andheri East, Mumbai - 400069",
      phone: "+91 22 8765 4321",
      email: "mumbai@securityguard.pro",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      map: "/api/placeholder/400/300"
    },
    {
      city: "Delhi",
      country: "India",
      address: "789, Corporate Tower, Connaught Place, Delhi - 110001",
      phone: "+91 11 2345 6789",
      email: "delhi@securityguard.pro",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM",
      map: "/api/placeholder/400/300"
    }
  ];

  const teamContacts = [
    {
      name: "Sales Team",
      email: "sales@securityguard.pro",
      phone: "+91 80 1234 5678",
      description: "New business inquiries, product demos, and pricing information",
      icon: Users,
      responseTime: "Within 2 hours"
    },
    {
      name: "Support Team",
      email: "support@securityguard.pro",
      phone: "+91 80 1234 5679",
      description: "Technical support, bug reports, and help with existing accounts",
      icon: Headphones,
      responseTime: "Within 4 hours"
    },
    {
      name: "Partnerships",
      email: "partnerships@securityguard.pro",
      phone: "+91 80 1234 5680",
      description: "Business development, integration partnerships, and collaborations",
      icon: Shield,
      responseTime: "Within 24 hours"
    },
    {
      name: "Press & Media",
      email: "press@securityguard.pro",
      phone: "+91 80 1234 5681",
      description: "Media inquiries, press releases, and interview requests",
      icon: MessageSquare,
      responseTime: "Within 24 hours"
    }
  ];

  const faqs = [
    {
      question: "How quickly do you respond to support inquiries?",
      answer: "We typically respond to support inquiries within 4 hours during business hours. For urgent issues, our premium support customers receive priority response within 1 hour."
    },
    {
      question: "Do you offer on-site demonstrations?",
      answer: "Yes, we offer both virtual and on-site demonstrations for enterprise customers. Contact our sales team to schedule a personalized demo of our platform."
    },
    {
      question: "What are your business hours?",
      answer: "Our offices are open Monday through Friday, 9:00 AM to 6:00 PM local time. However, our support team is available 24/7 for enterprise customers."
    },
    {
      question: "How can I become a partner?",
      answer: "We welcome partnerships with technology providers, system integrators, and security companies. Please contact our partnerships team with details about your organization and collaboration ideas."
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    
    // Reset form after successful submission
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        subject: "",
        message: ""
      });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Get in Touch
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              We're Here to
              <span className="block text-blue-300">Help You</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Whether you have questions about our platform, need support, 
              or want to explore partnership opportunities, we'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold mb-6">Send us a Message</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Fill out the form below and we'll get back to you as soon as possible. 
                For urgent matters, please call our support team directly.
              </p>

              {isSubmitted ? (
                <Card className="border-green-500 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">Message Sent Successfully!</h3>
                        <p className="text-green-700">We'll get back to you within 24 hours.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        placeholder="Your company name"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <Input
                      id="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => handleInputChange("subject", e.target.value)}
                      placeholder="How can we help you?"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={(e) => handleInputChange("message", e.target.value)}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="ml-2 w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>

            <div>
              <h2 className="text-4xl font-bold mb-6">Contact Information</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Reach out to the right team based on your needs. We're here to help!
              </p>

              <div className="space-y-6">
                {teamContacts.map((contact, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <contact.icon className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{contact.name}</CardTitle>
                          <CardDescription className="text-base">
                            {contact.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{contact.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-sm">{contact.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-green-600">{contact.responseTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Visit Our Offices</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We have offices in major cities across India. Come visit us or schedule a meeting!
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{office.city}</CardTitle>
                  <CardDescription className="text-base">{office.country}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-48 bg-gray-300 rounded-lg flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-gray-400" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{office.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{office.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{office.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      <span className="text-sm">{office.hours}</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Get Directions
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick answers to common questions about our services and support
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start space-x-3">
                    <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Connect With Us</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Follow us on social media for the latest updates, industry insights, and company news
            </p>
          </div>

          <div className="flex justify-center space-x-8">
            <a href="#" className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-4 transition-colors">
              <Linkedin className="w-8 h-8" />
              <span className="text-lg">LinkedIn</span>
            </a>
            <a href="#" className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-4 transition-colors">
              <Twitter className="w-8 h-8" />
              <span className="text-lg">Twitter</span>
            </a>
            <a href="#" className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-4 transition-colors">
              <Facebook className="w-8 h-8" />
              <span className="text-lg">Facebook</span>
            </a>
            <a href="#" className="flex items-center space-x-3 hover:bg-white/10 rounded-lg p-4 transition-colors">
              <Instagram className="w-8 h-8" />
              <span className="text-lg">Instagram</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Transform Your Security Operations?
          </h2>
          <p className="text-xl mb-8 text-muted-foreground max-w-2xl mx-auto">
            Take the first step towards modernizing your security management. 
            Our team is ready to help you get started.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 text-lg">
              Schedule a Demo
              <Calendar className="ml-2 w-5 h-5" />
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-3 text-lg">
              Call Sales Team
              <Phone className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}