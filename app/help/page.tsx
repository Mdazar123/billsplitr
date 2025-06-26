"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Receipt, Search, MessageCircle, Book, Mail } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new group?",
      answer: "Click the 'Create Group' button on your dashboard, enter a group name, and invite members by email.",
    },
    {
      question: "How are expenses split?",
      answer: "By default, expenses are split equally among all group members. You can also choose custom splits.",
    },
    {
      question: "Can I upload receipts?",
      answer: "Yes! You can upload receipt photos when adding expenses to keep track of your spending.",
    },
    {
      question: "How do I settle up with someone?",
      answer: "Go to your group, click 'Settle Up', and mark payments as complete when money is transferred.",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Receipt className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BillSplitr</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-gray-600">Find answers to common questions or get in touch</p>
          </div>

          {/* Search */}
          <Card className="bg-white shadow-sm border-0 mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search for help..." className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Quick Actions */}
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Get help from our support team</p>
                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="text-center">
                <Book className="h-12 w-12 text-green-600 mx-auto mb-2" />
                <CardTitle>User Guide</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Learn how to use BillSplitr</p>
                <Button variant="outline" className="w-full">
                  View Guide
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="text-center">
                <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <CardTitle>Community</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 mb-4">Join our user community</p>
                <Button variant="outline" className="w-full">
                  Join Forum
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQs */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
