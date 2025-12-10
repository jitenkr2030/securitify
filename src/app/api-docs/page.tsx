"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Code, 
  Database, 
  Zap, 
  Shield, 
  BookOpen, 
  Users,
  CheckCircle,
  Copy,
  ExternalLink,
  Download,
  Github,
  FileText,
  Key,
  Globe,
  BarChart3,
  AlertTriangle,
  Settings,
  Smartphone,
  MapPin,
  Calendar,
  FileImage,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

export default function APIPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedEndpoint, setCopiedEndpoint] = useState<string | null>(null);

  const apiEndpoints = [
    {
      category: "Authentication",
      endpoints: [
        {
          method: "POST",
          path: "/api/auth/signin",
          description: "User authentication",
          parameters: [
            { name: "email", type: "string", required: true, description: "User email address" },
            { name: "password", type: "string", required: true, description: "User password" }
          ],
          response: {
            status: 200,
            body: {
              user: { id: "string", email: "string", name: "string", role: "string" },
              token: "string"
            }
          }
        },
        {
          method: "POST",
          path: "/api/auth/signout",
          description: "User sign out",
          parameters: [],
          response: {
            status: 200,
            body: { message: "Successfully signed out" }
          }
        }
      ]
    },
    {
      category: "Guards Management",
      endpoints: [
        {
          method: "GET",
          path: "/api/guards",
          description: "Get all guards",
          parameters: [
            { name: "page", type: "number", required: false, description: "Page number" },
            { name: "limit", type: "number", required: false, description: "Items per page" },
            { name: "status", type: "string", required: false, description: "Filter by status" }
          ],
          response: {
            status: 200,
            body: {
              guards: [
                {
                  id: "string",
                  name: "string",
                  phone: "string",
                  email: "string",
                  status: "string",
                  salary: "number"
                }
              ],
              pagination: { total: "number", page: "number", limit: "number" }
            }
          }
        },
        {
          method: "POST",
          path: "/api/guards",
          description: "Create new guard",
          parameters: [
            { name: "name", type: "string", required: true, description: "Guard name" },
            { name: "phone", type: "string", required: true, description: "Phone number" },
            { name: "email", type: "string", required: false, description: "Email address" },
            { name: "salary", type: "number", required: true, description: "Monthly salary" },
            { name: "status", type: "string", required: false, description: "Guard status" }
          ],
          response: {
            status: 201,
            body: {
              id: "string",
              name: "string",
              phone: "string",
              email: "string",
              status: "string",
              salary: "number"
            }
          }
        }
      ]
    },
    {
      category: "Locations & Tracking",
      endpoints: [
        {
          method: "POST",
          path: "/api/locations",
          description: "Submit guard location",
          parameters: [
            { name: "guardId", type: "string", required: true, description: "Guard ID" },
            { name: "latitude", type: "number", required: true, description: "GPS latitude" },
            { name: "longitude", type: "number", required: true, description: "GPS longitude" },
            { name: "speed", type: "number", required: false, description: "Current speed" },
            { name: "direction", type: "number", required: false, description: "Direction in degrees" }
          ],
          response: {
            status: 201,
            body: {
              id: "string",
              guardId: "string",
              latitude: "number",
              longitude: "number",
              timestamp: "string"
            }
          }
        },
        {
          method: "GET",
          path: "/api/locations/{guardId}",
          description: "Get guard location history",
          parameters: [
            { name: "guardId", type: "string", required: true, description: "Guard ID" },
            { name: "startDate", type: "string", required: false, description: "Start date filter" },
            { name: "endDate", type: "string", required: false, description: "End date filter" }
          ],
          response: {
            status: 200,
            body: {
              locations: [
                {
                  id: "string",
                  latitude: "number",
                  longitude: "number",
                  timestamp: "string",
                  speed: "number"
                }
              ]
            }
          }
        }
      ]
    },
    {
      category: "Attendance",
      endpoints: [
        {
          method: "POST",
          path: "/api/attendance/checkin",
          description: "Guard check-in",
          parameters: [
            { name: "guardId", type: "string", required: true, description: "Guard ID" },
            { name: "shiftId", type: "string", required: true, description: "Shift ID" },
            { name: "latitude", type: "number", required: true, description: "Check-in latitude" },
            { name: "longitude", type: "number", required: true, description: "Check-in longitude" },
            { name: "qrCode", type: "string", required: false, description: "QR code data" }
          ],
          response: {
            status: 201,
            body: {
              id: "string",
              guardId: "string",
              checkInTime: "string",
              checkInLat: "number",
              checkInLng: "number"
            }
          }
        },
        {
          method: "POST",
          path: "/api/attendance/checkout",
          description: "Guard check-out",
          parameters: [
            { name: "attendanceId", type: "string", required: true, description: "Attendance ID" },
            { name: "latitude", type: "number", required: true, description: "Check-out latitude" },
            { name: "longitude", type: "number", required: true, description: "Check-out longitude" }
          ],
          response: {
            status: 200,
            body: {
              id: "string",
              checkOutTime: "string",
              checkOutLat: "number",
              checkOutLng: "number"
            }
          }
        }
      ]
    }
  ];

  const webhooks = [
    {
      event: "guard.location_updated",
      description: "Triggered when a guard's location is updated",
      payload: {
        guardId: "string",
        location: {
          latitude: "number",
          longitude: "number",
          timestamp: "string"
        }
      }
    },
    {
      event: "attendance.check_in",
      description: "Triggered when a guard checks in",
      payload: {
        guardId: "string",
        attendanceId: "string",
        checkInTime: "string",
        location: {
          latitude: "number",
          longitude: "number"
        }
      }
    },
    {
      event: "alert.created",
      description: "Triggered when a new alert is created",
      payload: {
        alertId: "string",
        type: "string",
        severity: "string",
        guardId: "string",
        message: "string",
        timestamp: "string"
      }
    }
  ];

  const sdks = [
    {
      language: "JavaScript",
      icon: Code,
      description: "Modern JavaScript SDK for browser and Node.js",
      install: "npm install securitify-sdk",
      features: [
        "Promise-based API",
        "TypeScript support",
        "Browser and Node.js compatible",
        "Automatic authentication"
      ],
      example: `import { SecuritifyAPI } from 'securitify-sdk';

const api = new SecuritifyAPI({
  apiKey: 'your-api-key',
  tenantId: 'your-tenant-id'
});

// Get all guards
const guards = await api.guards.list();

// Submit location
await api.locations.create({
  guardId: 'guard-123',
  latitude: 28.6139,
  longitude: 77.2090
});`
    },
    {
      language: "Python",
      icon: Code,
      description: "Python SDK for integrating with Python applications",
      install: "pip install securitify-sdk",
      features: [
        "Python 3.7+ support",
        "Async/await support",
        "Comprehensive error handling",
        "Built-in retry logic"
      ],
      example: `import securityguard_sdk

api = securityguard_sdk.Client(
    api_key='your-api-key',
    tenant_id='your-tenant-id'
)

# Get all guards
guards = api.guards.list()

# Submit location
api.locations.create(
    guard_id='guard-123',
    latitude=28.6139,
    longitude=77.2090
)`
    },
    {
      language: "cURL",
      icon: Code,
      description: "Direct API access using cURL commands",
      install: "No installation required",
      features: [
        "Direct API access",
        "No dependencies",
        "Universal compatibility",
        "Easy testing"
      ],
      example: `# Get all guards
curl -X GET "https://api.securityguard.pro/api/guards" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "X-Tenant-ID: your-tenant-id"

# Submit location
curl -X POST "https://api.securityguard.pro/api/locations" \\
  -H "Authorization: Bearer your-api-key" \\
  -H "X-Tenant-ID: your-tenant-id" \\
  -H "Content-Type: application/json" \\
  -d '{
    "guardId": "guard-123",
    "latitude": 28.6139,
    "longitude": 77.2090
  }'`
    }
  ];

  const copyToClipboard = (text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textArea);
      });
      setCopiedEndpoint(text);
      setTimeout(() => setCopiedEndpoint(null), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-6">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 bg-white/20 text-white border-white/30">
              Developer Resources
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              API Documentation
              <span className="block text-green-300">& Integrations</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              Comprehensive REST API with SDKs for JavaScript, Python, and more. 
              Build custom integrations and extend our platform capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                  Get API Key
                  <Key className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
                  View Full Docs
                  <BookOpen className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* API Overview */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              API Overview
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to know about integrating with our platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Database className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>RESTful API</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Modern REST API with JSON responses and standard HTTP methods
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Bank-level security with API keys, OAuth 2.0, and tenant isolation
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <CardTitle>Real-time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  WebSocket support for real-time updates and instant notifications
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>Multi-tenant</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built-in multi-tenant support with complete data isolation
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="sdks">SDKs</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Key className="w-5 h-5" />
                      <span>Authentication</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">API Key Authentication</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Include your API key in the Authorization header:
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        Authorization: Bearer your-api-key
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Tenant Context</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Include tenant ID for multi-tenant access:
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        X-Tenant-ID: your-tenant-id
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BarChart3 className="w-5 h-5" />
                      <span>Rate Limits</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Basic Plan</span>
                        <Badge>1,000 requests/hour</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Professional Plan</span>
                        <Badge>5,000 requests/hour</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Enterprise Plan</span>
                        <Badge>Unlimited</Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Rate limit headers are included in every response:
                    </div>
                    <div className="bg-gray-100 p-3 rounded font-mono text-xs">
                      X-RateLimit-Limit: 1000<br/>
                      X-RateLimit-Remaining: 999<br/>
                      X-RateLimit-Reset: 1640995200
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="endpoints" className="space-y-8">
              {apiEndpoints.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h3 className="text-2xl font-bold mb-6">{category.category}</h3>
                  <div className="space-y-6">
                    {category.endpoints.map((endpoint, endpointIndex) => (
                      <Card key={endpointIndex}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <Badge className={
                                endpoint.method === 'GET' ? 'bg-blue-500' :
                                endpoint.method === 'POST' ? 'bg-green-500' :
                                endpoint.method === 'PUT' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }>
                                {endpoint.method}
                              </Badge>
                              <div className="font-mono text-lg">{endpoint.path}</div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(endpoint.path)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <CardDescription>{endpoint.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          {endpoint.parameters.length > 0 && (
                            <div className="mb-4">
                              <h4 className="font-semibold mb-2">Parameters</h4>
                              <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                  <thead>
                                    <tr className="border-b">
                                      <th className="text-left py-2">Name</th>
                                      <th className="text-left py-2">Type</th>
                                      <th className="text-left py-2">Required</th>
                                      <th className="text-left py-2">Description</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {endpoint.parameters.map((param, paramIndex) => (
                                      <tr key={paramIndex} className="border-b">
                                        <td className="py-2 font-mono">{param.name}</td>
                                        <td className="py-2">{param.type}</td>
                                        <td className="py-2">
                                          <Badge variant={param.required ? "destructive" : "secondary"}>
                                            {param.required ? "Required" : "Optional"}
                                          </Badge>
                                        </td>
                                        <td className="py-2">{param.description}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                          
                          <div>
                            <h4 className="font-semibold mb-2">Response Example</h4>
                            <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                              <pre>{JSON.stringify(endpoint.response, null, 2)}</pre>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="sdks" className="space-y-8">
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {sdks.map((sdk, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <sdk.icon className="w-5 h-5" />
                        <span>{sdk.language}</span>
                      </CardTitle>
                      <CardDescription>{sdk.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Installation</h4>
                        <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                          {sdk.install}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Features</h4>
                        <ul className="space-y-1">
                          {sdk.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-2">Example</h4>
                        <div className="bg-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                          <pre>{sdk.example}</pre>
                        </div>
                      </div>
                      
                      <Button className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        View Documentation
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-8">
              <div className="grid md:grid-cols-1 gap-6">
                {webhooks.map((webhook, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="font-mono">{webhook.event}</CardTitle>
                      <CardDescription>{webhook.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div>
                        <h4 className="font-semibold mb-2">Payload Structure</h4>
                        <div className="bg-gray-100 p-4 rounded font-mono text-sm overflow-x-auto">
                          <pre>{JSON.stringify(webhook.payload, null, 2)}</pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Getting Started */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Getting Started
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Follow these steps to start integrating with our API
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <CardTitle>Get API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Sign up for an account and generate your API key from the dashboard.
                </p>
                <Link href="/register">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-green-600">2</span>
                </div>
                <CardTitle>Choose SDK</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Select from our available SDKs or use direct API access with cURL.
                </p>
                <Button variant="outline" className="w-full">View SDKs</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <CardTitle>Start Building</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Integrate with our API and start building your custom solution.
                </p>
                <Button variant="outline" className="w-full">View Examples</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Start Integrating?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of developers building on our platform. Get your API key and start building today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                Get API Key
              </Button>
            </Link>
            <Link href="/docs">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 text-lg">
                Read Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}