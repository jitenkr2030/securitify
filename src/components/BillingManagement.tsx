"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  ExternalLink, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  RefreshCw,
  Download,
  Settings,
  TrendingUp,
  DollarSign,
  Calendar
} from "lucide-react";
import { useSession } from "next-auth/react";

interface Subscription {
  id: string;
  status: string;
  plan: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  amount: number;
  currency: string;
}

interface Invoice {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  pdfUrl?: string;
}

interface Usage {
  guards: {
    current: number;
    limit: number;
    percentage: number;
  };
  posts: {
    current: number;
    limit: number;
    percentage: number;
  };
  apiCalls: {
    current: number;
    limit: number;
    percentage: number;
  };
}

export default function BillingManagement() {
  const { data: session } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (session) {
      fetchBillingData();
    }
  }, [session]);

  const fetchBillingData = async () => {
    try {
      // Fetch subscription data
      const subscriptionResponse = await fetch('/api/billing/subscription');
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setSubscription(subscriptionData);
      }

      // Fetch invoices
      const invoicesResponse = await fetch('/api/billing/invoices');
      if (invoicesResponse.ok) {
        const invoicesData = await invoicesResponse.json();
        setInvoices(invoicesData);
      }

      // Fetch usage data
      const usageResponse = await fetch('/api/billing/usage');
      if (usageResponse.ok) {
        const usageData = await usageResponse.json();
        setUsage(usageData);
      }
    } catch (error) {
      console.error("Error fetching billing data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/payment/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        window.open(url, '_blank');
      } else {
        console.error("Failed to create portal session");
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
    } finally {
      setPortalLoading(false);
    }
  };

  const handleUpgradePlan = async (planId: string) => {
    try {
      const response = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          successUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard?billing_success=true`,
          cancelUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/dashboard?billing_cancelled=true`,
        }),
      });

      if (response.ok) {
        const { url } = await response.json();
        if (typeof window !== 'undefined') {
          window.location.href = url;
        }
      } else {
        console.error("Failed to create checkout session");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "past_due": return "bg-yellow-500";
      case "cancelled": return "bg-red-500";
      case "incomplete": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getUsageColor = (percentage: number) => {
    if (percentage > 90) return "text-red-500";
    if (percentage > 75) return "text-yellow-500";
    return "text-green-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                Current Subscription
              </CardTitle>
              <CardDescription>
                Manage your subscription and billing information
              </CardDescription>
            </div>
            <Button 
              onClick={handleManageBilling}
              disabled={portalLoading}
              variant="outline"
            >
              {portalLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              Manage Billing
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{subscription.plan}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className={`${getStatusColor(subscription.status)} text-white`}>
                      {subscription.status}
                    </Badge>
                    {subscription.cancelAtPeriodEnd && (
                      <Badge variant="outline">
                        Cancels at period end
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ${subscription.amount} {subscription.currency.toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">per month</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Current Period</p>
                  <p className="font-medium">
                    {new Date(subscription.currentPeriodStart).toLocaleDateString()} - {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Next Billing Date</p>
                  <p className="font-medium">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {subscription.cancelAtPeriodEnd && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Your subscription will be cancelled at the end of the current billing period. 
                    You can reactivate anytime before then.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Active Subscription</h3>
              <p className="text-muted-foreground mb-4">
                You need an active subscription to use all features
              </p>
              <Button onClick={() => handleUpgradePlan('basic')}>
                Subscribe Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Overview */}
      {usage && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              Usage Overview
            </CardTitle>
            <CardDescription>
              Monitor your resource usage for the current billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Guards</span>
                  <span className={`text-sm font-medium ${getUsageColor(usage.guards.percentage)}`}>
                    {usage.guards.current} / {usage.guards.limit === -1 ? '∞' : usage.guards.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(usage.guards.percentage).replace('text', 'bg')}`}
                    style={{ width: `${Math.min(usage.guards.percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {usage.guards.percentage.toFixed(1)}% used
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Posts</span>
                  <span className={`text-sm font-medium ${getUsageColor(usage.posts.percentage)}`}>
                    {usage.posts.current} / {usage.posts.limit === -1 ? '∞' : usage.posts.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(usage.posts.percentage).replace('text', 'bg')}`}
                    style={{ width: `${Math.min(usage.posts.percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {usage.posts.percentage.toFixed(1)}% used
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">API Calls</span>
                  <span className={`text-sm font-medium ${getUsageColor(usage.apiCalls.percentage)}`}>
                    {usage.apiCalls.current} / {usage.apiCalls.limit === -1 ? '∞' : usage.apiCalls.limit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getUsageColor(usage.apiCalls.percentage).replace('text', 'bg')}`}
                    style={{ width: `${Math.min(usage.apiCalls.percentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {usage.apiCalls.percentage.toFixed(1)}% used
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Billing Tabs */}
      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="plans">Upgrade Plan</TabsTrigger>
          <TabsTrigger value="payment-method">Payment Method</TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                Billing History
              </CardTitle>
              <CardDescription>
                View and download your past invoices
              </CardDescription>
            </CardHeader>
            <CardContent>
              {invoices.length > 0 ? (
                <div className="space-y-4">
                  {invoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">
                            ${invoice.amount} {invoice.currency.toUpperCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(invoice.created).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant={invoice.status === 'paid' ? 'default' : 'secondary'}>
                          {invoice.status}
                        </Badge>
                      </div>
                      {invoice.pdfUrl && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No invoices found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upgrade Your Plan</CardTitle>
              <CardDescription>
                Choose the plan that best fits your security company needs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className={`relative ${subscription?.plan === 'basic' ? 'border-blue-500' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle>Basic</CardTitle>
                    <div className="text-3xl font-bold">$49<span className="text-sm font-normal">/month</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Up to 10 guards</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Basic GPS tracking</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Email support</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Mobile app access</li>
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant={subscription?.plan === 'basic' ? 'outline' : 'default'}
                      onClick={() => handleUpgradePlan('basic')}
                      disabled={subscription?.plan === 'basic'}
                    >
                      {subscription?.plan === 'basic' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`relative ${subscription?.plan === 'professional' ? 'border-blue-500' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle>Professional</CardTitle>
                    <div className="text-3xl font-bold">$99<span className="text-sm font-normal">/month</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Up to 50 guards</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Advanced tracking</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Priority support</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />API access</li>
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant={subscription?.plan === 'professional' ? 'outline' : 'default'}
                      onClick={() => handleUpgradePlan('professional')}
                      disabled={subscription?.plan === 'professional'}
                    >
                      {subscription?.plan === 'professional' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>

                <Card className={`relative ${subscription?.plan === 'enterprise' ? 'border-blue-500' : ''}`}>
                  <CardHeader className="text-center">
                    <CardTitle>Enterprise</CardTitle>
                    <div className="text-3xl font-bold">$299<span className="text-sm font-normal">/month</span></div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Unlimited guards</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />White-label platform</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Dedicated support</li>
                      <li className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" />Custom integrations</li>
                    </ul>
                    <Button 
                      className="w-full mt-4" 
                      variant={subscription?.plan === 'enterprise' ? 'outline' : 'default'}
                      onClick={() => handleUpgradePlan('enterprise')}
                      disabled={subscription?.plan === 'enterprise'}
                    >
                      {subscription?.plan === 'enterprise' ? 'Current Plan' : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment-method" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Method</CardTitle>
              <CardDescription>
                Manage your payment methods and billing information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Manage your payment method through the customer portal
                </p>
                <Button onClick={handleManageBilling} disabled={portalLoading}>
                  {portalLoading ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  Manage Payment Method
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}