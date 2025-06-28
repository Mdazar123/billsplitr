"use client"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { db, storage, auth } from "@/lib/firebase"
import { addDoc, collection, Timestamp, getDocs, doc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { uploadToCloudinary } from "@/lib/cloudinary"

export default function AddExpensePage() {
  const router = useRouter()
  const params = useParams()
  const groupId = params.groupId as string

  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showWaitMessage, setShowWaitMessage] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const user = typeof window !== "undefined" ? auth.currentUser : null
  const [category, setCategory] = useState("")

  useEffect(() => {
    if (!groupId) return
    getDocs(collection(db, "groups", groupId, "members")).then((snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
  }, [groupId])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setShowWaitMessage(false)
    let proofUrl = ""
    const waitTimeout = setTimeout(() => setShowWaitMessage(true), 10000)
    try {
      if (file) {
        console.log("Uploading file to Cloudinary...")
        proofUrl = await uploadToCloudinary(file)
        console.log("File uploaded to Cloudinary.")
      }
      // Fetch user's name from Firestore
      let payerName = ""
      let payerEmail = user?.email || ""
      if (user?.uid) {
        const userDoc = await getDoc(doc(db, "users", user.uid))
        if (userDoc.exists()) {
          payerName = userDoc.data().name || payerEmail || "Unknown"
        } else {
          payerName = payerEmail || "Unknown"
        }
      } else {
        payerName = payerEmail || "Unknown"
      }
      await addDoc(collection(db, "groups", groupId, "expenses"), {
        title,
        amount: Number(amount),
        paidBy: payerName,
        paidById: user?.uid || "",
        name: payerName,
        paidByEmail: payerEmail,
        category,
        splitBetween: members.map((m: any) => m.name),
        proofUrl,
        date: Timestamp.now(),
      })
      clearTimeout(waitTimeout)
      setIsLoading(false)
      setShowWaitMessage(false)
      console.log("Successfully added expense to Firestore.")
      router.push(`/group/${groupId}`)
    } catch (err: any) {
      clearTimeout(waitTimeout)
      setIsLoading(false)
      setShowWaitMessage(false)
      setError(err.message || "Failed to add expense.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md">
        <div className="bg-white shadow-2xl border-0 mx-2 sm:mx-0 rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 px-4 sm:px-8 py-6 sm:py-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4 text-center">Add Expense</h2>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={e => setTitle(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={e => setAmount(e.target.value)} required />
            </div>
            <div>
              <Label>Paid By</Label>
              <Input value={user?.displayName || user?.email || ""} disabled readOnly />
            </div>
            <div>
              <Label htmlFor="proof">Payment Proof (optional)</Label>
              <Input id="proof" type="file" accept="image/*,application/pdf" onChange={handleFileChange} />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="block w-full mt-1 rounded border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="" disabled>Select a category</option>
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Shopping">Shopping</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Utilities">Utilities</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button
              type="submit"
              className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white font-medium transition-all duration-300 text-sm sm:text-base mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Expense"}
            </Button>
            {showWaitMessage && (
              <p className="text-blue-600 text-sm mt-2">Uploading is taking longer than usual. Please wait...</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
