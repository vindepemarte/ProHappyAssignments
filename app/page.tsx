import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-blue-700 hover:text-blue-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-blue-700 hover:text-blue-900 transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-blue-700 hover:text-blue-900 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-6 bg-yellow-100 text-yellow-800 border-yellow-200">
            Trusted by 10,000+ Students Worldwide
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-blue-900 mb-6 leading-tight">
            Premium Academic
            <span className="text-yellow-500"> Assignments</span>
            <br />
            Made by Experts
          </h1>
          <p className="text-xl text-blue-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            We offer example assignments crafted by human experts for universities worldwide. Our platform connects
            agents, workers, and clients in an automated ecosystem that's easy to use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg bg-transparent"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">Why Choose ProHappyAssignments?</h2>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto">
              Our platform offers everything you need for academic success with a seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Expert-Crafted Content</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-700">
                  All assignments are created by qualified professionals with university-level expertise across various
                  subjects.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-yellow-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-yellow-600" />
                </div>
                <CardTitle className="text-blue-900">Collaborative Ecosystem</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-700">
                  Seamless collaboration between clients, workers, and agents in an automated, user-friendly
                  environment.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-red-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle className="text-blue-900">Quality Guaranteed</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-blue-700">
                  Every project goes through rigorous quality checks and review processes to ensure excellence.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-blue-900 mb-4">How It Works</h2>
            <p className="text-xl text-blue-700 max-w-2xl mx-auto">
              Simple steps to get your academic assignments completed by experts.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Upload Your Project</h3>
              <p className="text-blue-700">
                Submit your assignment requirements, deadlines, and any specific instructions through our easy-to-use
                platform.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Expert Assignment</h3>
              <p className="text-blue-700">
                Our system matches your project with qualified workers who specialize in your subject area.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Receive & Review</h3>
              <p className="text-blue-700">
                Get your completed assignment, review the quality, and request revisions if needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-blue-700">Happy Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">500+</div>
              <div className="text-blue-700">Expert Writers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">50+</div>
              <div className="text-blue-700">Universities</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
              <div className="text-blue-700">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who trust ProHappyAssignments for their academic success.
          </p>
          <Link href="/register">
            <Button
              size="lg"
              className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 px-8 py-4 text-lg font-semibold"
            >
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-900" />
                </div>
                <h3 className="text-xl font-bold">ProHappyAssignments</h3>
              </div>
              <p className="text-blue-200">Your trusted partner for academic excellence worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Assignment Writing</li>
                <li>Research Papers</li>
                <li>Essay Writing</li>
                <li>Thesis Support</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-blue-200">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Live Chat</li>
                <li>FAQ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-blue-200">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-blue-800 mt-8 pt-8 text-center text-blue-200">
            <p>&copy; 2024 ProHappyAssignments. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
