"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PlusCircle, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AdminNavbar } from "@/components/admin-navbar"
import { ClubCard } from "@/components/club-card"

// Mock data for clubs
const initialClubs = [
  {
    id: "1",
    name: "Programming Club",
    description: "A club for programming enthusiasts to collaborate and learn together.",
    leader: "John Doe",
    memberCount: 15,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "Debate Society",
    description: "Platform for students to develop public speaking and critical thinking skills.",
    leader: "Jane Smith",
    memberCount: 20,
    createdAt: "2023-02-10",
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [clubs, setClubs] = useState(initialClubs)
  const [newClub, setNewClub] = useState({ name: "", description: "", leader: "" })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState("")

  const handleCreateClub = () => {
    // Validate inputs
    if (!newClub.name || !newClub.description || !newClub.leader) {
      setError("All fields are required")
      return
    }

    // Check for duplicate club names
    if (clubs.some((club) => club.name.toLowerCase() === newClub.name.toLowerCase())) {
      setError("A club with this name already exists")
      return
    }

    // Create new club
    const club = {
      id: (clubs.length + 1).toString(),
      name: newClub.name,
      description: newClub.description,
      leader: newClub.leader,
      memberCount: 1, // Starting with the leader
      createdAt: new Date().toISOString().split("T")[0],
    }

    setClubs([...clubs, club])
    setNewClub({ name: "", description: "", leader: "" })
    setError("")
    setIsDialogOpen(false)
  }

  const handleClubClick = (clubId: string) => {
    router.push(`/admin/clubs/${clubId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="container mx-auto p-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage all college clubs from one place</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create New Club
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Club</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new club. You'll need to assign a leader.
                </DialogDescription>
              </DialogHeader>

              {error && <p className="text-sm font-medium text-red-500">{error}</p>}

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="club-name">Club Name</Label>
                  <Input
                    id="club-name"
                    value={newClub.name}
                    onChange={(e) => setNewClub({ ...newClub, name: e.target.value })}
                    placeholder="e.g., Programming Club"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="club-description">Description</Label>
                  <Textarea
                    id="club-description"
                    value={newClub.description}
                    onChange={(e) => setNewClub({ ...newClub, description: e.target.value })}
                    placeholder="Describe the club's purpose and activities"
                    rows={3}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="club-leader">Club Leader</Label>
                  <Input
                    id="club-leader"
                    value={newClub.leader}
                    onChange={(e) => setNewClub({ ...newClub, leader: e.target.value })}
                    placeholder="Full name of the club leader"
                  />
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateClub}>Create Club</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Club Overview</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-primary">{clubs.length}</CardTitle>
                <CardDescription>Total Clubs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="mr-2 h-4 w-4" />
                  Active organizations
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-purple-600">
                  {clubs.reduce((sum, club) => sum + club.memberCount, 0)}
                </CardTitle>
                <CardDescription>Total Members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="mr-2 h-4 w-4" />
                  Across all clubs
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold text-cyan-600">
                  {clubs.length > 0
                    ? (clubs.reduce((sum, club) => sum + club.memberCount, 0) / clubs.length).toFixed(1)
                    : 0}
                </CardTitle>
                <CardDescription>Avg. Members per Club</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-gray-500">
                  <Settings className="mr-2 h-4 w-4" />
                  Member distribution
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">All Clubs</h2>

          {clubs.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <p className="mb-4 text-center text-gray-500">No clubs have been created yet</p>
                <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Your First Club
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {clubs.map((club) => (
                <ClubCard key={club.id} club={club} onClick={() => handleClubClick(club.id)} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

