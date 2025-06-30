"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Receipt, Edit, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Settings as SettingsIcon } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    joinedDate: "",
  })
  const [userId, setUserId] = useState<string | null>(null)
  const [authUser, setAuthUser] = useState<any>(null)
  const [userStats, setUserStats] = useState({
    activeGroups: 0,
    totalExpenses: 0,
    totalOwed: 0,
    totalOwedToYou: 0,
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid)
        setAuthUser(user)
        setProfile((prev) => ({ ...prev, email: user.email || "" }))
      } else {
        setUserId(null)
        setAuthUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (!userId) return
    const fetchProfile = async () => {
      const docRef = doc(db, "users", userId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProfile((prev) => ({ ...prev, ...docSnap.data() }))
      } else if (authUser) {
        // If no profile, use auth data
        setProfile((prev) => ({
          ...prev,
          name: authUser.displayName || "",
          email: authUser.email || "",
          joinedDate: authUser.metadata?.creationTime?.split("T")[0] || "",
        }))
      }
    }
    fetchProfile()
  }, [userId, authUser])

  useEffect(() => {
    if (!userId) return
    const fetchUserStats = async () => {
      try {
        // Get all groups where user is a member
        const groupsSnap = await getDocs(collection(db, "groups"))
        const allGroups = groupsSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        
        let activeGroups = 0
        let totalExpenses = 0
        let totalOwed = 0
        let totalOwedToYou = 0

        for (const group of allGroups) {
          // Check if user is a member of this group
          const membersSnap = await getDocs(collection(db, "groups", group.id, "members"))
          const members = membersSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
          
          if (members.some((m: any) => m.id === userId)) {
            activeGroups++
            
            // Get expenses for this group
            const expensesSnap = await getDocs(collection(db, "groups", group.id, "expenses"))
            const expenses = expensesSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[]
            
            const groupTotalExpenses = expenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0)
            totalExpenses += groupTotalExpenses
            
            // Calculate user's balance in this group
            const perPerson = members.length > 0 ? Math.round(groupTotalExpenses / members.length) : 0
            const userPaid = expenses.filter(
              (exp: any) => 
                exp.paidById === userId || 
                exp.paidBy === (members.find((m: any) => m.id === userId)?.name) || 
                exp.paidByEmail === (members.find((m: any) => m.id === userId)?.email)
            ).reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0)
            
            const userBalance = userPaid - perPerson
            
            if (userBalance < 0) {
              totalOwed += Math.abs(userBalance)
            } else if (userBalance > 0) {
              totalOwedToYou += userBalance
            }
          }
        }

        setUserStats({
          activeGroups,
          totalExpenses,
          totalOwed,
          totalOwedToYou,
        })
      } catch (error) {
        console.error("Error fetching user stats:", error)
      }
    }
    
    fetchUserStats()
  }, [userId])

  const handleSave = async () => {
    if (!userId) return
    // Set joinedDate if missing
    let joinedDate = profile.joinedDate
    if (!joinedDate && authUser?.metadata?.creationTime) {
      joinedDate = authUser.metadata.creationTime.split("T")[0]
    }
    await setDoc(doc(db, "users", userId), { ...profile, joinedDate }, { merge: true })
    setProfile((prev) => ({ ...prev, joinedDate }))
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      

      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <Avatar className="h-24 w-24 bg-gradient-to-r from-blue-600 to-green-500">
                  <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-500 text-white text-2xl font-bold">
                    {profile.name
                      ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase()
                      : (profile.email || "?").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl">My Profile</CardTitle>
              <p className="text-gray-600">Manage your account information</p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex justify-end">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} className="bg-gradient-to-r from-blue-700 to-green-600 text-white font-bold">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile.name || authUser?.displayName || ""}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email || authUser?.email || ""}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className={!isEditing ? "bg-gray-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <Input value={profile.joinedDate} disabled className="bg-gray-50" />
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{userStats.activeGroups}</p>
                    <p className="text-sm text-gray-600">Active Groups</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹{userStats.totalExpenses.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">₹{userStats.totalOwed.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">You Owe</p>
                  </div>
                  <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <p className="text-2xl font-bold text-emerald-600">₹{userStats.totalOwedToYou.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">Owed to You</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
