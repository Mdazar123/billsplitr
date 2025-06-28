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
import { useEffect, useState, useRef } from "react"
import { doc, getDoc, collection, onSnapshot, getDocs, setDoc, deleteDoc, Timestamp, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { auth } from "@/lib/firebase"
import { Input } from "@/components/ui/input"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function GroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string

  const [group, setGroup] = useState<any>(null)
  const [members, setMembers] = useState<any[]>([])
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [imageModalUrl, setImageModalUrl] = useState<string | null>(null)
  const [allUsers, setAllUsers] = useState<any[]>([])
  const user = typeof window !== "undefined" ? auth.currentUser : null
  const [searchTerm, setSearchTerm] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showRenameModal, setShowRenameModal] = useState(false)
  const [showAdminOnlyModal, setShowAdminOnlyModal] = useState(false)
  const [renameValue, setRenameValue] = useState("")
  const [showExporting, setShowExporting] = useState(false)

  useEffect(() => {
    if (!groupId) return

    // Fetch group document
    getDoc(doc(db, "groups", groupId)).then((docSnap) => {
      if (docSnap.exists()) setGroup({ id: docSnap.id, ...docSnap.data() })
      setLoading(false)
    })

    // Fetch all registered users
    getDocs(collection(db, "users")).then((snapshot) => {
      setAllUsers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    // Fetch members subcollection
    getDocs(collection(db, "groups", groupId, "members")).then(async (snapshot) => {
      const fetchedMembers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setMembers(fetchedMembers)
      // Add current user as member if not present
      if (user && !fetchedMembers.some((m) => m.id === user.uid)) {
        const newMember = {
          id: user.uid,
          name: user.displayName || user.email || "Unknown",
          email: user.email || "",
        }
        await setDoc(doc(db, "groups", groupId, "members", user.uid), newMember)
        setMembers([...fetchedMembers, newMember])
      }
    })

    // Listen for expenses in this group
    const expensesRef = collection(db, "groups", groupId, "expenses")
    const unsubscribe = onSnapshot(expensesRef, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    // Listen for chat messages
    const messagesRef = collection(db, "groups", groupId, "messages")
    const unsubscribeMessages = onSnapshot(messagesRef, (snapshot) => {
      setChatMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })

    return () => {
      unsubscribe()
      unsubscribeMessages()
    }
  }, [groupId])

  // Calculate total expenses and per person share
  const totalExpenses = expenses.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0)
  const perPerson = members.length > 0 ? Math.round(totalExpenses / members.length) : 0

  // Compute member stats from expenses (equal split among all members)
  const membersWithStats = members.map((member: any) => {
    // Find all expenses paid by this member
    const payments = expenses.filter(
      (expense: any) =>
        expense.paidById === member.id ||
        expense.paidBy === member.name ||
        expense.paidByEmail === member.email
    )
    // Total paid by this member
    const totalPaid = payments.reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0)
    // Share of expenses is always perPerson (equal split)
    const shareOfExpenses = perPerson
    // Net balance
    const balance = Math.round(totalPaid - shareOfExpenses)
    return {
      ...member,
      payments,
      totalPaid,
      totalOwed: shareOfExpenses,
      balance,
    }
  })

  // Compute minimal transactions to settle balances
  function getSettlementTransactions(members: any[]) {
    // Clone and sort members by balance
    const balances = members.map(m => ({ name: m.name, balance: m.balance })).filter(m => m.balance !== 0)
    const debtors = [...balances].filter(m => m.balance < 0).sort((a, b) => a.balance - b.balance)
    const creditors = [...balances].filter(m => m.balance > 0).sort((a, b) => b.balance - a.balance)
    const transactions = []
    let i = 0, j = 0
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i]
      const creditor = creditors[j]
      const amount = Math.min(-debtor.balance, creditor.balance)
      if (amount > 0) {
        transactions.push({ from: debtor.name, to: creditor.name, amount })
        debtor.balance += amount
        creditor.balance -= amount
      }
      if (debtor.balance === 0) i++
      if (creditor.balance === 0) j++
    }
    return transactions
  }
  const settlementTransactions = getSettlementTransactions(membersWithStats)

  // Add member handler
  const handleAddMember = async (userId: string) => {
    const userToAdd = allUsers.find((u) => u.id === userId)
    if (!userToAdd) return
    await setDoc(doc(db, "groups", groupId, "members", userToAdd.id), {
      id: userToAdd.id,
      name: userToAdd.name || userToAdd.email || "Unknown",
      email: userToAdd.email || "",
    })
    setMembers((prev) => [...prev, {
      id: userToAdd.id,
      name: userToAdd.name || userToAdd.email || "Unknown",
      email: userToAdd.email || "",
    }])
  }

  // Remove member handler
  const handleRemoveMember = async (userId: string) => {
    if (!groupId || !userId) return
    await deleteDoc(doc(db, "groups", groupId, "members", userId))
    setMembers((prev) => prev.filter((m) => m.id !== userId))
  }

  // Send a new chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return
    await addDoc(collection(db, "groups", groupId, "messages"), {
      text: newMessage,
      senderId: user.uid,
      senderName: user.displayName || user.email || "Unknown",
      timestamp: serverTimestamp(),
    })
    setNewMessage("")
  }

  // Handler for Rename Group
  const handleRenameGroup = async () => {
    if (!renameValue.trim()) return
    await setDoc(doc(db, "groups", groupId), { ...group, name: renameValue.trim() })
    setGroup((g: any) => ({ ...g, name: renameValue.trim() }))
    setShowRenameModal(false)
  }

  // Handler for Export Group Data as PDF
  const handleExportPDF = async () => {
    setShowExporting(true)
    const doc = new jsPDF()
    // Logo (top right, dynamic position)
    const logoImg = await fetch("/images/image.png").then(r => r.blob()).then(blob => new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.readAsDataURL(blob)
    }))
    // Header
    doc.setFontSize(28)
    doc.setTextColor(41, 98, 255)
    doc.setFont('helvetica', 'bold')
    const groupName = `Group Name : ${group.name || ''}`
    // Calculate width of group name text
    const groupNameWidth = doc.getTextWidth(groupName)
    // Place logo at least 20 units to the right of group name, or at 170 if short
    const logoX = Math.max(170, 20 + groupNameWidth + 10)
    doc.text(groupName, 14, 32, { maxWidth: 140 })
    // Draw a white background for the logo for clarity
    doc.setFillColor(255,255,255)
    doc.roundedRect(logoX - 2, 10, 36, 36, 6, 6, 'F')
    doc.addImage(logoImg as string, "PNG", logoX, 12, 32, 32)

    // Info box content
    doc.setFontSize(13)
    doc.setTextColor(80,80,80)
    doc.setFont('helvetica', 'normal')
    const infoLines = [
      `Created by: ${members.find(m => m.id === group.userId)?.name || "Unknown"}`,
      `Group ID: ${group.id || "-"} | Created: ${group.createdAt ? new Date(group.createdAt.seconds*1000).toLocaleDateString() : "-"}`,
      `Members: ${members.map(m => m.name).join(", ")}`
    ]
    // Wrap long member list
    const wrappedInfoLines: string[] = []
    infoLines.forEach(line => {
      const split = doc.splitTextToSize(line, 175)
      wrappedInfoLines.push(...split)
    })
    const infoBoxHeight = 10 + wrappedInfoLines.length * 9
    // Add extra top margin if logo is lower
    const infoBoxY = 48
    doc.setFillColor(243,244,246)
    doc.roundedRect(12, infoBoxY, 185, infoBoxHeight, 16, 16, 'F')
    let infoY = infoBoxY + 12
    wrappedInfoLines.forEach(line => {
      doc.text(line, 18, infoY)
      infoY += 9
    })

    // Expenses Table
    const tableStartY = infoBoxY + infoBoxHeight + 12
    const expenseRows = expenses.map((exp: any, i: number) => [
      (i+1).toString(),
      exp.title || "No title",
      exp.amount >= 0 ? { content: `+${exp.amount.toLocaleString()}`, styles: { textColor: [34,197,94], fontStyle: 'bold' } } : { content: `-${Math.abs(exp.amount).toLocaleString()}`, styles: { textColor: [239,68,68], fontStyle: 'bold' } },
      exp.name || "Unknown",
      exp.date ? new Date(exp.date.seconds*1000).toLocaleDateString() : "-",
      exp.splitBetween ? (Array.isArray(exp.splitBetween) ? exp.splitBetween.join(", ") : exp.splitBetween) : "-",
      exp.proofUrl ? "Yes" : "-"
    ])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    autoTable(doc, {
      startY: tableStartY,
      head: [["#", "Title", "Amount", "Paid By", "Date", "Split Between", "Proof"]],
      body: expenseRows,
      theme: 'grid',
      headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: 'bold', fontSize: 12 },
      styles: { fontSize: 11, cellPadding: 2, font: 'helvetica' },
      alternateRowStyles: { fillColor: [248,250,252] },
      margin: { left: 12, right: 12 },
      tableLineColor: [203,213,225],
      tableLineWidth: 0.2,
    })

    // Balances Table
    let y = (doc as any).lastAutoTable.finalY + 12
    doc.setFontSize(15)
    doc.setTextColor(41, 98, 255)
    doc.setFont('helvetica', 'bold')
    doc.text("Balances", 14, y)
    const balanceRows = membersWithStats.map((m: any) => [
      m.name,
      m.totalPaid.toLocaleString(),
      m.totalOwed.toLocaleString(),
      m.balance > 0 ? { content: `+${m.balance.toLocaleString()}`, styles: { textColor: [34,197,94], fontStyle: 'bold' } } : m.balance < 0 ? { content: `-${Math.abs(m.balance).toLocaleString()}`, styles: { textColor: [239,68,68], fontStyle: 'bold' } } : { content: `0`, styles: { textColor: [55,65,81], fontStyle: 'bold' } }
    ])
    doc.setFontSize(11)
    doc.setFont('helvetica', 'normal')
    autoTable(doc, {
      startY: y + 4,
      head: [["Name", "Paid", "Owes", "Net"]],
      body: balanceRows,
      theme: 'grid',
      headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: 'bold', fontSize: 12 },
      styles: { fontSize: 11, cellPadding: 2, font: 'helvetica' },
      alternateRowStyles: { fillColor: [248,250,252] },
      margin: { left: 12, right: 12 },
      tableLineColor: [203,213,225],
      tableLineWidth: 0.2,
    })

    // Settlement Transactions
    y = (doc as any).lastAutoTable.finalY + 12
    if (settlementTransactions && settlementTransactions.length > 0) {
      doc.setFontSize(15)
      doc.setTextColor(41, 98, 255)
      doc.setFont('helvetica', 'bold')
      doc.text("Settlement Transactions", 14, y)
      const settleRows = settlementTransactions.map((t: any) => [
        t.from,
        t.to,
        { content: t.amount.toLocaleString(), styles: { textColor: [41,98,255], fontStyle: 'bold' } }
      ])
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      autoTable(doc, {
        startY: y + 4,
        head: [["From", "To", "Amount"]],
        body: settleRows,
        theme: 'grid',
        headStyles: { fillColor: [34,197,94], textColor: 255, fontStyle: 'bold', fontSize: 12 },
        styles: { fontSize: 11, cellPadding: 2, font: 'helvetica' },
        alternateRowStyles: { fillColor: [248,250,252] },
        margin: { left: 12, right: 12 },
        tableLineColor: [203,213,225],
        tableLineWidth: 0.2,
      })
      y = (doc as any).lastAutoTable.finalY + 12
    }

    // Footer
    doc.setFontSize(11)
    doc.setTextColor(180, 180, 180)
    doc.setFont('helvetica', 'normal')
    doc.text("Generated by BillSplittr", 105, 292, { align: "center" })

    doc.save(`${group.name || "group"}-billsplitr.pdf`)
    setShowExporting(false)
  }

  if (loading || !group) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

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
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{group.name || "Group"}</h1>
                <p className="text-xs sm:text-sm text-gray-600">{group.members || 0} members</p>
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{members.length}</p>
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalExpenses.toLocaleString()}</p>
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
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{perPerson.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="members" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-5 h-auto">
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
            <TabsTrigger value="chat" className="text-xs sm:text-sm px-2 sm:px-4 py-2">
              Chat
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
                  {membersWithStats.map((member: any) => (
                    <div
                      key={member.id}
                      className="bg-gradient-to-r from-gray-50 to-blue-50/30 border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8"
                    >
                      {/* Member Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <Avatar className="h-12 w-12 sm:h-16 sm:w-16 ring-4 ring-white shadow-lg">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold text-xl flex items-center justify-center">
                              {(member?.name ? member.name.split(" ").map((n: string) => n[0]).join("") : "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate">{member?.name || "Unknown"}</h3>
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
                              ₹{member.totalPaid?.toLocaleString() || 0}
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
                              ₹{member.totalOwed?.toLocaleString() || 0}
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
                              {member.balance > 0 ? "+" : ""}₹{member.balance?.toLocaleString() || 0}
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
                          {Array.isArray(member?.payments) && member.payments.length > 0 && (
                            <Badge
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm"
                            >
                              {member.payments.length} payment{member.payments.length !== 1 ? "s" : ""}
                            </Badge>
                          )}
                        </div>

                        {Array.isArray(member?.payments) && member.payments.length > 0 ? (
                          <div className="space-y-3">
                            {member.payments.map((payment: any) => (
                              <div
                                key={payment.id}
                                className="flex flex-row items-center p-2 sm:p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg gap-x-3 sm:gap-x-4"
                              >
                                {/* Icon on the left */}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100/60 rounded-full flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                                </div>
                                {/* Middle: Amount, date, status */}
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                  <p className="text-xl sm:text-2xl font-bold text-green-600">₹{payment?.amount ? payment.amount.toLocaleString() : "0"}</p>
                                  <span className="text-xs sm:text-sm text-gray-600 flex items-center gap-1 mt-1 mb-1">
                                    <Clock className="h-3 w-3" />
                                    {payment?.date ? new Date(payment.date.seconds * 1000).toLocaleDateString() : "No date"}
                                  </span>
                                  <p className="text-sm sm:text-base text-gray-500 font-medium">Payment confirmed</p>
                                </div>
                                {/* Proof button on the right */}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`w-8 h-8 sm:w-10 sm:h-10 p-0 rounded-full ml-2 flex-shrink-0 ${payment.proofUrl ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer' : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'}`}
                                  onClick={() => payment.proofUrl && setImageModalUrl(payment.proofUrl)}
                                  disabled={!payment.proofUrl}
                                  aria-label="View payment proof"
                                >
                                  <ImageIcon className={`h-4 w-4 ${payment.proofUrl ? 'text-blue-600' : 'text-gray-400'}`} />
                                </Button>
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
                  {expenses.map((expense: any) => {
                    // Mock data for missing fields
                    const category = expense.category || "Accommodation";
                    let paidBy = members.find((m: any) => m.id === expense.paidById)?.name;
                    if (!paidBy) {
                      if (expense.paidBy && typeof expense.paidBy === 'string' && expense.paidBy.includes('@')) {
                        // Try to find member by email
                        paidBy = members.find((m: any) => m.email === expense.paidBy)?.name;
                      } else if (expense.paidBy && typeof expense.paidBy === 'string') {
                        paidBy = expense.paidBy;
                      }
                    }
                    if (!paidBy) paidBy = "Unknown";
                    const splitBetween = (expense.splitBetween && expense.splitBetween.length > 0
                      ? expense.splitBetween
                      : members.map((m: any) => m.name || "Unknown")
                    );
                    const paidById = expense.paidById || null;
                    const date = expense.date ? new Date(expense.date.seconds * 1000) : null;
                    const amount = expense.amount || 0;
                    const perPerson = splitBetween && splitBetween.length > 0 ? Math.round(amount / splitBetween.length) : amount;
                    return (
                      <div key={expense.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white border rounded-xl shadow-sm p-4 sm:p-6">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-lg sm:text-xl text-gray-900">{expense.title || "No title"}</span>
                            <Badge variant="outline" className="text-xs sm:text-sm font-semibold px-2 py-1 ml-2">{category}</Badge>
                            <Button variant="ghost" size="icon" className="ml-1 p-1 h-7 w-7" onClick={() => expense.proofUrl && setImageModalUrl(expense.proofUrl)}>
                              <ImageIcon className="h-4 w-4 text-blue-600" />
                            </Button>
                          </div>
                          <div className="text-sm sm:text-base text-gray-700 mb-1">
                            Paid by <span className="font-semibold">{paidBy}</span>
                            {date && ` on ${date.toISOString().slice(0, 10)}`}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-500 mb-1">
                            Split between {splitBetween.length} people: {splitBetween.map((name: string) => name || "Unknown").join(", ")}
                          </div>
                        </div>
                        <div className="flex flex-col items-end min-w-[100px] mt-4 sm:mt-0">
                          <span className="font-bold text-2xl sm:text-3xl text-gray-900">₹{amount.toLocaleString()}</span>
                          <span className="text-xs sm:text-sm text-gray-500 mt-1">₹{perPerson.toLocaleString()} per person</span>
                        </div>
                      </div>
                    );
                  })}
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
                {/* Who Owes Whom Summary */}
                {settlementTransactions.length > 0 ? (
                  <div className="mb-6">
                    <h4 className="font-semibold text-base sm:text-lg mb-2">Settlement Summary</h4>
                    <ul className="space-y-1">
                      {settlementTransactions.map((t, idx) => (
                        <li key={idx} className="text-sm sm:text-base text-gray-700">
                          <span className="font-semibold text-red-600">{t.from}</span> pays <span className="font-semibold text-green-600">{t.to}</span> <span className="font-semibold">₹{t.amount.toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="mb-6 text-green-700 font-semibold">All settled up! 🎉</div>
                )}
                <div className="space-y-4">
                  {membersWithStats.map((member: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                            <AvatarFallback className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold text-base flex items-center justify-center">
                              {(member?.name ? member.name.split(" ").map((n: string) => n[0]).join("") : "?")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-semibold text-sm sm:text-base">{member?.name || "Unknown"}</span>
                        </div>
                        <div className={`font-bold text-base sm:text-lg ${member?.balance > 0 ? "text-green-600" : member?.balance < 0 ? "text-red-600" : "text-gray-600"}`}>
                          {member?.balance > 0 ? "+" : ""}₹{Math.abs(member?.balance ?? 0).toLocaleString()}
                        </div>
                      </div>

                      {member?.balance === 0 && <p className="text-xs sm:text-sm text-gray-600">All settled up! 🎉</p>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-lg font-semibold mb-2">Group Chat is now a dedicated page!</p>
              <p className="text-gray-500 mb-4">Click below to open the WhatsApp-style chat experience.</p>
              <Link href={`/group/${groupId}/chat`}>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 text-white font-bold shadow">Open Group Chat</Button>
              </Link>
            </div>
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
                  {/* Add New Member (only for owner) */}
                  {group?.userId === user?.uid && (
                    <div className="relative">
                      <label className="block mb-2 font-medium">Add New Member</label>
                      <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Search users by name..."
                        value={searchTerm}
                        onChange={e => {
                          setSearchTerm(e.target.value)
                          setShowSuggestions(true)
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                        className="mb-2"
                      />
                      {showSuggestions && searchTerm && (
                        <ul className="absolute z-10 bg-white border rounded w-full max-h-48 overflow-y-auto shadow">
                          {allUsers
                            .filter(u =>
                              !members.some(m => m.id === u.id) &&
                              u.name &&
                              u.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map(u => (
                              <li
                                key={u.id}
                                className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                                onMouseDown={() => {
                                  handleAddMember(u.id)
                                  setSearchTerm("")
                                  setShowSuggestions(false)
                                  inputRef.current?.blur()
                                }}
                              >
                                {u.name}
                              </li>
                            ))}
                          {allUsers.filter(u => !members.some(m => m.id === u.id) && u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                            <li className="px-4 py-2 text-gray-400">No users found</li>
                          )}
                        </ul>
                      )}
                    </div>
                  )}
                  {/* List of Members */}
                  <div>
                    <label className="block mb-2 font-medium">Current Members</label>
                    <ul className="space-y-2">
                      {members.map((member: any) => (
                        <li key={member.id} className="flex items-center justify-between bg-gray-50 rounded p-2">
                          <span>{member.name}</span>
                          {group?.userId === user?.uid && member.id !== user?.uid && (
                            <Button variant="destructive" size="sm" onClick={() => handleRemoveMember(member.id)}>
                              Remove
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={() => {
                    if (group?.userId === user?.uid) setShowRenameModal(true)
                    else setShowAdminOnlyModal(true)
                  }}>
                    Rename Group
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base" onClick={handleExportPDF} disabled={showExporting}>
                    {showExporting ? "Exporting..." : "Export Group Data"}
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

      {/* Image Modal - always available */}
      {imageModalUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={() => setImageModalUrl(null)}>
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-1 sm:p-4 max-w-full max-h-full relative" onClick={e => e.stopPropagation()}>
            {/* Close X button */}
            <button
              onClick={() => setImageModalUrl(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 z-10"
              aria-label="Close"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={imageModalUrl} alt="Payment Proof" className="max-w-[90vw] max-h-[80vh] rounded" />
          </div>
        </div>
      )}

      {/* Rename Modal */}
      {showRenameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Rename Group</h2>
            <input
              className="w-full border rounded p-2 mb-4"
              value={renameValue}
              onChange={e => setRenameValue(e.target.value)}
              placeholder="Enter new group name"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowRenameModal(false)}>Cancel</Button>
              <Button onClick={handleRenameGroup} disabled={!renameValue.trim()}>Save</Button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Only Modal */}
      {showAdminOnlyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 max-w-sm w-full relative" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-2">Only the group admin can rename the group</h2>
            <div className="flex gap-2 justify-end mt-4">
              <Button onClick={() => setShowAdminOnlyModal(false)}>OK</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
