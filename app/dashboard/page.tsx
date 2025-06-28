"use client"

import { useState, useEffect } from "react"
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
import { Plus, Clock, Receipt, Settings, ArrowRight, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { collection, addDoc, query, where, onSnapshot, getDocs, Timestamp, doc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

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
  userId: string
  createdAt: Timestamp
}

function formatRelativeTime(date: Date | string | number) {
  const now = new Date()
  let d: Date
  if (typeof date === 'string' && !isNaN(Date.parse(date))) d = new Date(date)
  else if (typeof date === 'number') d = new Date(date)
  else if (date instanceof Date) d = date
  else return ''
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? 's' : ''} ago`
  if (diff < 2592000) return `${Math.floor(diff / 86400)} day${Math.floor(diff / 86400) > 1 ? 's' : ''} ago`
  return d.toLocaleDateString()
}

export default function Dashboard() {
  const [groups, setGroups] = useState<Group[]>([])
  const [newGroupName, setNewGroupName] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        setUserProfile({
          name: user.displayName || "",
          email: user.email || "",
        })
      } else {
        setUserId(null)
        setUserProfile(null)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    // Real-time listener for all groups
    const unsubscribe = onSnapshot(collection(db, "groups"), async (groupSnapshot) => {
      const allGroups = groupSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      const userGroups: Group[] = []
      await Promise.all(
        allGroups.map(async (group) => {
          // Check if user is a member
          const membersSnap = await getDocs(collection(db, "groups", group.id, "members"))
          const members = membersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
          if (members.some((m: any) => m.id === userId)) {
            // Fetch expenses
            const expensesSnap = await getDocs(collection(db, "groups", group.id, "expenses"))
            const expenses = expensesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
            const totalExpenses = expenses.reduce((sum, exp: any) => sum + (exp as any).amount || 0, 0)
            const perPerson = members.length > 0 ? Math.round(totalExpenses / members.length) : 0
            // Calculate user's total paid
            const totalPaid = expenses.filter(
              (exp: any) => (exp as any).paidById === userId || (exp as any).paidBy === (members.find((m: any) => m.id === userId)?.name) || (exp as any).paidByEmail === (members.find((m: any) => m.id === userId)?.email)
            ).reduce((sum, exp: any) => sum + (exp as any).amount || 0, 0)
            const yourBalance = totalPaid - perPerson
            // Recent expenses (last 2 by date)
            const sortedExpenses = expenses
              .filter(e => e.date && e.title)
              .sort((a, b) => (b.date?.seconds || 0) - (a.date?.seconds || 0));
            const recentExpenses = sortedExpenses.slice(0, 2).map(exp => ({
              title: exp.title,
              paidBy: exp.paidBy || "Unknown",
              amount: exp.amount || 0,
            }));
            userGroups.push({
              ...(group as any),
              name: (group as any).name,
              members: members.length,
              totalExpenses,
              yourBalance,
              lastActivity: (group as any).lastActivity || "",
              avatar: (group as any).avatar || "",
              status: (group as any).status || "active",
              recentExpenses,
              userId: (group as any).userId,
              createdAt: (group as any).createdAt,
              id: group.id,
            })
          }
        })
      )
      setGroups(userGroups)
      setLoading(false)
    })
    return () => unsubscribe()
  }, [userId])

  const createGroup = async () => {
    if (!newGroupName.trim() || !userId) return
    const newGroup: Omit<Group, "id"> = {
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
      userId,
      createdAt: Timestamp.now(),
    }
    const groupRef = await addDoc(collection(db, "groups"), newGroup)
    // Add creator as member
    const userDoc = await getDocs(collection(db, "users"));
    const userProfile = userDoc.docs.find(doc => doc.id === userId)?.data();
    await setDoc(doc(db, "groups", groupRef.id, "members", userId), {
      id: userId,
      name: userProfile?.name || auth.currentUser?.displayName || auth.currentUser?.email || "Unknown",
      email: auth.currentUser?.email || "",
    })
    setNewGroupName("")
    setIsCreateDialogOpen(false)
    setTimeout(() => window.location.reload(), 500);
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
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      ) : (
      <>
      {/* Header */}
      {/* <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <Link href="/" className="flex items-center gap-2 sm:gap-3 focus:outline-none">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <Receipt className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-gray-900">BillSplitr</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-600 to-green-500">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold text-lg flex items-center justify-center">
                        {userProfile?.name
                          ? userProfile.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                          : (userProfile?.email || "?").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="w-full">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="w-full">View Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="w-full">Help & Support</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/" className="w-full">Sign Out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header> */}

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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 lg:gap-8 lg:px-12">
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
                      <p className="text-xs sm:text-sm text-gray-200">{group.members} members</p>
                    </div>
                    <Badge className={`${getStatusColor(group.status)} text-xs border-0`}>{group.status}</Badge>
                  </div>
                </div>

                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Recent Expenses */}
                  {group.recentExpenses.length > 0 && (
                    <div className="space-y-3 sm:space-y-4">
                      {group.recentExpenses.map((expense, index) => (
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
                      <span className="text-xs sm:text-sm">
                        {group.createdAt?.seconds
                          ? `Created on: ${new Date(group.createdAt.seconds * 1000).toLocaleDateString()}`
                          : ""}
                      </span>
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

          {groups.length === 0 && !loading && (
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
      </>) }
    </div>
  )
}
