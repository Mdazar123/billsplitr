"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Receipt, Bell, Shield, HelpCircle } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: false,
    expenseReminders: true,
    weeklyReports: false,
  })

  const [privacy, setPrivacy] = useState({
    profileVisibility: true,
    shareExpenseHistory: false,
    allowFriendRequests: true,
  })

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
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
            <p className="text-gray-600">Manage your account preferences</p>
          </div>

          {/* Notifications Settings */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <p className="text-sm text-gray-600">Get instant notifications</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="expense-reminders">Expense Reminders</Label>
                  <p className="text-sm text-gray-600">Remind me about pending expenses</p>
                </div>
                <Switch
                  id="expense-reminders"
                  checked={notifications.expenseReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, expenseReminders: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-gray-600">Get weekly expense summaries</p>
                </div>
                <Switch
                  id="weekly-reports"
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, weeklyReports: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="profile-visibility">Profile Visibility</Label>
                  <p className="text-sm text-gray-600">Allow others to find your profile</p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={privacy.profileVisibility}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisibility: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="share-history">Share Expense History</Label>
                  <p className="text-sm text-gray-600">Allow sharing of expense data</p>
                </div>
                <Switch
                  id="share-history"
                  checked={privacy.shareExpenseHistory}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, shareExpenseHistory: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="friend-requests">Allow Friend Requests</Label>
                  <p className="text-sm text-gray-600">Let others send you friend requests</p>
                </div>
                <Switch
                  id="friend-requests"
                  checked={privacy.allowFriendRequests}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, allowFriendRequests: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Help & Support */}
          <Card className="bg-white shadow-sm border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-purple-600" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="ghost" className="w-full justify-start">
                Frequently Asked Questions
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Contact Support
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Report a Bug
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                Feature Requests
              </Button>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Export My Data
                </Button>
                <Button variant="destructive" className="w-full">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
