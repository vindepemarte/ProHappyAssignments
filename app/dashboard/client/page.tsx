"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, CreditCard, Star, FileText, User, DollarSign, BookOpen, Bell, Settings } from "lucide-react"

export default function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const projects = [
    {
      id: "PRJ001",
      title: "Data Structures Assignment",
      status: "completed",
      grade: "A+",
      dueDate: "2024-01-15",
      worker: "Dr. Smith",
      amount: "$150",
    },
    {
      id: "PRJ002",
      title: "Machine Learning Research Paper",
      status: "in-progress",
      grade: null,
      dueDate: "2024-02-01",
      worker: "Prof. Johnson",
      amount: "$300",
    },
    {
      id: "PRJ003",
      title: "Database Design Project",
      status: "pending",
      grade: null,
      dueDate: "2024-02-15",
      worker: "Pending Assignment",
      amount: "$200",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-blue-900">ProHappyAssignments</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-blue-600">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-blue-600">
              <Settings className="w-5 h-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-900 font-medium">John Doe</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Client Dashboard</h1>
          <p className="text-blue-700">Manage your projects and track progress</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white border border-blue-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upload Project
            </TabsTrigger>
            <TabsTrigger value="billing" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Billing
            </TabsTrigger>
            <TabsTrigger value="reviews" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Reviews
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Profile
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-700">Total Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">12</div>
                  <p className="text-xs text-blue-600">+2 from last month</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">3</div>
                  <p className="text-xs text-yellow-600">2 due this week</p>
                </CardContent>
              </Card>
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <p className="text-xs text-green-600">Average grade: A-</p>
                </CardContent>
              </Card>
              <Card className="border-red-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Total Spent</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">$2,450</div>
                  <p className="text-xs text-red-600">This semester</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Projects */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Recent Projects</CardTitle>
                <CardDescription className="text-blue-700">Your latest assignment submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 border border-blue-100 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-blue-900">{project.title}</h3>
                          <p className="text-sm text-blue-700">
                            ID: {project.id} • Due: {project.dueDate}
                          </p>
                          <p className="text-sm text-blue-600">Worker: {project.worker}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                        {project.grade && (
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-500 mr-1" />
                            <span className="text-sm font-semibold text-blue-900">{project.grade}</span>
                          </div>
                        )}
                        <p className="text-sm font-semibold text-blue-900 mt-1">{project.amount}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Project Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Upload New Project</CardTitle>
                <CardDescription className="text-blue-700">Submit your assignment requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="projectTitle" className="text-blue-900">
                      Project Title
                    </Label>
                    <Input
                      id="projectTitle"
                      placeholder="Enter project title"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-blue-900">
                      Subject
                    </Label>
                    <Select>
                      <SelectTrigger className="border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="computer-science">Computer Science</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                        <SelectItem value="physics">Physics</SelectItem>
                        <SelectItem value="chemistry">Chemistry</SelectItem>
                        <SelectItem value="biology">Biology</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="dueDate" className="text-blue-900">
                      Due Date
                    </Label>
                    <Input id="dueDate" type="date" className="border-blue-200 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget" className="text-blue-900">
                      Budget ($)
                    </Label>
                    <Input
                      id="budget"
                      type="number"
                      placeholder="Enter your budget"
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-blue-900">
                    Project Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Provide detailed requirements and instructions..."
                    className="border-blue-200 focus:border-blue-500 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-900">Upload Files</Label>
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-700 mb-2">Drag and drop files here, or click to browse</p>
                    <p className="text-sm text-blue-600">Supported formats: PDF, DOC, DOCX, TXT</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Submit Project</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payment Methods
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 border border-blue-100 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-blue-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-blue-700">Expires 12/25</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Primary</Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                  >
                    Add Payment Method
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Billing Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">This Month</span>
                    <span className="font-semibold text-blue-900">$450.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Last Month</span>
                    <span className="font-semibold text-blue-900">$320.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Spent</span>
                    <span className="font-semibold text-blue-900">$2,450.00</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: "TXN001",
                      project: "Data Structures Assignment",
                      amount: "$150.00",
                      date: "2024-01-15",
                      status: "Completed",
                    },
                    {
                      id: "TXN002",
                      project: "Machine Learning Paper",
                      amount: "$300.00",
                      date: "2024-01-10",
                      status: "Processing",
                    },
                    {
                      id: "TXN003",
                      project: "Database Design",
                      amount: "$200.00",
                      date: "2024-01-05",
                      status: "Completed",
                    },
                  ].map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-blue-100 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-blue-900">{transaction.project}</p>
                        <p className="text-sm text-blue-700">
                          {transaction.id} • {transaction.date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-blue-900">{transaction.amount}</p>
                        <Badge
                          className={
                            transaction.status === "Completed"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Request Review</CardTitle>
                <CardDescription className="text-blue-700">
                  Request a review for your completed projects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reviewProject" className="text-blue-900">
                    Select Project
                  </Label>
                  <Select>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Choose a completed project" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRJ001">Data Structures Assignment</SelectItem>
                      <SelectItem value="PRJ004">Algorithms Project</SelectItem>
                      <SelectItem value="PRJ005">Software Engineering Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reviewReason" className="text-blue-900">
                    Reason for Review
                  </Label>
                  <Textarea
                    id="reviewReason"
                    placeholder="Please explain why you're requesting a review..."
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900">Submit Review Request</Button>
              </CardContent>
            </Card>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Project Grades</CardTitle>
                <CardDescription className="text-blue-700">Your assignment grades and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      project: "Data Structures Assignment",
                      grade: "A+",
                      feedback: "Excellent work! Well-structured code and clear documentation.",
                      worker: "Dr. Smith",
                    },
                    {
                      project: "Algorithms Project",
                      grade: "A",
                      feedback: "Good implementation with minor optimization opportunities.",
                      worker: "Prof. Johnson",
                    },
                    {
                      project: "Software Engineering Report",
                      grade: "A-",
                      feedback: "Comprehensive analysis, could use more real-world examples.",
                      worker: "Dr. Wilson",
                    },
                  ].map((item, index) => (
                    <div key={index} className="p-4 border border-blue-100 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-blue-900">{item.project}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          <span className="font-bold text-blue-900">{item.grade}</span>
                        </div>
                      </div>
                      <p className="text-blue-700 mb-2">{item.feedback}</p>
                      <p className="text-sm text-blue-600">Graded by: {item.worker}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Client Details</CardTitle>
                <CardDescription className="text-blue-700">Manage your account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-900">
                      First Name
                    </Label>
                    <Input id="firstName" defaultValue="John" className="border-blue-200 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-900">
                      Last Name
                    </Label>
                    <Input id="lastName" defaultValue="Doe" className="border-blue-200 focus:border-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john.doe@university.edu"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="university" className="text-blue-900">
                    University
                  </Label>
                  <Input
                    id="university"
                    defaultValue="Harvard University"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="major" className="text-blue-900">
                    Major
                  </Label>
                  <Input id="major" defaultValue="Computer Science" className="border-blue-200 focus:border-blue-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-blue-900">
                    Academic Year
                  </Label>
                  <Select defaultValue="senior">
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="freshman">Freshman</SelectItem>
                      <SelectItem value="sophomore">Sophomore</SelectItem>
                      <SelectItem value="junior">Junior</SelectItem>
                      <SelectItem value="senior">Senior</SelectItem>
                      <SelectItem value="graduate">Graduate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Update Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
