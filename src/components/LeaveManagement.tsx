"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Clock, User, CheckCircle, XCircle, AlertCircle, Plus, Filter } from "lucide-react";
import { format } from "date-fns";

interface LeaveRequest {
  id: string;
  guardId: string;
  guardName: string;
  guardPhoto?: string;
  leaveType: "casual" | "sick" | "emergency" | "vacation";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  days: number;
}

interface LeaveBalance {
  guardId: string;
  guardName: string;
  casualLeave: number;
  sickLeave: number;
  vacationLeave: number;
  totalLeave: number;
  usedLeave: number;
  remainingLeave: number;
}

export default function LeaveManagement() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    guardId: "",
    leaveType: "casual" as const,
    reason: "",
  });
  const [selectedDateForCalendar, setSelectedDateForCalendar] = useState<Date | null>(null);

  useEffect(() => {
    fetchLeaveData();
  }, []);

  const fetchLeaveData = async () => {
    try {
      // Fetch leave requests
      const leaveResponse = await fetch('/api/leave');
      if (leaveResponse.ok) {
        const leaveData = await leaveResponse.json();
        setLeaveRequests(leaveData);
      }

      // Fetch leave balances
      const balanceResponse = await fetch('/api/leave/balances');
      if (balanceResponse.ok) {
        const balanceData = await balanceResponse.json();
        setLeaveBalances(balanceData);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeaveRequests = leaveRequests.filter(request => {
    const matchesStatus = statusFilter === "all" || request.status === statusFilter;
    const matchesType = typeFilter === "all" || request.leaveType === typeFilter;
    return matchesStatus && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-500";
      case "rejected": return "bg-red-500";
      case "pending": return "bg-yellow-500";
      default: return "bg-gray-500";
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case "casual": return "bg-blue-500";
      case "sick": return "bg-orange-500";
      case "emergency": return "bg-red-500";
      case "vacation": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "pending": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleApproveLeave = async (requestId: string) => {
    try {
      const response = await fetch(`/api/leave/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setLeaveRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { ...request, status: "approved" as const }
            : request
        ));
        // Refresh data to get updated balances
        fetchLeaveData();
      } else {
        console.error("Error approving leave:", response.statusText);
      }
    } catch (error) {
      console.error("Error approving leave:", error);
    }
  };

  const handleRejectLeave = async (requestId: string) => {
    try {
      const response = await fetch(`/api/leave/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'rejected', rejectionReason: 'Rejected by admin' }),
      });

      if (response.ok) {
        setLeaveRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { ...request, status: "rejected" as const }
            : request
        ));
      } else {
        console.error("Error rejecting leave:", response.statusText);
      }
    } catch (error) {
      console.error("Error rejecting leave:", error);
    }
  };

  const handleSubmitLeaveRequest = async () => {
    if (!selectedDate || !endDate || !newLeaveRequest.guardId || !newLeaveRequest.reason) {
      return;
    }

    try {
      const response = await fetch('/api/leave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          guardId: newLeaveRequest.guardId,
          leaveType: newLeaveRequest.leaveType,
          startDate: selectedDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          reason: newLeaveRequest.reason,
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        setLeaveRequests(prev => [newRequest, ...prev]);
        setIsDialogOpen(false);
        setNewLeaveRequest({ guardId: "", leaveType: "casual", reason: "" });
        setSelectedDate(new Date());
        setEndDate(new Date());
        // Refresh data to get updated balances
        fetchLeaveData();
      } else {
        const error = await response.json();
        console.error("Error submitting leave request:", error.error);
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  // Calendar helper functions
  const generateCalendarDays = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
    }> = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === month,
        isToday: current.toDateString() === now.toDateString(),
      });
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getLeavesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return leaveRequests.filter(leave => {
      const start = new Date(leave.startDate);
      const end = new Date(leave.endDate);
      const checkDate = new Date(dateStr);
      return checkDate >= start && checkDate <= end;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDateForCalendar(date);
  };

  const getStaffAvailability = (date: Date) => {
    const totalGuards = leaveBalances.length;
    const onLeave = getLeavesForDate(date).filter(leave => leave.status === 'approved').length;
    const available = totalGuards - onLeave;
    return totalGuards > 0 ? Math.round((available / totalGuards) * 100) : 100;
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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.length}</div>
            <p className="text-xs text-muted-foreground">
              {leaveRequests.filter(r => r.status === "pending").length} pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests.filter(r => r.status === "approved").length}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leaveRequests.filter(r => r.status === "rejected").length}
            </div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Days</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(leaveRequests.reduce((acc, r) => acc + r.days, 0) / leaveRequests.length) || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Per request
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Leave Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>New Leave Request</DialogTitle>
                <DialogDescription>Submit a new leave request for a guard</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="guard">Guard</Label>
                  <Select 
                    value={newLeaveRequest.guardId} 
                    onValueChange={(value) => setNewLeaveRequest(prev => ({ ...prev, guardId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select guard" />
                    </SelectTrigger>
                    <SelectContent>
                      {leaveBalances.map(balance => (
                        <SelectItem key={balance.guardId} value={balance.guardId}>
                          {balance.guardName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leaveType">Leave Type</Label>
                  <Select 
                    value={newLeaveRequest.leaveType} 
                    onValueChange={(value: any) => setNewLeaveRequest(prev => ({ ...prev, leaveType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casual">Casual Leave</SelectItem>
                      <SelectItem value="sick">Sick Leave</SelectItem>
                      <SelectItem value="emergency">Emergency Leave</SelectItem>
                      <SelectItem value="vacation">Vacation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Date</Label>
                    <div className="relative">
                      <Input
                        value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                        readOnly
                        className="pr-10"
                      />
                      <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border mt-2"
                    />
                  </div>
                  <div>
                    <Label>End Date</Label>
                    <div className="relative">
                      <Input
                        value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                        readOnly
                        className="pr-10"
                      />
                      <CalendarIcon className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    </div>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      className="rounded-md border mt-2"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    placeholder="Enter reason for leave..."
                    value={newLeaveRequest.reason}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitLeaveRequest}>
                    Submit Request
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="sick">Sick</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
              <SelectItem value="vacation">Vacation</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="balances">Leave Balances</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="space-y-4">
          <div className="grid gap-4">
            {filteredLeaveRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={request.guardPhoto} alt={request.guardName} />
                        <AvatarFallback>{request.guardName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{request.guardName}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className={`${getLeaveTypeColor(request.leaveType)} text-white`}>
                            {request.leaveType}
                          </Badge>
                          <Badge variant="outline" className={`${getStatusColor(request.status)} text-white`}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status}</span>
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {format(new Date(request.startDate), "MMM dd")} - {format(new Date(request.endDate), "MMM dd, yyyy")} ({request.days} days)
                        </p>
                        <p className="text-sm text-muted-foreground">{request.reason}</p>
                        {request.approvedBy && (
                          <p className="text-xs text-muted-foreground">
                            {request.status === "approved" ? "Approved by" : "Rejected by"} {request.approvedBy} on {format(new Date(request.approvedAt!), "MMM dd, yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {request.status === "pending" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleApproveLeave(request.id)}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRejectLeave(request.id)}
                          >
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="balances" className="space-y-4">
          <div className="grid gap-4">
            {leaveBalances.map((balance) => (
              <Card key={balance.guardId}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{balance.guardName}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Casual Leave</p>
                          <p className="text-lg font-semibold">{balance.casualLeave}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Sick Leave</p>
                          <p className="text-lg font-semibold">{balance.sickLeave}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Vacation</p>
                          <p className="text-lg font-semibold">{balance.vacationLeave}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Remaining</p>
                          <p className="text-lg font-semibold text-green-600">{balance.remainingLeave}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Used</p>
                      <p className="text-2xl font-bold">{balance.usedLeave}</p>
                      <p className="text-sm text-muted-foreground">of {balance.totalLeave} days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Leave Calendar</CardTitle>
              <CardDescription>Interactive calendar showing all leave requests and availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar View */}
                <div className="lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">Previous</Button>
                      <Button variant="outline" size="sm">Today</Button>
                      <Button variant="outline" size="sm">Next</Button>
                    </div>
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                        {day}
                      </div>
                    ))}
                    
                    {/* Calendar Days */}
                    {generateCalendarDays().map((day, index) => {
                      const dayLeaves = getLeavesForDate(day.date);
                      return (
                        <div 
                          key={index}
                          className={`min-h-20 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                            day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-400'
                          } ${day.isToday ? 'ring-2 ring-blue-500' : ''}`}
                          onClick={() => handleDateClick(day.date)}
                        >
                          <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                          <div className="space-y-1">
                            {dayLeaves.slice(0, 2).map(leave => (
                              <div 
                                key={leave.id}
                                className={`text-xs p-1 rounded text-white ${getLeaveTypeColor(leave.leaveType)}`}
                                title={`${leave.guardName}: ${leave.leaveType}`}
                              >
                                {leave.guardName.split(' ').map(n => n[0]).join('')}
                              </div>
                            ))}
                            {dayLeaves.length > 2 && (
                              <div className="text-xs text-gray-500">+{dayLeaves.length - 2} more</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {/* Day Details Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Selected Date</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedDateForCalendar ? (
                        <div className="space-y-3">
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {selectedDateForCalendar.getDate()}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {selectedDateForCalendar.toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                month: 'long', 
                                year: 'numeric' 
                              })}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Leave Requests</h4>
                            {getLeavesForDate(selectedDateForCalendar).length === 0 ? (
                              <p className="text-sm text-muted-foreground">No leave requests</p>
                            ) : (
                              <div className="space-y-2">
                                {getLeavesForDate(selectedDateForCalendar).map(leave => (
                                  <div key={leave.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div>
                                      <div className="text-sm font-medium">{leave.guardName}</div>
                                      <div className="text-xs text-muted-foreground">{leave.leaveType}</div>
                                    </div>
                                    <Badge 
                                      variant="secondary" 
                                      className={`${getStatusColor(leave.status)} text-white text-xs`}
                                    >
                                      {leave.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-medium text-sm">Staff Availability</h4>
                            <div className="text-center">
                              <div className="text-lg font-bold text-green-600">
                                {getStaffAvailability(selectedDateForCalendar)}%
                              </div>
                              <div className="text-xs text-muted-foreground">Available</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground text-center">Select a date to view details</p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Legend</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded"></div>
                        <span className="text-sm">Casual Leave</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded"></div>
                        <span className="text-sm">Sick Leave</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded"></div>
                        <span className="text-sm">Emergency Leave</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded"></div>
                        <span className="text-sm">Vacation</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}