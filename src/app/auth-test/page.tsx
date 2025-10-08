"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AuthTestPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Authentication Test Page</h1>
          <p className="text-muted-foreground">
            This page tests the authentication system without redirects
          </p>
        </div>

        {/* Authentication Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {session ? (
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
              )}
              Authentication Status
            </CardTitle>
            <CardDescription>
              Current authentication state
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={session ? "default" : "destructive"}>
                  {session ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>
              
              {session && (
                <>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">User ID:</span>
                    <span className="text-sm text-muted-foreground">{session.user.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Email:</span>
                    <span className="text-sm text-muted-foreground">{session.user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Name:</span>
                    <span className="text-sm text-muted-foreground">{session.user.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Role:</span>
                    <Badge variant="outline">{session.user.role}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Tenant:</span>
                    <span className="text-sm text-muted-foreground">{session.user.tenantName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Plan:</span>
                    <Badge variant="secondary">{session.user.tenantPlan}</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Test Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
            <CardDescription>
              Test different authentication flows
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {!session ? (
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    You are not authenticated. Please sign in to test the authentication flow.
                  </p>
                  <Button onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/auth/signin';
                    }
                  }}>
                    Go to Sign In
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      You are successfully authenticated! The authentication system is working correctly.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = '/dashboard';
                        }
                      }}
                    >
                      Test Dashboard Access
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          window.location.href = '/';
                        }
                      }}
                    >
                      Test Main Page Redirect
                    </Button>
                  </div>
                  
                  <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      If you can access the dashboard and the main page redirects work correctly, 
                      then the redirect loop issue has been resolved.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Debug Information */}
        <Card>
          <CardHeader>
            <CardTitle>Debug Information</CardTitle>
            <CardDescription>
              Technical details for troubleshooting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Session Status:</span>
                <code>{status}</code>
              </div>
              <div className="flex justify-between">
                <span>Session Exists:</span>
                <code>{!!session}</code>
              </div>
              <div className="flex justify-between">
                <span>User Agent:</span>
                <code className="text-xs break-all">{typeof navigator !== 'undefined' ? navigator.userAgent : 'Server-side'}</code>
              </div>
              <div className="flex justify-between">
                <span>Current URL:</span>
                <code className="text-xs break-all">{typeof window !== 'undefined' ? window.location.href : 'Server-side'}</code>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}