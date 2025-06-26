import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calculator, CreditCard, ArrowRight, CheckCircle, Receipt, TrendingUp } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with seamless gradient */}
      <div className="bg-gradient-to-b from-slate-50 via-blue-50 via-blue-100 to-blue-150">
        {/* Header */}
        <header className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 animate-fade-in">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center animate-bounce-gentle">
                <Receipt className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">BillSplitr</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-sm sm:text-base text-gray-600 hover:text-gray-900 px-2 sm:px-4">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-3 sm:px-6 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-teal-500/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-green-400/20 to-blue-500/20 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-green-500/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full animate-float"></div>
        </div>

        {/* Hero Content */}
        <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-slide-in-left">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-900 animate-fade-in">Track Expenses.</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-teal-500 bg-clip-text text-transparent animate-gradient-text">
                    Settle Smarter.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg animate-fade-in-delayed">
                  The easiest way to split bills, track group expenses, and settle up with friends. Perfect for trips,
                  roommates, and any shared costs.
                </p>
              </div>

              {/* CTA Button - Removed Watch Demo */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-fade-in-delayed-2">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-gentle"
                  >
                    Start Splitting Bills
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              {/* Feature Points */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 pt-4 animate-fade-in-delayed-3">
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    Free to get started
                  </span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-200"></div>
                  <span className="text-sm sm:text-base text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    No hidden fees
                  </span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse animation-delay-400"></div>
                  <span className="text-sm sm:text-base text-gray-600 font-medium group-hover:text-gray-900 transition-colors">
                    Secure & private
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content - Compact App Mockup */}
            <div className="relative animate-slide-in-right">
              <div className="relative bg-gradient-to-br from-blue-100 to-teal-100 rounded-2xl p-4 sm:p-6 shadow-2xl animate-float-gentle max-w-md mx-auto">
                {/* Browser Window Mockup - Smaller */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Browser Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-teal-400 px-3 sm:px-4 py-2 sm:py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse animation-delay-200"></div>
                        <div className="w-2 h-2 bg-white/30 rounded-full animate-pulse animation-delay-400"></div>
                      </div>
                    </div>
                  </div>

                  {/* App Content - Compact */}
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    {/* Group Header */}
                    <div className="animate-fade-in">
                      <h3 className="text-base sm:text-lg font-bold text-gray-900">Goa Trip</h3>
                      <p className="text-xs sm:text-sm text-gray-500">5 members</p>
                    </div>

                    {/* Expenses - Compact */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg transform hover:scale-102 transition-all duration-300 animate-slide-in-up">
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Hotel Booking</h4>
                          <p className="text-xs text-gray-500">Paid by Sarah</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm sm:text-base font-bold text-green-600 animate-number-count">₹12,000</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg transform hover:scale-102 transition-all duration-300 animate-slide-in-up animation-delay-200">
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Group Dinner</h4>
                          <p className="text-xs text-gray-500">Paid by Alex</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm sm:text-base font-bold text-green-600 animate-number-count">₹3,500</p>
                        </div>
                      </div>
                    </div>

                    {/* Balance Summary - Compact */}
                    <div className="bg-blue-50 rounded-lg p-2 sm:p-3 animate-slide-in-up animation-delay-400 transform hover:scale-102 transition-all duration-300">
                      <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">You owe Sarah</h4>
                      <p className="text-xs text-blue-600 mb-1">From hotel split</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-600 animate-number-count">₹2,400</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Elements - Smaller */}
              <div className="absolute -top-3 -right-3 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full opacity-20 animate-float-delayed"></div>
              <div className="absolute top-1/2 -right-6 w-6 h-6 bg-gradient-to-br from-teal-400 to-green-500 rounded-full opacity-30 animate-float-slow"></div>
            </div>
          </div>
        </section>
      </div>

      {/* How It Works Section - Seamless blend with hero only */}
      <section className="bg-gradient-to-b from-blue-150 to-blue-100 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Get started in three simple steps</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Create a Group</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                Start by creating a group for your trip, apartment, or any shared expenses. Invite your friends or
                roommates.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Add Expenses</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                Log shared expenses as they happen. Upload receipts, add notes, and choose how to split the cost.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Settle Up</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                When it's time to settle, see exactly who owes what. Make payments and upload proof to close the loop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Why Choose BillSplitr - COMPLETELY SEPARATE */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16 animate-fade-in-up">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Why Choose BillSplitr?</h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage group expenses effortlessly
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Group Management",
                desc: "Create groups for trips, roommates, or any shared expenses. Invite members easily and manage permissions.",
                delay: "",
              },
              {
                icon: Calculator,
                title: "Smart Calculations",
                desc: "Automatically calculate who owes what with intelligent splitting algorithms. No more manual math.",
                delay: "animation-delay-100",
              },
              {
                icon: Receipt,
                title: "Expense Tracking",
                desc: "Log expenses with photos, receipts, and detailed notes. Keep everything organized and transparent.",
                delay: "animation-delay-200",
              },
              {
                icon: TrendingUp,
                title: "Visual Analytics",
                desc: "Beautiful charts and graphs to understand spending patterns and group contributions.",
                delay: "animation-delay-300",
              },
              {
                icon: CreditCard,
                title: "Secure Settlements",
                desc: "Upload payment proofs, track settlement history, and maintain complete financial transparency.",
                delay: "animation-delay-400",
              },
              {
                icon: CheckCircle,
                title: "Real-time Updates",
                desc: "Everyone stays in sync with instant notifications and real-time balance updates.",
                delay: "animation-delay-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`p-6 sm:p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white transform hover:scale-105 animate-fade-in-up ${feature.delay} group`}
              >
                <CardContent className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center bg-gradient-to-r from-blue-600 to-green-500 rounded-3xl p-8 sm:p-16 text-white relative overflow-hidden animate-fade-in-up">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-green-500 animate-gradient-shift"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in">
                Ready to simplify your shared expenses?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
                Join thousands of users who trust BillSplitr to manage their group finances. Start tracking and
                splitting expenses today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in-delayed-2">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>

              <p className="text-base sm:text-lg opacity-80 animate-fade-in-delayed-3">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Receipt className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                </div>
                <span className="text-lg sm:text-xl lg:text-2xl font-bold">BillSplitr</span>
              </div>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                The easiest way to split bills and track group expenses with friends and family.
              </p>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Demo", "Mobile App"] },
              { title: "Company", links: ["About", "Contact", "Privacy", "Terms"] },
              { title: "Connect", links: ["GitHub", "Twitter", "LinkedIn", "Support"] },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-3 sm:mb-4 text-base sm:text-lg">{section.title}</h4>
                <ul className="space-y-2 sm:space-y-3 text-gray-400">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={`/${link.toLowerCase().replace(" ", "-")}`}
                        className="text-sm sm:text-base hover:text-white transition-colors duration-300"
                      >
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p className="text-sm sm:text-base">
              &copy; 2024 BillSplitr. All rights reserved. Made with ❤️ for better expense management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
