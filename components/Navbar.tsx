"use client"

import Link from "next/link"
import { Receipt } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u))
    return () => unsubscribe()
  }, [])
  const userProfile = user ? { name: user.displayName, email: user.email } : null

  return (
    <header className="bg-white/80 border-b border-gray-200/60 backdrop-blur-md shadow-sm fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 focus:outline-none">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Receipt className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-bold text-gray-900">BillSplitr</span>
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="cursor-pointer">
                    <Avatar className="h-10 w-10 bg-gradient-to-r from-blue-600 to-green-500">
                      <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold text-lg flex items-center justify-center">
                        {userProfile?.name
                          ? userProfile.name.split(" ").map((n: string) => n[0]).join("").toUpperCase()
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
                    <Link href="/about" className="w-full">About</Link>
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
            ) : (
              <div className="flex items-center gap-2 sm:gap-3">
                <Link href="/login">
                  <button className="text-gray-700 font-medium px-3 py-2 rounded hover:text-blue-700 transition-colors text-sm sm:text-base bg-transparent">Login</button>
                </Link>
                <Link href="/register">
                  <button className="bg-gradient-to-r from-blue-700 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-semibold px-4 py-2 rounded-lg shadow text-sm sm:text-base transition-all duration-300">Get Started</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
} 