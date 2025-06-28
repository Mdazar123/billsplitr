import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import { Receipt } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"
import ConditionalFooter from "@/components/conditionalfooter"
import ConditionalNavbar from "@/components/conditionalnavbar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "BillSplitr - Track Expenses, Settle Smarter",
  description: "Split bills and track expenses with friends, roommates, and groups",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/billspliterfavicon.png" type="image/png" />
      </head>
      <body className={inter.className}>
        <ConditionalNavbar />
        <div className="pt-16">
          {children}
        </div>
        <ConditionalFooter />
      </body>
    </html>
  )
}
