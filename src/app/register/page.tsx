"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Mail, Lock, User, Globe } from "lucide-react";

interface TenantRegistrationData {
  tenantName: string;
  domain: string;
  subdomain: string;
  plan: "free" | "basic" | "professional" | "enterprise";
  adminEmail: string;
  adminName: string;
  adminPassword: string;
  confirmPassword: string;
}

export default function TenantRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<TenantRegistrationData>({
    tenantName: "",
    domain: "",
    subdomain: "",
    plan: "free",
    adminEmail: "",
    adminName: "",
    adminPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: keyof TenantRegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (formData.adminPassword !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.tenantName || !formData.adminEmail || !formData.adminName || !formData.adminPassword) {
      setError("All required fields must be filled");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.tenantName,
          domain: formData.domain || undefined,
          subdomain: formData.subdomain || undefined,
          plan: formData.plan,
          adminUser: {
            email: formData.adminEmail,
            name: formData.adminName,
            password: formData.adminPassword
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/auth/signin?message=Registration successful. Please sign in.');
        }, 2000);
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Registration Successful!</h2>
            <p className="text-gray-600">Your tenant has been created successfully. Redirecting to sign in...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Create Your Security Guard Management Account</CardTitle>
          <CardDescription>
            Set up your organization and start managing your security team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Tenant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Organization Information</h3>
              
              <div className="space-y-2">
                <Label htmlFor="tenantName">Organization Name *</Label>
                <Input
                  id="tenantName"
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => handleInputChange('tenantName', e.target.value)}
                  placeholder="Enter your organization name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">Custom Domain (Optional)</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="domain"
                      type="text"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      placeholder="yourcompany.com"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subdomain">Subdomain (Optional)</Label>
                  <Input
                    id="subdomain"
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleInputChange('subdomain', e.target.value)}
                    placeholder="yourcompany"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plan">Subscription Plan</Label>
                <Select value={formData.plan} onValueChange={(value) => handleInputChange('plan', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">
                      <div>
                        <div className="font-medium">Free - $0/month</div>
                        <div className="text-sm text-gray-500">Up to 3 guards, Basic tracking</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="basic">
                      <div>
                        <div className="font-medium">Basic - $49/month</div>
                        <div className="text-sm text-gray-500">Up to 10 guards, Basic tracking</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="professional">
                      <div>
                        <div className="font-medium">Professional - $99/month</div>
                        <div className="text-sm text-gray-500">Up to 50 guards, Advanced features</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="enterprise">
                      <div>
                        <div className="font-medium">Enterprise - $299/month</div>
                        <div className="text-sm text-gray-500">Unlimited guards, White-label</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Admin User Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Administrator Account</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminName">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="adminName"
                      type="text"
                      value={formData.adminName}
                      onChange={(e) => handleInputChange('adminName', e.target.value)}
                      placeholder="John Doe"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adminEmail">Email Address *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="adminEmail"
                      type="email"
                      value={formData.adminEmail}
                      onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="adminPassword"
                      type="password"
                      value={formData.adminPassword}
                      onChange={(e) => handleInputChange('adminPassword', e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a href="/auth/signin" className="text-blue-600 hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}