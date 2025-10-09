"use client";

import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        console.log('❌ Sign in error:', result.error);
        setError("Invalid email or password");
      } else {
        console.log('✅ Sign in successful, getting session...');
        // Add a small delay to ensure session is properly established
        setTimeout(async () => {
          const session = await getSession();
          console.log('🔍 Session after sign in:', session);
          if (session?.user?.role === "admin") {
            console.log('🔄 Redirecting admin to dashboard');
            router.push("/dashboard");
          } else if (session?.user?.role === "guard") {
            console.log('🔄 Redirecting guard to mobile');
            router.push("/mobile");
          } else if (session?.user?.role === "field_officer") {
            console.log('🔄 Redirecting field officer to dashboard');
            router.push("/dashboard");
          } else {
            console.log('🔄 Redirecting to default dashboard');
            router.push("/dashboard");
          }
        }, 500);
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Demo credentials
  const demoCredentials = [
    { email: "admin@security.com", password: "password123", role: "Admin" },
    { email: "guard@security.com", password: "password123", role: "Guard" },
    { email: "officer@security.com", password: "password123", role: "Field Officer" }
  ];

  const loadDemoCredentials = async (credential: typeof demoCredentials[0]) => {
    setEmail(credential.email);
    setPassword(credential.password);
    
    // Try to create demo users if they don't exist
    try {
      const response = await fetch('/api/demo/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Demo users created:', data.message);
      }
    } catch (error) {
      console.log('Demo users might already exist:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Security Guard System</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Sign In Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Demo Credentials</CardTitle>
            <CardDescription className="text-sm">
              Click on any credential to auto-fill the form
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {demoCredentials.map((credential, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left"
                  onClick={() => loadDemoCredentials(credential)}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{credential.email}</span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {credential.role}
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Password: password123 (for all accounts)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}