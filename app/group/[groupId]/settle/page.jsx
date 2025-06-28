"use client"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function SettleUpPage() {
  const params = useParams()
  const groupId = params.groupId
  const [members, setMembers] = useState([])
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!groupId) return
    getDocs(collection(db, "groups", groupId, "members")).then((snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    getDocs(collection(db, "groups", groupId, "expenses")).then((snapshot) => {
      setExpenses(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
      setLoading(false)
    })
  }, [groupId])

  // Compute member stats from expenses
  const membersWithStats = members.map((member) => {
    const payments = expenses.filter(
      (expense) =>
        expense.paidById === member.id ||
        expense.paidBy === member.name ||
        expense.paidByEmail === member.email
    )
    const totalPaid = payments.reduce((sum, exp) => sum + (exp.amount || 0), 0)
    let totalOwed = 0
    expenses.forEach((expense) => {
      const splitBetween = expense.splitBetween || members.map((m) => m.name)
      if (splitBetween.includes(member.name)) {
        totalOwed += (expense.amount || 0) / splitBetween.length
      }
    })
    const balance = Math.round(totalPaid - totalOwed)
    return {
      ...member,
      payments,
      totalPaid,
      totalOwed: Math.round(totalOwed),
      balance,
    }
  })

  // Compute minimal transactions to settle balances
  function getSettlementTransactions(members) {
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-xl bg-white rounded-lg shadow p-6">
        <Link href={`/group/${groupId}`}>
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Group
          </Button>
        </Link>
        <h1 className="text-2xl font-bold mb-4">Settle Up</h1>
        {settlementTransactions.length > 0 ? (
          <div>
            <h2 className="font-semibold text-lg mb-2">Who owes whom</h2>
            <ul className="space-y-2">
              {settlementTransactions.map((t, idx) => (
                <li key={idx} className="text-base text-gray-700">
                  <span className="font-semibold text-red-600">{t.from}</span> pays <span className="font-semibold text-green-600">{t.to}</span> <span className="font-semibold">₹{t.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-green-700 font-semibold">All settled up! 🎉</div>
        )}
      </div>
    </div>
  )
}
