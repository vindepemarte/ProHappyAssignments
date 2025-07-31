"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, User, DollarSign, BookOpen, Bell, Settings, TrendingUp, BarChart3, PieChart } from "lucide-react"

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  // Mock data
  const projects = [
    {
      id: "PRJ001",
      title: "Data Structures Assignment",
      client: "John Doe",
      worker: "Dr. Sarah Wilson",
      status: "completed",
      budget: "$150",
      profit: "$45",
      dueDate: "2024-01-15",
    },
    {
      id: "PRJ002",
      title: "Machine Learning Paper",
      client: "Jane Smith",
      worker: "Prof. Johnson",
      status: "in-progress",
      budget: "$300",
      profit: "$90",
      dueDate: "2024-02-01",
    },
    {
      id: "PRJ003",
      title: "Database Design",
      client: "Mike Johnson",
      worker: "Dr. Brown",
      status: "pending",
      budget: "$200",
      profit: "$60",
      dueDate: "2024-02-15",
    },
  ]

  const workers = [
    {
      id: "WRK001",
      name: "Dr. Sarah Wilson",
      specialization: "Computer Science",
      projects: 15,
      earnings: "$2,250",
      rating: 4.9,
      status: "active",
    },
    {
      id: "WRK002",
      name: "Prof. Johnson",
      specialization: "Machine Learning",
      projects: 12,
      earnings: "$1,800",
      rating: 4.8,
      status: "active",
    },
    {
      id: "WRK003",
      name: "Dr. Brown",
      specialization: "Database Systems",
      projects: 8,
      earnings: "$1,200",
      rating: 4.7,
      status: "busy",
    },
  ]

  const clients = [
    {
      id: "CLI001",
      name: "John Doe",
      university: "Harvard University",
      projects: 5,
      totalSpent: "$750",
      status: "active",
    },
    {
      id: "CLI002",
      name: "Jane Smith",
      university: "MIT",
      projects: 3,
      totalSpent: "$450",
      status: "active",
    },
    {
      id: "CLI003",
      name: "Mike Johnson",
      university: "Stanford",
      projects: 7,
      totalSpent: "$1,200",
      status: "active",
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
      case "active":
        return "bg-green-100 text-green-800"
      case "busy":
        return "bg-red-100 text-red-800"
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
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-blue-900 font-medium">Agent Smith</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">Agent Dashboard</h1>
          <p className="text-blue-700">Manage the platform and monitor performance</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white border border-blue-100">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Overview
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Projects
            </TabsTrigger>
            <TabsTrigger value="workers" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Workers
            </TabsTrigger>
            <TabsTrigger value="clients" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Clients
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Analytics
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
                  <div className="text-2xl font-bold text-blue-900">156</div>
                  <p className="text-xs text-blue-600">+12 this month</p>
                </CardContent>
              </Card>
              <Card className="border-yellow-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-700">Active Workers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">23</div>
                  <p className="text-xs text-yellow-600">85% utilization</p>
                </CardContent>
              </Card>
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-700">Total Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">89</div>
                  <p className="text-xs text-green-600">+8 new this month</p>
                </CardContent>
              </Card>
              <Card className="border-red-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-700">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">$15,450</div>
                  <p className="text-xs text-red-600">+18% from last month</p>
                </CardContent>
              </Card>
            </div>

            {/* Financial Overview */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Profit Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Revenue</span>
                    <span className="font-semibold text-blue-900">$15,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Paid to Workers</span>
                    <span className="font-semibold text-blue-900">$10,815</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Platform Profit</span>
                    <span className="font-semibold text-green-600">$4,635</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Profit Margin</span>
                    <span className="font-semibold text-green-600">30%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Avg. Project Value</span>
                    <span className="font-semibold text-blue-900">$245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Avg. Profit per Project</span>
                    <span className="font-semibold text-green-600">$74</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Completion Rate</span>
                    <span className="font-semibold text-green-600">96%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Client Satisfaction</span>
                    <span className="font-semibold text-green-600">4.8/5</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Recent Platform Activity</CardTitle>
                <CardDescription className="text-blue-700">Latest updates across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      action: "New client registered",
                      details: "Jane Smith from MIT",
                      time: "2 hours ago",
                      type: "client",
                    },
                    {
                      action: "Project completed",
                      details: "Data Structures Assignment by Dr. Wilson",
                      time: "4 hours ago",
                      type: "project",
                    },
                    {
                      action: "Worker joined",
                      details: "Prof. Anderson - Mathematics specialist",
                      time: "1 day ago",
                      type: "worker",
                    },
                    {
                      action: "Payment processed",
                      details: "$450 paid to Dr. Brown",
                      time: "1 day ago",
                      type: "payment",
                    },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 border border-blue-100 rounded-lg">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          activity.type === "client"
                            ? "bg-green-500"
                            : activity.type === "project"
                              ? "bg-blue-500"
                              : activity.type === "worker"
                                ? "bg-yellow-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-blue-900">
                          <span className="font-semibold">{activity.action}</span>
                        </p>
                        <p className="text-sm text-blue-700">{activity.details}</p>
                        <p className="text-xs text-blue-600">{activity.time}</p>
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
                <CardTitle className="text-blue-900">Projects Database View</CardTitle>
                <CardDescription className="text-blue-700">All projects with detailed information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Project ID</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Title</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Client</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Worker</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Status</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Budget</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Profit</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.id} className="border-b border-blue-50 hover:bg-blue-50">
                          <td className="py-3 px-4 text-blue-900 font-medium">{project.id}</td>
                          <td className="py-3 px-4 text-blue-900">{project.title}</td>
                          <td className="py-3 px-4 text-blue-700">{project.client}</td>
                          <td className="py-3 px-4 text-blue-700">{project.worker}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(project.status)}>{project.status.replace("-", " ")}</Badge>
                          </td>
                          <td className="py-3 px-4 text-blue-900 font-semibold">{project.budget}</td>
                          <td className="py-3 px-4 text-green-600 font-semibold">{project.profit}</td>
                          <td className="py-3 px-4 text-blue-700">{project.dueDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Workers Tab */}
          <TabsContent value="workers" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Workers Database View</CardTitle>
                <CardDescription className="text-blue-700">
                  Manage platform workers and their performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Worker ID</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Specialization</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Projects</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Earnings</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Rating</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workers.map((worker) => (
                        <tr key={worker.id} className="border-b border-blue-50 hover:bg-blue-50">
                          <td className="py-3 px-4 text-blue-900 font-medium">{worker.id}</td>
                          <td className="py-3 px-4 text-blue-900">{worker.name}</td>
                          <td className="py-3 px-4 text-blue-700">{worker.specialization}</td>
                          <td className="py-3 px-4 text-blue-700">{worker.projects}</td>
                          <td className="py-3 px-4 text-blue-900 font-semibold">{worker.earnings}</td>
                          <td className="py-3 px-4 text-yellow-600 font-semibold">★ {worker.rating}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(worker.status)}>{worker.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Clients Tab */}
          <TabsContent value="clients" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Clients Database View</CardTitle>
                <CardDescription className="text-blue-700">Manage platform clients and their activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-blue-100">
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Client ID</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">University</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Projects</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Total Spent</th>
                        <th className="text-left py-3 px-4 text-blue-900 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clients.map((client) => (
                        <tr key={client.id} className="border-b border-blue-50 hover:bg-blue-50">
                          <td className="py-3 px-4 text-blue-900 font-medium">{client.id}</td>
                          <td className="py-3 px-4 text-blue-900">{client.name}</td>
                          <td className="py-3 px-4 text-blue-700">{client.university}</td>
                          <td className="py-3 px-4 text-blue-700">{client.projects}</td>
                          <td className="py-3 px-4 text-blue-900 font-semibold">{client.totalSpent}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Profit Made
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">This Month</span>
                    <span className="font-semibold text-green-600">$4,635</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Last Month</span>
                    <span className="font-semibold text-green-600">$3,920</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">This Quarter</span>
                    <span className="font-semibold text-green-600">$12,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Profit</span>
                    <span className="font-bold text-green-600">$45,230</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-yellow-100">
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Total Paid to Workers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-blue-700">This Month</span>
                    <span className="font-semibold text-blue-900">$10,815</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Last Month</span>
                    <span className="font-semibold text-blue-900">$9,180</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">This Quarter</span>
                    <span className="font-semibold text-blue-900">$29,050</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Total Paid</span>
                    <span className="font-bold text-blue-900">$105,670</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center">
                  <PieChart className="w-5 h-5 mr-2" />
                  Average Profit per Project
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-900 mb-2">$74</div>
                    <p className="text-blue-700">Overall Average</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">$95</div>
                    <p className="text-blue-700">High-Value Projects</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">$52</div>
                    <p className="text-blue-700">Standard Projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">Top Performing Workers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Dr. Sarah Wilson", earnings: "$2,250", projects: 15 },
                      { name: "Prof. Johnson", earnings: "$1,800", projects: 12 },
                      { name: "Dr. Brown", earnings: "$1,200", projects: 8 },
                    ].map((worker, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-blue-100 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-blue-900">{worker.name}</p>
                          <p className="text-sm text-blue-700">{worker.projects} projects</p>
                        </div>
                        <span className="font-semibold text-green-600">{worker.earnings}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">Top Spending Clients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Mike Johnson", spent: "$1,200", projects: 7 },
                      { name: "John Doe", spent: "$750", projects: 5 },
                      { name: "Jane Smith", spent: "$450", projects: 3 },
                    ].map((client, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-blue-100 rounded-lg"
                      >
                        <div>
                          <p className="font-semibold text-blue-900">{client.name}</p>
                          <p className="text-sm text-blue-700">{client.projects} projects</p>
                        </div>
                        <span className="font-semibold text-blue-900">{client.spent}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">Agent Details</CardTitle>
                <CardDescription className="text-blue-700">
                  Manage your agent profile and platform settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-blue-900">
                      First Name
                    </Label>
                    <Input id="firstName" defaultValue="Agent" className="border-blue-200 focus:border-blue-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-blue-900">
                      Last Name
                    </Label>
                    <Input id="lastName" defaultValue="Smith" className="border-blue-200 focus:border-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-blue-900">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="agent.smith@prohappyassignments.com"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-blue-900">
                    Role
                  </Label>
                  <Input
                    id="role"
                    defaultValue="Platform Administrator"
                    className="border-blue-200 focus:border-blue-500"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-blue-900">
                    Department
                  </Label>
                  <Input
                    id="department"
                    defaultValue="Operations Management"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="joinDate" className="text-blue-900">
                    Join Date
                  </Label>
                  <Input
                    id="joinDate"
                    defaultValue="January 15, 2023"
                    className="border-blue-200 focus:border-blue-500"
                    disabled
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="permissions" className="text-blue-900">
                    Permissions
                  </Label>
                  <div className="p-3 border border-blue-200 rounded-lg bg-blue-50">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-900">Full Platform Access</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-900">User Management</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-900">Financial Reports</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-blue-900">System Configuration</span>
                      </div>
                    </div>
                  </div>
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
