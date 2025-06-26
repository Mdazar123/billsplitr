"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Clock, Receipt, Settings, ArrowRight } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Group {
  id: string
  name: string
  members: number
  totalExpenses: number
  yourBalance: number
  lastActivity: string
  avatar: string
  status: "active" | "pending" | "settled"
  recentExpenses: Array<{
    title: string
    paidBy: string
    amount: number
  }>
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: "1",
      name: "Goa Trip",
      members: 5,
      totalExpenses: 25000,
      yourBalance: -2400,
      lastActivity: "2 hours ago",
      avatar: "GT",
      status: "active",
      recentExpenses: [
        { title: "Hotel Booking", paidBy: "Sarah", amount: 12000 },
        { title: "Group Dinner", paidBy: "Alex", amount: 3500 },
      ],
    },
    {
      id: "2",
      name: "Apartment 4B",
      members: 3,
      totalExpenses: 12000,
      yourBalance: 800,
      lastActivity: "1 day ago",
      avatar: "A4",
      status: "pending",
      recentExpenses: [
        { title: "Electricity Bill", paidBy: "Mike", amount: 4500 },
        { title: "Internet Bill", paidBy: "You", amount: 2000 },
      ],
    },
    {
      id: "3",
      name: "Office Lunch",
      members: 8,
      totalExpenses: 3200,
      yourBalance: 0,
      lastActivity: "3 days ago",
      avatar: "OL",
      status: "settled",
      recentExpenses: [{ title: "Team Lunch", paidBy: "John", amount: 3200 }],
    },
  ])

  const [newGroupName, setNewGroupName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const createGroup = () => {
    if (!newGroupName.trim()) return

    const newGroup: Group = {
      id: Date.now().toString(),
      name: newGroupName,
      members: 1,
      totalExpenses: 0,
      yourBalance: 0,
      lastActivity: "Just now",
      avatar: newGroupName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      status: "active",
      recentExpenses: [],
    }

    setGroups([newGroup, ...groups])
    setNewGroupName("")
    setIsCreateDialogOpen(false)
  }

  const totalYouOwe = groups.reduce((sum, group) => sum + Math.max(0, -group.yourBalance), 0)
  const totalYoureOwed = groups.reduce((sum, group) => sum + Math.max(0, group.yourBalance), 0)
  const activeGroups = groups.filter((group) => group.status === "active").length
  const totalGroups = groups.length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "pending":
        return "bg-yellow-100 text-yellow-700"
      case "settled":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Receipt className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">BillSplitr</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Settings Dropdown - Simplified */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hidden sm:flex text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="w-full">
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="w-full">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown - Simplified */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 hover:bg-gray-100 px-2 sm:px-3 py-2 rounded-lg transition-colors"
                  >
                    <Avatar className="h-6 w-6 sm:h-8 sm:w-8 bg-blue-600">
                      <AvatarFallback className="bg-blue-600 text-white text-xs sm:text-sm font-medium">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">John Doe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">
                      View Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="w-full">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Settings Button - Simplified */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="sm:hidden text-gray-600 hover:text-gray-900">
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Settings</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">
                      Notifications
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="w-full">
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/" className="w-full">
                      Sign Out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4 sm:p-6">
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Total You Owe</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mb-2">₹{totalYouOwe.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Across {groups.filter((g) => g.yourBalance < 0).length} groups
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4 sm:p-6">
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Total You're Owed</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">₹{totalYoureOwed.toLocaleString()}</p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Across {groups.filter((g) => g.yourBalance > 0).length} groups
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border-0">
            <CardContent className="p-4 sm:p-6">
              <div>
                <p className="text-base sm:text-lg font-semibold text-gray-900 mb-1">Active Groups</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2">{activeGroups}</p>
                <p className="text-xs sm:text-sm text-gray-500">Out of {totalGroups} total groups</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Groups Section */}
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Your Groups</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[95vw] max-w-md mx-auto p-4 sm:p-6">
                <DialogHeader className="space-y-2 sm:space-y-3">
                  <DialogTitle className="text-lg sm:text-xl">Create New Group</DialogTitle>
                  <DialogDescription className="text-sm sm:text-base">
                    Start a new expense group with friends, roommates, or colleagues.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="groupName" className="text-sm font-medium">
                      Group Name
                    </Label>
                    <Input
                      id="groupName"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      placeholder="e.g., Weekend Trip, Apartment Bills"
                      className="w-full h-10 sm:h-11 text-sm sm:text-base"
                      autoComplete="off"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                    <Button
                      onClick={createGroup}
                      className="w-full sm:flex-1 h-10 sm:h-11 text-sm sm:text-base"
                      disabled={!newGroupName.trim()}
                    >
                      Create Group
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {groups.map((group) => (
              <Card
                key={group.id}
                className="bg-white shadow-lg border-0 hover:shadow-xl transition-all duration-300 overflow-hidden rounded-2xl"
              >
                {/* Gradient Header */}
                <div className="bg-gradient-to-r from-blue-500 via-blue-400 to-teal-400 p-4 sm:p-6 relative">
                  {/* Browser-like dots */}
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                    <div className="w-2.5 h-2.5 bg-white/30 rounded-full"></div>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{group.name}</h3>
                      <p className="text-white/80 text-sm sm:text-base">{group.members} members</p>
                    </div>
                    <Badge className={`${getStatusColor(group.status)} text-xs border-0`}>{group.status}</Badge>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Recent Expenses */}
                  {group.recentExpenses.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      {group.recentExpenses.slice(0, 2).map((expense, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{expense.title}</h4>
                            <p className="text-gray-500 text-xs sm:text-sm">Paid by {expense.paidBy}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-base sm:text-lg">
                              ₹{expense.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Balance Section */}
                  <div className="bg-blue-50 rounded-xl p-4 sm:p-5">
                    {group.yourBalance < 0 ? (
                      <>
                        <h4 className="font-semibold text-blue-900 text-sm sm:text-base mb-1">
                          You owe {group.recentExpenses.length > 0 ? group.recentExpenses[0].paidBy : "others"}
                        </h4>
                        <p className="text-blue-600 text-xs sm:text-sm mb-2">From recent expenses</p>
                        <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                          ₹{Math.abs(group.yourBalance).toLocaleString()}
                        </p>
                      </>
                    ) : group.yourBalance > 0 ? (
                      <>
                        <h4 className="font-semibold text-green-900 text-sm sm:text-base mb-1">You are owed</h4>
                        <p className="text-green-600 text-xs sm:text-sm mb-2">From group expenses</p>
                        <p className="text-2xl sm:text-3xl font-bold text-green-600">
                          ₹{group.yourBalance.toLocaleString()}
                        </p>
                      </>
                    ) : (
                      <>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">All settled up!</h4>
                        <p className="text-gray-600 text-xs sm:text-sm mb-2">No pending balances</p>
                        <p className="text-2xl sm:text-3xl font-bold text-gray-600">₹0</p>
                      </>
                    )}
                  </div>

                  {/* Group Stats */}
                  <div className="flex justify-between items-center text-sm text-gray-600 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span className="text-xs sm:text-sm">{group.lastActivity}</span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium">
                      ₹{group.totalExpenses.toLocaleString()} total
                    </span>
                  </div>

                  {/* View Details Button */}
                  <Link href={`/group/${group.id}`}>
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm sm:text-base font-medium"
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {groups.length === 0 && (
            <Card className="bg-white shadow-sm border-0">
              <CardContent className="p-8 sm:p-12 text-center">
                <div className="text-4xl sm:text-6xl mb-4">👥</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No groups yet</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-6">
                  Create your first group to start tracking expenses with friends and family.
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Group
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
