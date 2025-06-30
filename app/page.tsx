"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Calculator, CreditCard, ArrowRight, CheckCircle, Receipt, TrendingUp, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const [user, setUser] = useState<any>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u)
      setAuthLoading(false)
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section with seamless gradient */}
      <div className="bg-gradient-to-b from-slate-50 via-blue-50 via-blue-100 to-blue-150">

        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-600/20 to-teal-500/20 rounded-full animate-float"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-gradient-to-br from-green-600/20 to-blue-500/20 rounded-full animate-float-delayed"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-gradient-to-br from-teal-600/20 to-green-500/20 rounded-full animate-float-slow"></div>
          <div className="absolute bottom-20 right-10 w-12 h-12 bg-gradient-to-br from-blue-600/20 to-purple-500/20 rounded-full animate-float"></div>
        </div>

        {/* Hero Content */}
        <section className="container mx-auto px-8 sm:px-20 py-8 sm:py-16 lg:py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 animate-slide-in-left">
              <div className="space-y-4 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="text-gray-900 animate-fade-in">Track Expenses.</span>
                  <br />
                  <span className="bg-gradient-to-r from-blue-900 via-blue-600 to-teal-600 bg-clip-text text-transparent animate-gradient-text">
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
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r  from-blue-700 to-green-600 hover:from-blue-800 hover:to-green-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-pulse-gentle"
                  onClick={() => {
                    if (authLoading) return;
                    if (user) {
                      router.push("/dashboard")
                    } else {
                      router.push("/register")
                    }
                  }}
                  disabled={authLoading}
                >
                  {authLoading ? "Loading..." : (
                    <>
                      Start Splitting Bills
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>

              {/* Feature Points */}
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-8 pt-4 animate-fade-in-delayed-3">
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse"></div>
                  <span className="text-sm sm:text-base text-blue-900 font-medium group-hover:text-gray-900 transition-colors">
                    Free to get started
                  </span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse animation-delay-200"></div>
                  <span className="text-sm sm:text-base text-blue-900 font-medium group-hover:text-gray-900 transition-colors">
                    No hidden fees
                  </span>
                </div>
                <div className="flex items-center gap-2 group">
                  <div className="w-2 h-2 bg-green-800 rounded-full animate-pulse animation-delay-400"></div>
                  <span className="text-sm sm:text-base text-blue-900 font-medium group-hover:text-gray-900 transition-colors">
                    Secure & private
                  </span>
                </div>
              </div>
            </div>

            {/* Right Content - Compact App Mockup */}
            <div className="relative animate-slide-in-right">
              <div className="relative bg-gradient-to-br from-blue-200 to-teal-200 rounded-2xl p-4 sm:p-6 shadow-2xl animate-float-gentle max-w-md mx-auto">
                {/* Browser Window Mockup - Smaller */}
                <div className="bg-white rounded-xl shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-500">
                  {/* Browser Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-teal-600 px-3 sm:px-4 py-2 sm:py-3">
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
                          <p className="text-sm sm:text-base font-bold text-green-700 animate-number-count">₹12,000</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg transform hover:scale-102 transition-all duration-300 animate-slide-in-up animation-delay-200">
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-gray-900">Group Dinner</h4>
                          <p className="text-xs text-gray-500">Paid by Alex</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm sm:text-base font-bold text-green-700 animate-number-count">₹3,500</p>
                        </div>
                      </div>
                    </div>

                    {/* Balance Summary - Compact */}
                    <div className="bg-blue-50 rounded-lg p-2 sm:p-3 animate-slide-in-up animation-delay-400 transform hover:scale-102 transition-all duration-300">
                      <h4 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">You owe Sarah</h4>
                      <p className="text-xs text-blue-800 mb-1">From hotel split</p>
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-700 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
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
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-700 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <span className="text-2xl sm:text-3xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">Add Expenses</h3>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-sm mx-auto">
                Log shared expenses as they happen. Upload receipts, add notes, and choose how to split the cost.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-700 to-teal-700 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
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
              Built for real groups, with modern features and seamless experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                title: "Group Management",
                desc: "Add only registered users, manage members, and control group access as the owner.",
                delay: "",
              },
              {
                icon: Calculator,
                title: "Smart Equal Splitting",
                desc: "Expenses are split equally among all group members, with clear balance and settlement logic.",
                delay: "animation-delay-100",
              },
              {
                icon: Receipt,
                title: "Payment Proof Uploads",
                desc: "Upload payment screenshots to Cloudinary for secure, fast, and easy settlement tracking.",
                delay: "animation-delay-200",
              },
              {
                icon: TrendingUp,
                title: "Real-time Group Chat",
                desc: "Chat with group members instantly, with a modern WhatsApp-style interface.",
                delay: "animation-delay-300",
              },
              {
                icon: CreditCard,
                title: "PDF Export & Reports",
                desc: "Export group data, expenses, and settlements as a beautiful PDF summary.",
                delay: "animation-delay-400",
              },
              {
                icon: CheckCircle,
                title: "Modern UI & Firebase Security",
                desc: "Built with Next.js, Firebase Auth, and Firestore for a secure, seamless, and beautiful experience.",
                delay: "animation-delay-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className={`p-6 sm:p-8 border-0 shadow-lg hover:shadow-xl transition-all duration-500 bg-white transform hover:scale-105 animate-fade-in-up ${feature.delay} group`}
              >
                <CardContent className="text-center space-y-3 sm:space-y-4">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-700 to-green-700 rounded-2xl flex items-center justify-center mx-auto group-hover:rotate-12 transition-transform duration-300">
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
          <div className="text-center bg-gradient-to-r from-blue-700 to-green-700 rounded-3xl p-8 sm:p-16 text-white relative overflow-hidden animate-fade-in-up">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-700 to-green-700 animate-gradient-shift"></div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-5xl lg:text-4xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in">
                Ready to simplify your shared expenses?
              </h2>
              <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-90 max-w-4xl mx-auto leading-relaxed animate-fade-in-delayed">
                Join thousands of users who trust BillSplitr to manage their group finances. Start tracking and
                splitting expenses today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 animate-fade-in-delayed-2">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-blue-700 hover:bg-gray-100 px-8 sm:px-10 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px]"
                  onClick={() => {
                    if (authLoading) return;
                    if (user) {
                      router.push("/dashboard");
                    } else {
                      router.push("/register");
                    }
                  }}
                  disabled={authLoading}
                >
                  {authLoading ? "Loading..." : (
                    <>
                      Get Started Free
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </div>

              <p className="text-base sm:text-lg opacity-90 animate-fade-in-delayed-3 text-white">
                No credit card required • Free forever plan available
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
    </div>
  )
}
