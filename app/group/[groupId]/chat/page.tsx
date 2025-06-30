"use client"
import { useParams } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { collection, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import { db, auth } from "@/lib/firebase"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"

export default function GroupChatPage() {
  const params = useParams()
  const groupId = params.groupId as string
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [members, setMembers] = useState<any[]>([])
  const user = typeof window !== "undefined" ? auth.currentUser : null
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!groupId) return
    // Fetch members for name lookup
    getDocs(collection(db, "groups", groupId, "members")).then((snapshot) => {
      setMembers(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    // Listen for chat messages
    const messagesRef = collection(db, "groups", groupId, "messages")
    const unsubscribe = onSnapshot(messagesRef, (snapshot) => {
      setChatMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
    })
    return () => unsubscribe()
  }, [groupId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chatMessages])

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

  // Helper to get display name from senderId
  const getDisplayName = (senderId: string, fallback: string) => {
    const member = members.find((m: any) => m.id === senderId)
    return member?.name || member?.email || fallback || "Unknown"
  }

  function getDateLabel(date: Date) {
    const now = new Date();
    const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = (today.getTime() - msgDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return msgDate.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  }

  // Helper to get the date (midnight) from a timestamp
  function getDateFromTimestamp(ts: any): Date | null {
    if (!ts?.seconds) return null;
    const d = new Date(ts.seconds * 1000);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#e6effc]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link href={`/group/${groupId}`}>
            <Button variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900 truncate">Group Chat</h1>
        </div>
      </header>
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-0 py-4 max-w-2xl w-full mx-auto">
        <div className="flex flex-col gap-3">
          {chatMessages.length === 0 && <div className="text-gray-400 text-center mt-8">No messages yet</div>}
          {chatMessages
            .sort((a, b) => (a.timestamp?.seconds || 0) - (b.timestamp?.seconds || 0))
            .map((msg, idx, arr) => {
              const isMe = user && msg.senderId === user.uid
              const displayName = getDisplayName(msg.senderId, msg.senderName)
              // Show avatar if first message or previous message is from a different user
              const showAvatar = idx === 0 || arr[idx - 1].senderId !== msg.senderId
              // Date separator logic
              const msgDate = getDateFromTimestamp(msg.timestamp)
              const prevMsgDate = idx === 0 ? null : getDateFromTimestamp(arr[idx - 1].timestamp)
              const showDateSeparator = idx === 0 || (msgDate && prevMsgDate && msgDate.getTime() !== prevMsgDate.getTime())
              return (
                <>
                  {showDateSeparator && msgDate && (
                    <div className="w-full flex justify-center my-2">
                      <span className="bg-white/80 text-gray-500 text-xs px-4 py-1 rounded-full shadow-sm border border-gray-200">
                        {getDateLabel(msgDate)}
                      </span>
                    </div>
                  )}
                  <div key={msg.id} className={`flex w-full ${isMe ? "justify-end" : "justify-start"} items-start mb-2`}> 
                    {/* Incoming message: avatar on left, white bubble */}
                    {!isMe && (
                      <div className={`hidden sm:block ${showAvatar ? '' : 'invisible'} mr-2`}>
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-gradient-to-r from-blue-700 to-green-600 text-white font-semibold text-2xl flex items-center justify-center">
                            {displayName?.split(" ").map((n: string) => n[0]).join("") || "?"}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className={`max-w-[70%] ${isMe ? "ml-auto" : ""}`}> 
                      <div className={`rounded-2xl px-5 py-3 shadow-md whitespace-pre-line ${isMe ? "bg-gradient-to-r from-[#b6e6ea] to-[#d2f6ef] text-gray-900 rounded-br-2xl text-right" : "bg-white text-gray-900 border border-gray-200 rounded-bl-2xl"}`} style={{minWidth: 80}}>
                        {!isMe && (
                          <div className="font-semibold mb-1 text-xs text-[#075e54] opacity-90">{displayName}</div>
                        )}
                        <div className="break-words text-base">{msg.text}</div>
                        <div className="text-[10px] opacity-60 mt-1 text-right font-mono">{msg.timestamp?.seconds ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                      </div>
                    </div>
                    {/* Outgoing message: no avatar */}
                    {isMe && <div className="w-12 hidden sm:block" />} 
                  </div>
                </>
              )
            })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input Bar */}
      <form onSubmit={handleSendMessage} className="sticky bottom-0 bg-transparent pt-4 pb-2 px-2 sm:px-0 max-w-2xl w-full mx-auto">
        <div className="relative flex items-center">
          <Input
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 rounded-full bg-white border border-gray-200 shadow px-5 py-6 pr-14 text-base"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow transition disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  )
} 