"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Upload,
  Download,
  FileText,
  User,
  DollarSign,
  BookOpen,
  Bell,
  Settings,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const receivedProjects = [
    {
      id: "PRJ001",
      title: "Data Structures Assignment",
      client: "John Doe",
      clientRef: "CLI001",
      dueDate: "2024-02-15",
      budget: "$150",
      status: "new",
      description: "Implement various data structures in Python...",
    },
    {
      id: "PRJ002",
      title: "Machine Learning Research Paper",
      client: "Jane Smith",
      clientRef: "CLI002",
      dueDate: "2024-02-20",
      budget: "$300",
      status: "in-progress",
      description: "Write a comprehensive research paper on neural networks...",
    },
    {
      id: "PRJ003",
      title: "Database Design Project",
      client: "Mike Johnson",
      clientRef: "CLI003",
      dueDate: "2024-02-10",
      budget: "$200",
      status: "completed",
      description: "Design and implement a relational database...",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "submitted":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <AlertCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
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
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-900 font-medium">Dr. Sarah Wilson</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Worker Dashboard</h1>
          <p className="text-blue-700">Manage your assignments and track earnings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-blue-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="upload" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Upload Work
            </TabsTrigger>
            <TabsTrigger value="invoices" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Invoices
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Clients
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
                  <CardTitle className="text-sm font-medium text-blue-700">Active Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-900">5</div>
                  <p className="text-xs text-blue-600">2 due this week</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">This Month Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">$1,250</div>
                  <p className="text-xs text-yellow-600">+15% from last month</p>
                </CardContent>
              </Card>
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Completed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <p className="text-xs text-green-600">98% satisfaction rate</p>
                </CardContent>
              </Card>
              <Card className="border-red-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Total Earnings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">$8,450</div>
                  <p className="text-xs text-red-600">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Recent Activity</CardTitle>
                <CardDescription className="text-blue-700">Your latest project updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "Submitted", project: "Machine Learning Paper", time: "2 hours ago", type: "success" },
                    { action: "Started", project: "Database Design", time: "1 day ago", type: "info" },
                    { action: "Received", project: "Data Structures Assignment", time: "2 days ago", type: "new" },
                    { action: "Completed", project: "Algorithms Project", time: "3 days ago", type: "success" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-blue-100 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "success"
                            ? "bg-green-500"
                            : activity.type === "info"
                              ? "bg-blue-500"
                              : "bg-yellow-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-blue-900">
                          <span className="font-semibold">{activity.action}</span> {activity.project}
                        </p>
                        <p className="text-sm text-blue-600">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Received Projects</CardTitle>
                <CardDescription className="text-blue-700">Projects assigned to you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {receivedProjects.map((project) => (
                    <div key={project.id} className="p-4 border border-blue-100 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-blue-900">{project.title}</h3>
                            <Badge className={getStatusColor(project.status)}>
                              {getStatusIcon(project.status)}
                              <span className="ml-1">{project.status.replace("-", " ")}</span>
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-700 mb-2">{project.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-blue-600">
                            <span>Client: {project.client}</span>
                            <span>Ref: {project.clientRef}</span>
                            <span>Due: {project.dueDate}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-blue-900 text-lg">{project.budget}</p>
                          <div className="flex space-x-2 mt-2">
                            {project.status === "new" && (
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                Accept
                              </Button>
                            )}
                            {project.status === "in-progress" && (
                              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                Update
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-blue-600 text-blue-600 bg-transparent"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Projects Database View */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Projects Database View</CardTitle>
                <CardDescription className="text-blue-700">All projects with status tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Project ID</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Title</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Client</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Due Date</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {receivedProjects.map((project) => (
                        <tr key={project.id} className="border-b border-blue-50 hover:bg-blue-50">
                          <td className="py-3 px-4 text-blue-900 font-medium">{project.id}</td>
                          <td className="py-3 px-4 text-blue-900">{project.title}</td>
                          <td className="py-3 px-4 text-blue-700">{project.client}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                          </td>
                          <td className="py-3 px-4 text-blue-700">{project.dueDate}</td>
                          <td className="py-3 px-4 text-blue-900 font-semibold">{project.budget}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Work Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Upload Completed Project</CardTitle>
                <CardDescription className="text-blue-700">Submit your finished work</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectSelect" className="text-blue-900">
                    Select Project
                  </Label>
                  <select className="w-full p-3 border border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none">
                    <option value="">Choose a project to submit</option>
                    <option value="PRJ002">Machine Learning Research Paper</option>
                    <option value="PRJ001">Data Structures Assignment</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-blue-900">Upload Files</Label>
                  <div className="border-2 border-dashed border-blue-200 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                    <p className="text-blue-700 mb-2">Drag and drop your completed work here</p>
                    <p className="text-sm text-blue-600">Supported formats: PDF, DOC, DOCX, ZIP</p>
                    <Button
                      variant="outline"
                      className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                    >
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workDescription" className="text-blue-900">
                    Work Description
                  </Label>
                  <Textarea
                    id="workDescription"
                    placeholder="Describe your completed work, methodology, and any important notes..."
                    className="border-blue-200 focus:border-blue-500 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeSpent" className="text-blue-900">
                    Time Spent (hours)
                  </Label>
                  <Input
                    id="timeSpent"
                    type="number"
                    placeholder="Enter hours spent on this project"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">Submit Completed Work</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Monthly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">January 2024</span>
                    <span className="font-semibold text-blue-900">$1,250.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">December 2023</span>
                    <span className="font-semibold text-blue-900">$980.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">November 2023</span>
                    <span className="font-semibold text-blue-900">$1,100.00</span>
                  </div>
                  <div className="border-t border-blue-100 pt-4">
                    <div className="flex justify-between">
                      <span className="text-blue-700 font-semibold">Total Earnings</span>
                      <span className="font-bold text-blue-900">$8,450.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">Payment Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Pending Payment</span>
                    <Badge className="bg-yellow-100 text-yellow-800">$450.00</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Next Payment Date</span>
                    <span className="text-blue-900 font-semibold">Feb 1, 2024</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Payment Method</span>
                    <span className="text-blue-900">Bank Transfer</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Monthly Invoices</CardTitle>
                <CardDescription className="text-blue-700">Download your monthly payment invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { month: "January 2024", amount: "$1,250.00", status: "Paid", date: "2024-02-01" },
                    { month: "December 2023", amount: "$980.00", status: "Paid", date: "2024-01-01" },
                    { month: "November 2023", amount: "$1,100.00", status: "Paid", date: "2023-12-01" },
                    { month: "October 2023", amount: "$850.00", status: "Paid", date: "2023-11-01" },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-blue-100 rounded-lg"
                    >
                      <div>
                        <p className="font-semibold text-blue-900">{invoice.month}</p>
                        <p className="text-sm text-blue-700">Paid on {invoice.date}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-blue-900">{invoice.amount}</span>
                        <Badge className="bg-green-100 text-green-800">{invoice.status}</Badge>
                        <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Clients by Reference Number</CardTitle>
                <CardDescription className="text-blue-700">
                  Your client relationships and project history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      refNumber: "CLI001",
                      name: "John Doe",
                      university: "Harvard University",
                      projects: 5,
                      totalSpent: "$750",
                      rating: 4.8,
                      lastProject: "2024-01-15",
                    },
                    {
                      refNumber: "CLI002",
                      name: "Jane Smith",
                      university: "MIT",
                      projects: 3,
                      totalSpent: "$450",
                      rating: 4.9,
                      lastProject: "2024-01-10",
                    },
                    {
                      refNumber: "CLI003",
                      name: "Mike Johnson",
                      university: "Stanford University",
                      projects: 7,
                      totalSpent: "$1,200",
                      rating: 4.7,
                      lastProject: "2024-01-20",
                    },
                  ].map((client) => (
                    <div key={client.refNumber} className="p-4 border border-blue-100 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-900">{client.name}</h3>
                            <p className="text-sm text-blue-700">Ref: {client.refNumber}</p>
                            <p className="text-sm text-blue-600">{client.university}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm font-semibold text-blue-900">{client.rating}</span>
                          </div>
                          <p className="text-sm text-blue-700">{client.projects} projects</p>
                          <p className="text-sm font-semibold text-blue-900">{client.totalSpent}</p>
                          <p className="text-xs text-blue-600">Last: {client.lastProject}</p>
                        </div>
                      </div>
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
                <CardTitle className="text-blue-900">Worker Details</CardTitle>
                <CardDescription className="text-blue-700">Manage your professional profile</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-900">
                      First Name
                    </Label>
                    <Input id="firstName" defaultValue="Sarah" className="border-blue-200 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-900">
                      Last Name
                    </Label>
                    <Input id="lastName" defaultValue="Wilson" className="border-blue-200 focus:border-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="sarah.wilson@university.edu"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-blue-900">
                    Specialization
                  </Label>
                  <Input
                    id="specialization"
                    defaultValue="Computer Science, Machine Learning, Data Structures"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-blue-900">
                    Years of Experience
                  </Label>
                  <Input id="experience" defaultValue="8 years" className="border-blue-200 focus:border-blue-500" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="education" className="text-blue-900">
                    Education
                  </Label>
                  <Input
                    id="education"
                    defaultValue="Ph.D. Computer Science, Stanford University"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-blue-900">
                    Professional Bio
                  </Label>
                  <Textarea
                    id="bio"
                    defaultValue="Experienced computer science professional with expertise in machine learning, data structures, and algorithm design. Passionate about helping students understand complex concepts through clear explanations and practical examples."
                    className="border-blue-200 focus:border-blue-500 min-h-[120px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hourlyRate" className="text-blue-900">
                    Hourly Rate ($)
                  </Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    defaultValue="45"
                    className="border-blue-200 focus:border-blue-500"
                  />
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
