"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Building2, HelpCircle, Smartphone, Code } from "lucide-react";
import Image from "next/image";
import HeaderSelectors from "./HeaderSelectors";

export default function HeaderNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Cache-busting timestamp - remove after deployment confirmed
  console.log('PRODUCTION HEADER LOADED:', new Date().toISOString());
  
  // Production deployment confirmation - BLACK TEXT VERSION
  const isProduction = process.env.NODE_ENV === 'production';
  if (isProduction) {
    console.log('Running in production mode - BLACK TEXT HEADER');
  }

  const navigationItems = [
    { label: "Product", href: "/product", icon: Shield },
    { label: "Pricing", href: "/pricing", icon: Smartphone },
    { label: "Mobile App", href: "/mobile", icon: Smartphone },
    { label: "API", href: "/api-docs", icon: Code },
  ];

  const companyItems = [
    { label: "About", href: "/company/about", icon: Building2 },
    { label: "Blog", href: "/company/blog", icon: Building2 },
    { label: "Careers", href: "/company/careers", icon: Building2 },
    { label: "Contact", href: "/company/contact", icon: Building2 },
  ];

  const supportItems = [
    { label: "Help Center", href: "/support/help", icon: HelpCircle },
    { label: "Documentation", href: "/support/docs", icon: HelpCircle },
    { label: "Community", href: "/support/community", icon: HelpCircle },
    { label: "Status", href: "/support/status", icon: HelpCircle },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-blue-600 text-black backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="relative w-8 h-8">
                <Image
                  src="/logo.png"
                  alt="Securitify"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl text-black">Securitify</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link key={item.label} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="h-9"
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Company Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="h-9">
                <Building2 className="w-4 h-4 mr-2" />
                Company
              </Button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {companyItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-black">
                      <item.icon className="w-4 h-4 mr-2 text-black" />
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Support Dropdown */}
            <div className="relative group">
              <Button variant="ghost" className="h-9">
                <HelpCircle className="w-4 h-4 mr-2" />
                Support
              </Button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                {supportItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center text-black">
                      <item.icon className="w-4 h-4 mr-2 text-black" />
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Currency and Country Selectors */}
            <div className="hidden md:flex items-center space-x-2">
              <HeaderSelectors />
            </div>
            
            <div className="hidden lg:flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t bg-background text-black">
            <div className="container mx-auto px-4 py-4 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start h-10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="text-sm font-medium text-muted-foreground px-3 py-2">
                  Company
                </div>
                {companyItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start h-10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="text-sm font-medium text-muted-foreground px-3 py-2">
                  Support
                </div>
                {supportItems.map((item) => (
                  <Link key={item.label} href={item.href}>
                    <Button
                      variant={isActive(item.href) ? "default" : "ghost"}
                      className="w-full justify-start h-10"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>

              <div className="flex flex-col space-y-2 pt-4 border-t">
                {/* Mobile Currency and Country Selectors */}
                <div className="space-y-3 pb-4 border-b">
                  <div className="text-sm font-medium text-muted-foreground px-3 py-2">
                    Preferences
                  </div>
                  <div className="px-3 space-y-3">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Currency</label>
                      <HeaderSelectors />
                    </div>
                  </div>
                </div>
                
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    className="w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}