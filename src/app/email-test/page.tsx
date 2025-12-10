"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function EmailTestPage() {
  const [selectedType, setSelectedType] = useState<string>("");
  const [testData, setTestData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const emailTypes = [
    { value: "welcome", label: "Welcome Email", description: "Send welcome email to new tenant" },
    { value: "subscription", label: "Subscription Confirmation", description: "Send subscription confirmation" },
    { value: "payment_failed", label: "Payment Failed", description: "Send payment failed notification" },
    { value: "assignment", label: "Guard Assignment", description: "Send guard assignment notification" },
    { value: "reminder", label: "Shift Reminder", description: "Send shift reminder" },
    { value: "alert", label: "Security Alert", description: "Send security alert notification" },
    { value: "leave", label: "Leave Approval", description: "Send leave approval notification" },
    { value: "report", label: "Monthly Report", description: "Send monthly security report" }
  ];

  const sampleData = {
    welcome: {
      tenantName: "Demo Security Company",
      userEmail: "admin@demo.com",
      adminName: "John Doe"
    },
    subscription: {
      tenantName: "Demo Security Company",
      userEmail: "admin@demo.com",
      planName: "Professional",
      amount: 99,
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    payment_failed: {
      tenantName: "Demo Security Company",
      userEmail: "admin@demo.com",
      amount: 99,
      retryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    assignment: {
      guardName: "Jane Smith",
      guardEmail: "jane@demo.com",
      postName: "Main Entrance",
      shiftStart: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      shiftEnd: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString().slice(0, 16)
    },
    reminder: {
      guardName: "Jane Smith",
      guardEmail: "jane@demo.com",
      postName: "Main Entrance",
      shiftTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 16)
    },
    alert: {
      recipientEmail: "admin@demo.com",
      recipientName: "John Doe",
      alertType: "Geofence Breach",
      alertMessage: "Guard has left the designated area",
      guardName: "Jane Smith",
      severity: "high"
    },
    leave: {
      guardName: "Jane Smith",
      guardEmail: "jane@demo.com",
      leaveType: "Vacation",
      startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      approved: true
    },
    report: {
      tenantName: "Demo Security Company",
      userEmail: "admin@demo.com",
      month: "January",
      year: 2024,
      reportData: {
        totalGuards: 25,
        activePosts: 12,
        totalShifts: 450,
        attendanceRate: 95,
        alertsCount: 8
      }
    }
  };

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    setTestData(sampleData[type as keyof typeof sampleData] || {});
    setResult(null);
    setError("");
  };

  const handleInputChange = (field: string, value: any) => {
    setTestData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const sendTestEmail = async () => {
    if (!selectedType) {
      setError("Please select an email type");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/email/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: selectedType,
          testData
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || "Failed to send email");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  const renderFormFields = () => {
    if (!selectedType) return null;

    const fields = Object.keys(testData);
    
    return (
      <div className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <Label htmlFor={field} className="text-sm font-medium">
              {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
            </Label>
            {field === "severity" ? (
              <Select value={testData[field]} onValueChange={(value) => handleInputChange(field, value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            ) : field === "approved" ? (
              <Select value={testData[field].toString()} onValueChange={(value) => handleInputChange(field, value === "true")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Approved</SelectItem>
                  <SelectItem value="false">Rejected</SelectItem>
                </SelectContent>
              </Select>
            ) : field === "alertMessage" || field === "rejectionReason" ? (
              <Textarea
                id={field}
                value={testData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
              />
            ) : field === "reportData" ? (
              <Textarea
                id={field}
                value={JSON.stringify(testData[field], null, 2)}
                onChange={(e) => {
                  try {
                    handleInputChange(field, JSON.parse(e.target.value));
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder="Enter report data as JSON"
                className="font-mono text-sm"
              />
            ) : field.includes("Date") && !field.includes("Time") ? (
              <Input
                id={field}
                type="date"
                value={testData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            ) : field.includes("Time") ? (
              <Input
                id={field}
                type="datetime-local"
                value={testData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
              />
            ) : typeof testData[field] === "number" ? (
              <Input
                id={field}
                type="number"
                value={testData[field] || ""}
                onChange={(e) => handleInputChange(field, Number(e.target.value))}
              />
            ) : (
              <Input
                id={field}
                type="text"
                value={testData[field] || ""}
                onChange={(e) => handleInputChange(field, e.target.value)}
                placeholder={`Enter ${field}`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold">Email Service Test</h1>
          </div>
          <p className="text-gray-600">
            Test different email templates and verify your email configuration
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Email Type Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Email Type</CardTitle>
              <CardDescription>
                Choose the type of email you want to test
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {emailTypes.map((type) => (
                  <div
                    key={type.value}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedType === type.value
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => handleTypeChange(type.value)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                      {selectedType === type.value && (
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Test Data Form */}
          <Card>
            <CardHeader>
              <CardTitle>Test Data</CardTitle>
              <CardDescription>
                Configure the data for the email template
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedType ? (
                <div className="space-y-4">
                  {renderFormFields()}
                  <Button
                    onClick={sendTestEmail}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Test Email"
                    )}
                  </Button>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  Select an email type to configure test data
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Email Sent Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">
                    {result.type}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    Sent to test environment
                  </span>
                </div>
                <Alert>
                  <AlertDescription>
                    <strong>Note:</strong> Emails will only be sent if SMTP configuration is properly set up in your environment variables.
                    Check the server logs for detailed email sending status.
                  </AlertDescription>
                </Alert>
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-medium">
                    View Response Data
                  </summary>
                  <pre className="mt-2 p-4 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </details>
              </div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Configuration Info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
            <CardDescription>
              Required environment variables for email functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div><code>SMTP_HOST</code> - Your SMTP server hostname</div>
              <div><code>SMTP_PORT</code> - SMTP server port (e.g., 587)</div>
              <div><code>SMTP_SECURE</code> - Use SSL/TLS (true/false)</div>
              <div><code>SMTP_USER</code> - SMTP username</div>
              <div><code>SMTP_PASS</code> - SMTP password</div>
              <div><code>EMAIL_FROM</code> - Default sender email address</div>
            </div>
            <Alert className="mt-4">
              <AlertDescription>
                <strong>Development Mode:</strong> If SMTP is not configured, emails will be logged but not sent.
                Check your server logs for email content and sending status.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}