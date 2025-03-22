"use client"

import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function Home() {
  // In a real app, we would check the user's role from the session
  // For demo purposes, we'll provide buttons to navigate to different dashboards

  const navigateToDashboard = (role: string) => {
    if (role === "admin") {
      redirect("/admin")
    } else if (role === "leader") {
      redirect("/leader")
    } else if (role === "member") {
      redirect("/member")
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">College Club Management</h1>
          <p className="mt-2 text-gray-600">Select your role to continue</p>
        </div>

        <div className="mt-8 space-y-4">
          <Button className="w-full bg-primary hover:bg-primary/90" onClick={() => navigateToDashboard("admin")}>
            College Admin
          </Button>

          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => navigateToDashboard("leader")}>
            Club Leader
          </Button>

          <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => navigateToDashboard("member")}>
            Club Member
          </Button>
        </div>
      </div>
    </div>
  )
}

