"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Plus,
  Users,
  DollarSign,
  Receipt,
  Settings,
  ImageIcon,
  CheckCircle,
  Clock,
  TrendingUp,
} from "lucide-react"

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string

  // Mock data with detailed payment tracking
  const group = {
    id: groupId,
    name: "Goa Trip 2024",
    members: [
      {
        id: "1",
        name: "Alex Johnson",
        email: "alex@example.com",
        totalPaid: 8000,
        totalOwed: 3855,
        balance: 4145, // what they should get back
        payments: [
          {
            id: "p1",
            amount: 8000,
            description: "Hotel Booking",
            date: "2024-01-20",
            proofUrl: "/placeholder.svg?height=200&width=300",
          },
        ],
      },
      {
        id: "2",
        name: "Sarah Chen",
        email: "sarah@example.com",
        totalPaid: 4800,
        totalOwed: 3855,
        balance: 945, // what they should get back
        payments: [
          {
            id: "p2",
            amount: 4800,
            description: "Flight Tickets",
            date: "2024-01-18",
            proofUrl: "/placeholder.svg?height=200&width=300",
          },
        ],
      },
      {
        id: "3",
        name: "Mike Wilson",
        email: "mike@example.com",
        totalPaid: 2620,
        totalOwed: 3855,
        balance: -1235, // what they owe
        payments: [
          {
            id: "p3",
            amount: 2620,
            description: "Dinner at Beach Resort",
            date: "2024-01-21",
            proofUrl: "/placeholder.svg?height=200&width=300",
          },
        ],
      },
      {
        id: "4",
        name: "Emma Davis",
        email: "emma@example.com",
        totalPaid: 0,
        totalOwed: 3855,
        balance: -3855, // what they owe
        payments: [],
      },
    ],
    totalExpenses: 15420,
    createdAt: "2024-01-15",
  }

  const expenses = [
    {
      id: "1",
      title: "Hotel Booking",
      amount: 8000,
      paidBy: "Alex Johnson",
      paidById: "1",
      splitBetween: ["Alex Johnson", "Sarah Chen", "Mike Wilson", "Emma Davis"],
      date: "2024-01-20",
      category: "Accommodation",
      proofUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Flight Tickets",
      amount: 4800,
      paidBy: "Sarah Chen",
      paidById: "2",
      splitBetween: ["Alex Johnson", "Sarah Chen", "Mike Wilson"],
      date: "2024-01-18",
      category: "Transportation",
      proofUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Dinner at Beach Resort",
      amount: 2620,
      paidBy: "Mike Wilson",
      paidById: "3",
      splitBetween: ["Alex Johnson", "Sarah Chen", "Mike Wilson", "Emma Davis"],
      date: "2024-01-21",
      category: "Food",
      proofUrl: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="flex-shrink-0">
                  <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Back to Dashboard</span>
                  <span className="sm:hidden">Back</span>
                </Button>
              </Link>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{group.name}</h1>
                <p className="text-xs sm:text-sm text-gray-600">{group.members.length} members</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link href={`/group/${groupId}/add`}>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-xs sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Add Expense</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </Link>
              <Link href={`/group/${groupId}/settle`}>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                  <span className="hidden sm:inline">Settle Up</span>
                  <span className="sm:hidden">Settle</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Group Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Members</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{group.members.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Total Expenses</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{group.totalExpenses.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-gray-600 font-medium">Per Person</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">
                    ₹{Math.round(group.totalExpenses / group.members.length).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="members" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
            <TabsTrigger value="members" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              <span className="hidden sm:inline">Members & Payments</span>
              <span className="sm:hidden">Members</span>
            </TabsTrigger>
            <TabsTrigger value="expenses" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Expenses
            </TabsTrigger>
            <TabsTrigger value="balances" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Balances
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="space-y-4 sm:space-y-6">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl">Member Payment Details</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  See what each member has paid and their current balance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 sm:space-y-8">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8"
                    >
                      {/* Member Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-4 ring-white shadow-lg">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-sm sm:text-lg">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{member.name}</h3>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{member.email}</p>
                          </div>
                        </div>
                        <div className="text-center sm:text-right">
                          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Current Balance</p>
                          <div
                            className={`inline-flex items-center px-3 sm:px-4 py-1 sm:py-2 rounded-full font-bold text-sm sm:text-lg ${
                              member.balance > 0
                                ? "bg-green-100 text-green-700"
                                : member.balance < 0
                                  ? "bg-red-100 text-red-700"
                                  : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {member.balance > 0
                              ? `Gets ₹${member.balance.toLocaleString()}`
                              : member.balance < 0
                                ? `Owes ₹${Math.abs(member.balance).toLocaleString()}`
                                : "All settled"}
                          </div>
                        </div>
                      </div>

                      {/* Payment Summary Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
                        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                          <div className="text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                              <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Paid</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">
                              ₹{member.totalPaid.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                          <div className="text-center">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                              <Receipt className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Share of Expenses</p>
                            <p className="text-lg sm:text-2xl font-bold text-gray-900">
                              ₹{member.totalOwed.toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
                          <div className="text-center">
                            <div
                              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 ${
                                member.balance > 0 ? "bg-green-100" : member.balance < 0 ? "bg-red-100" : "bg-gray-100"
                              }`}
                            >
                              <TrendingUp
                                className={`h-5 w-5 sm:h-6 sm:w-6 ${
                                  member.balance > 0
                                    ? "text-green-600"
                                    : member.balance < 0
                                      ? "text-red-600"
                                      : "text-gray-600"
                                }`}
                              />
                            </div>
                            <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Net Balance</p>
                            <p
                              className={`text-lg sm:text-2xl font-bold ${
                                member.balance > 0
                                  ? "text-green-600"
                                  : member.balance < 0
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {member.balance > 0 ? "+" : ""}₹{member.balance.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Payment History */}
                      <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                            Payment History
                          </h4>
                          {member.payments.length > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
                            >
                              {member.payments.length} payment{member.payments.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>

                        {member.payments.length > 0 ? (
                          <div className="space-y-3">
                            {member.payments.map((payment) => (
                              <div
                                key={payment.id}
                                className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg"
                              >
                                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                                      {payment.description}
                                    </p>
                                    <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {payment.date}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                                  <div className="text-right">
                                    <p className="text-lg sm:text-xl font-bold text-green-600">
                                      ₹{payment.amount.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500">Payment confirmed</p>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full bg-blue-50 border-blue-200 hover:bg-blue-100"
                                  >
                                    <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                              <Receipt className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium text-sm sm:text-base">No payments made yet</p>
                            <p className="text-xs sm:text-sm text-gray-400 mt-1">Payment history will appear here</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses" className="space-y-4 sm:space-y-6">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">All Expenses</CardTitle>
                    <CardDescription className="text-sm sm:text-base">
                      Complete list of group expenses with payment proofs
                    </CardDescription>
                  </div>
                  <Link href={`/group/${groupId}/add`}>
                    <Button size="sm" className="text-xs sm:text-sm">
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      Add Expense
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3 sm:gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base">{expense.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {expense.category}
                          </Badge>
                          <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 rounded flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors">
                            <ImageIcon className="h-3 w-3 text-blue-600" />
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-1">
                          Paid by <span className="font-medium">{expense.paidBy}</span> on {expense.date}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Split between {expense.splitBetween.length} people: {expense.splitBetween.join(", ")}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg sm:text-xl font-bold">₹{expense.amount.toLocaleString()}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          ₹{Math.round(expense.amount / expense.splitBetween.length)} per person
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="balances" className="space-y-4 sm:space-y-6">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                  <div>
                    <CardTitle className="text-lg sm:text-xl">Group Balances</CardTitle>
                    <CardDescription className="text-sm sm:text-base">Who owes what to whom</CardDescription>
                  </div>
                  <Link href={`/group/${groupId}/settle`}>
                    <Button size="sm" className="text-xs sm:text-sm">
                      Settle Up
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {group.members.map((member, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold text-xs sm:text-sm">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm sm:text-base">{member.name}</span>
                        </div>
                        <div
                          className={`font-bold text-base sm:text-lg ${
                            member.balance > 0
                              ? "text-green-600"
                              : member.balance < 0
                                ? "text-red-600"
                                : "text-gray-600"
                          }`}
                        >
                          {member.balance > 0 ? "+" : ""}₹{Math.abs(member.balance).toLocaleString()}
                        </div>
                      </div>

                      {member.balance === 0 && <p className="text-xs sm:text-sm text-gray-600">All settled up! 🎉</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4 sm:space-y-6">
            <Card className="bg-white shadow-sm border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
                  Group Settings
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">Manage group preferences and members</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                    Add New Member
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                    Rename Group
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                    Export Group Data
                  </Button>
                  <Button variant="destructive" className="w-full justify-start text-sm sm:text-base">
                    Leave Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
