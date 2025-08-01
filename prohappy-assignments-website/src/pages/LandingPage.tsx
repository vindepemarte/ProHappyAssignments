import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Shield } from 'lucide-react';
import { Layout, Logo } from '../components';
import { useComponentPreloader } from '../utils/componentPreloader';

const LandingPage: React.FC = () => {
  const { preloadPage } = useComponentPreloader();

  const handleFormsPreload = () => {
    preloadPage('forms');
  };

  return (
    <Layout>
      <div className="bg-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] py-12 sm:py-16 lg:py-20">
              <div className="text-center max-w-4xl mx-auto">
                {/* Brand Logo/Icon */}
                <div className="flex justify-center mb-8">
                  <div className="transform hover:scale-110 transition-transform duration-300 hover:rotate-3">
                    <Logo size="xl" className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl" />
                  </div>
                </div>
                
                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-primary via-secondary to-accent-purple bg-clip-text text-transparent mb-6 sm:mb-8 leading-tight">
                  ProHappyAssignments
                </h1>
                
                {/* Subheading */}
                <div className="card p-8 mb-8 sm:mb-12 max-w-3xl mx-auto">
                  <p className="text-lg sm:text-xl md:text-2xl text-accent-navy mb-4 leading-relaxed font-medium">
                    Your trusted partner for academic assignment services ✨
                  </p>
                  <p className="text-base sm:text-lg text-accent-navy/80 leading-relaxed">
                    Get professional help with your assignments, request changes, or submit completed work with confidence!
                  </p>
                </div>
                
                {/* Key Benefits */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10 sm:mb-12">
                  <div className="card-colorful px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-success to-primary rounded-full flex items-center justify-center">
                      ⚡
                    </div>
                    <span className="font-semibold text-accent-navy">100% Pass Rate</span>
                  </div>
                  <div className="card-colorful px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      🔒
                    </div>
                    <span className="font-semibold text-accent-navy">100% Trustness</span>
                  </div>
                  <div className="card-colorful px-6 py-4 flex items-center gap-3 shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="w-10 h-10 bg-gradient-to-r from-accent-yellow to-accent-red rounded-full flex items-center justify-center">
                      🎯
                    </div>
                    <span className="font-semibold text-accent-navy">0% Risk</span>
                  </div>
                    <span>Expert Quality</span>
                  </div>
                </div>
                
                {/* CTA Button */}
                <Link
                  to="/forms"
                  onMouseEnter={handleFormsPreload}
                  className="inline-flex items-center gap-2 bg-primary text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-primary-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Start Your Project
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>
                
                {/* Trust Indicator */}
                <p className="text-xs sm:text-sm text-gray-500 mt-4 sm:mt-6">
                  Trusted by thousands of students worldwide
                </p>
              </div>
            </div>
          </div>
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Features Section */}
        <div className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
                Why Choose ProHappyAssignments?
              </h2>
              <p className="text-base sm:text-lg text-gray-dark max-w-2xl mx-auto">
                We provide comprehensive academic support with three specialized services tailored to your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
              {/* Assignment Requests */}
              <div className="card p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-accent-yellow">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-yellow to-accent-red rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <div className="text-2xl">📝</div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-accent-navy mb-4">
                  Assignment Requests
                </h3>
                <p className="text-base text-accent-navy/80 mb-6 leading-relaxed">
                  Submit your assignment requirements with secure access codes. Get professional help with essays, research papers, and academic projects! ✨
                </p>
                <Link
                  to="/forms"
                  onMouseEnter={handleFormsPreload}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-yellow to-accent-red text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Get Started 🚀
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Request Changes */}
              <div className="card p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-primary">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <div className="text-2xl">🔄</div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-accent-navy mb-4">
                  Request Changes
                </h3>
                <p className="text-base text-accent-navy/80 mb-6 leading-relaxed">
                  Need modifications to your existing order? Use your reference code to request changes, extend deadlines, or add additional requirements! 🎯
                </p>
                <Link
                  to="/forms"
                  onMouseEnter={handleFormsPreload}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Request Changes 📋
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Worker Submissions */}
              <div className="card p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-l-4 border-accent-purple">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-purple to-primary rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <div className="text-2xl">👨‍💼</div>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-accent-navy mb-4">
                  Worker Submissions
                </h3>
                <p className="text-base text-accent-navy/80 mb-6 leading-relaxed">
                  Academic professionals can submit completed assignments using order reference codes. Secure delivery with client communication! 🔒
                </p>
                <Link
                  to="/forms"
                  onMouseEnter={handleFormsPreload}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-accent-purple to-primary text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Submit Work ✅
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
                How It Works
              </h2>
              <p className="text-base sm:text-lg text-gray-dark max-w-2xl mx-auto">
                Simple, secure, and efficient process to get your academic work done.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">
                  Choose Your Service
                </h3>
                <p className="text-sm sm:text-base text-gray-dark">
                  Select from assignment requests, change requests, or worker submissions.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">
                  Enter Access Code
                </h3>
                <p className="text-sm sm:text-base text-gray-dark">
                  Use your unique 5-character code to access the secure form.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">
                  Submit Details
                </h3>
                <p className="text-sm sm:text-base text-gray-dark">
                  Fill out the form with your requirements and upload any necessary files.
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-white font-bold text-lg sm:text-xl">
                  4
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 sm:mb-3">
                  Get Updates
                </h3>
                <p className="text-sm sm:text-base text-gray-dark">
                  Receive email updates about your submission and project progress.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final CTA Section */}
        <div className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent-purple opacity-90"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 sm:mb-8">
                Ready to Get Started?
              </h2>
              <p className="text-lg sm:text-xl text-white/95 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of happy students who trust ProHappyAssignments for their academic success! 🌟
              </p>
            </div>
            <div className="space-y-4">
              <Link
                to="/forms"
                onMouseEnter={handleFormsPreload}
                className="inline-flex items-center gap-3 bg-white text-accent-navy px-8 sm:px-12 py-4 sm:py-6 rounded-2xl text-lg sm:text-xl font-bold hover:bg-accent-yellow hover:text-accent-navy transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 hover:scale-105"
              >
                <span className="text-2xl">🚀</span>
                Start Your Project Now
                <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </Link>
              <p className="text-white/80 text-sm sm:text-base">
                ✨ 100% Pass Rate • 🔒 100% Trustness • 🎯 0% Risk ✨
              </p>
            </div>
          </div>
        </div>
    </Layout>
  );
};

export default LandingPage;