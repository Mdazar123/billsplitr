"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Receipt, Edit, Save } from "lucide-react"
import { useState, useEffect } from "react"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { auth, db } from "@/lib/firebase"
import { onAuthStateChanged } from "firebase/auth"

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
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-sm border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex items-center justify-center mb-4">
                <Avatar className="h-24 w-24 bg-blue-600">
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-bold">
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
                  <Button onClick={() => setIsEditing(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button onClick={handleSave}>
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
                    <p className="text-2xl font-bold text-blue-600">5</p>
                    <p className="text-sm text-gray-600">Active Groups</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹12,450</p>
                    <p className="text-sm text-gray-600">Total Expenses</p>
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
