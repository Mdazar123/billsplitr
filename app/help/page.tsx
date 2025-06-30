"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Receipt, Search, MessageCircle, Book, Mail, Users, Lock, FileText, CheckCircle, UserCheck, Image as ImageIcon, MessageSquare } from "lucide-react"

export default function HelpPage() {
  const faqs = [
    {
      question: "How do I create a new group?",
      answer: "Go to your dashboard and click 'Create Group'. Enter a group name. You will automatically be added as the group owner and first member.",
    },
    {
      question: "How do I add or remove members from a group?",
      answer: "Only the group owner can add or remove members. To add, search for registered users by name in the group settings. To remove, click the remove button next to a member in the settings tab.",
    },
    {
      question: "Can I add anyone to a group?",
      answer: "No, you can only add users who are already registered on BillSplitr. Use the search in group settings to find and add them.",
    },
    {
      question: "How are expenses split?",
      answer: "Expenses are split equally among all group members by default. When adding an expense, the 'Paid By' field is set to the logged-in user, and the amount is divided equally.",
    },
    {
      question: "How do I upload payment proofs?",
      answer: "When settling up, you can upload a payment screenshot as proof. The image is securely uploaded to Cloudinary and can be viewed by group members.",
    },
    {
      question: "How do I settle up balances?",
      answer: "Go to the 'Balances' tab in your group. You'll see who owes whom. Click 'Mark as Paid' to submit a payment with proof. The group owner can accept payments to settle balances.",
    },
    {
      question: "How does group chat work?",
      answer: "Each group has a dedicated real-time chat page with a modern WhatsApp-style interface. Access it from the group details page.",
    },
    {
      question: "Can I export group data?",
      answer: "Yes! In group settings, use the 'Export Group Data' button to download a PDF summary of expenses, balances, and settlements.",
    },
    {
      question: "How do I manage my profile?",
      answer: "Click your avatar in the navbar and select 'View Profile'. You can see your info, joined date, and initials. (Profile editing coming soon.)",
    },
    {
      question: "How do I reset my password?",
      answer: "On the login page, click 'Forgot Password?' and follow the instructions. You'll receive a password reset email. If you don't see it, check your spam folder.",
    },
    {
      question: "Why do I need to verify my email?",
      answer: "Email verification helps keep your account secure and ensures you receive important notifications. Some features require a verified email.",
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes. BillSplitr uses Firebase Auth and Firestore for secure authentication and data storage. Payment proofs are stored securely on Cloudinary.",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
    

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Help & Support</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">Find answers to common questions, learn how to use BillSplitr, or get in touch with our team. We're here to help you split smarter and settle up with confidence!</p>
          </div>

          {/* Search */}
          {/* <Card className="bg-white shadow-sm border-0 mb-8">
            <CardContent className="p-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input placeholder="Search for help..." className="pl-10" />
              </div>
            </CardContent>
          </Card> */}

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* How BillSplitr Works */}
            <Card className="bg-gradient-to-br from-blue-700 to-green-600 text-white shadow-lg border-0">
              <CardHeader className="text-center">
                <CheckCircle className="h-12 w-12 text-white mx-auto mb-2" />
                <CardTitle>How BillSplitr Works</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white mb-4">Learn about group creation, expense splitting, chat, and settlements.</p>
              </CardContent>
            </Card>

            {/* Security & Privacy */}
            <Card className="bg-gradient-to-br from-blue-700 to-green-600 text-white shadow-lg border-0">
              <CardHeader className="text-center">
                <Lock className="h-12 w-12 text-white mx-auto mb-2" />
                <CardTitle>Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white mb-4">Your data is protected with Firebase Auth, Firestore, and Cloudinary.</p>
              </CardContent>
            </Card>

            {/* Release Notes */}
            <Card className="bg-gradient-to-br from-blue-700 to-green-600 text-white shadow-lg border-0">
              <CardHeader className="text-center">
                <FileText className="h-12 w-12 text-white mx-auto mb-2" />
                <CardTitle>Release Notes</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-white mb-4">See what's new in the latest version of BillSplitr.</p>
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
