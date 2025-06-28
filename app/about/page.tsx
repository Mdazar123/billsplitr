"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Receipt } from "lucide-react"
import { useEffect, useState } from "react"
import { auth } from "@/lib/firebase"

export default function AboutUsPage() {
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u))
    return () => unsubscribe()
  }, [])
  const userProfile = user ? { name: user.displayName, email: user.email } : null

  return (
    <div className="min-h-screen bg-[#f5f9ff] flex flex-col items-center py-10 px-2">
      {/* Header/Navbar (copied from dashboard) */}

      {/* About Us Content */}
      <div className="flex flex-col items-center py-10 px-2">
        <div className="max-w-3xl w-full mx-auto text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-2 text-gray-900 font-sans">About Us</h1>
          <p className="text-lg sm:text-xl text-gray-600 mb-4 font-medium font-sans">Our Journey So Far</p>
          <p className="text-lg sm:text-xl text-gray-700 mb-6 font-normal font-sans">
            We're <span className="font-bold text-blue-700">Nilesh and Azhar</span> — two friends, collaborators, and tech explorers driven by curiosity and a shared goal: to build meaningful, impactful solutions.
          </p>
          <div className="bg-white rounded-2xl shadow p-6 sm:p-8 text-left mx-auto">
            <h2 className="text-2xl font-bold mb-3 text-gray-900 font-sans">What We've Accomplished Together:</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 font-sans text-lg sm:text-xl">
              <li>
                Built <span className="font-semibold text-blue-700">BillSplitr</span>: a modern bill-splitting app for groups, friends, and families.
              </li>
              <li>
                Selected for the globally recognized <span className="font-semibold text-blue-700">RiseUp with ServiceNow</span> program, choosing only ~100 students from India for hands-on industry training and leadership development.
              </li>
              <li>
                Built <span className="font-semibold text-blue-700">EcoLabel</span>: an AI-powered solution encouraging eco-conscious decisions through smart product labeling.
              </li>
              <li>
                Developed <span className="font-semibold text-blue-700">ConsentLens</span>: a privacy-first platform for managing digital consent with transparency.
              </li>
              <li>
                Began exploring <span className="font-semibold text-blue-700">Generative AI and Machine Learning</span>, building real-world applications while continuously learning and leveling up.
              </li>
            </ul>
            <p className="mt-3 text-lg sm:text-xl text-gray-700 font-normal font-sans">
              Together, we're on a mission to craft solutions that blend innovation, ethics, and impact — and this is just the beginning.
            </p>
          </div>
        </div>

        <div className="max-w-4xl w-full mx-auto">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 font-sans">Meet the Creators</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            {/* Azhar Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full md:w-1/2 max-w-md">
              <img
                src="/images/azhar.jpeg"
                alt="MD. Azhar"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-200 mb-4 shadow"
              />
              <h3 className="text-2xl font-bold mb-1 text-gray-900 uppercase tracking-wide font-sans">MD. AZHAR</h3>
              <div className="flex gap-4 mb-2">
                <Link href="https://www.linkedin.com/in/azarmohammad/" className="text-blue-700 hover:underline font-medium font-sans">LinkedIn</Link>
                <Link href="https://github.com/Mdazar123" className="text-blue-700 hover:underline font-medium font-sans">GitHub</Link>
              </div>
              <p className="text-gray-700 text-center font-sans text-lg">
                A dedicated developer with a strong interest in web development, open-source, and practical AI. Azhar enjoys collaborating on innovative projects and learning new technologies to solve real-world problems.
              </p>
            </div>
            {/* Nilesh Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full md:w-1/2 max-w-md">
              <img
                src="/images/nilesh.jpeg"
                alt="E. Nilesh"
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4 shadow"
              />
              <h3 className="text-2xl font-bold mb-1 text-gray-900 uppercase tracking-wide font-sans">E. NILESH</h3>
              <div className="flex gap-4 mb-2">
                <Link href="https://www.linkedin.com/in/enugandhula-nilesh-400a14226" className="text-blue-700 hover:underline font-medium font-sans">LinkedIn</Link>
                <Link href="https://github.com/nileshsn" className="text-blue-700 hover:underline font-medium font-sans">GitHub</Link>
              </div>
              <p className="text-gray-700 text-center font-sans text-lg">
                A passionate full-stack developer and AI enthusiast from India. Nilesh has contributed to open-source, completed GSSoC'24, and loves building smarter web solutions with modern tech stacks and LLMs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
