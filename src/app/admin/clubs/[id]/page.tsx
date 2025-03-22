"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Edit, Save, Trash, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { MemberList } from "@/components/member-list"

// Mock data for a specific club
const clubData = {
  id: "1",
  name: "Programming Club",
  description:
    "A club for programming enthusiasts to collaborate and learn together. Members work on projects, participate in hackathons, and share knowledge through workshops and presentations.",
  leader: "John Doe",
  createdAt: "2023-01-15",
  members: [
    { id: "1", name: "John Doe", role: "Leader", joinedAt: "2023-01-15" },
    { id: "2", name: "Alice Johnson", role: "Member", joinedAt: "2023-01-20" },
    { id: "3", name: "Bob Smith", role: "Member", joinedAt: "2023-02-05" },
    { id: "4", name: "Emma Davis", role: "Member", joinedAt: "2023-02-10" },
    { id: "5", name: "Michael Brown", role: "Member", joinedAt: "2023-03-15" },
  ],
}

export default function ClubManagement({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [club, setClub] = useState(clubData)
  const [isEditing, setIsEditing] = useState(false)
  const [editedClub, setEditedClub] = useState(club)
  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false)
  const [newMember, setNewMember] = useState({ name: "", role: "Member" })
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isChangeLeaderDialogOpen, setIsChangeLeaderDialogOpen] = useState(false)
  const [newLeaderId, setNewLeaderId] = useState("")

  const handleSaveChanges = () => {
    setClub(editedClub)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditedClub(club)
    setIsEditing(false)
  }

  const handleAddMember = () => {
    if (!newMember.name) return

    const member = {
      id: (club.members.length + 1).toString(),
      name: newMember.name,
      role: newMember.role,
      joinedAt: new Date().toISOString().split("T")[0],
    }

    setClub({
      ...club,
      members: [...club.members, member],
    })

    setNewMember({ name: "", role: "Member" })
    setIsAddMemberDialogOpen(false)
  }

  const handleRemoveMember = (memberId: string) => {
    // Don't allow removing the leader
    const memberToRemove = club.members.find((m) => m.id === memberId)
    if (memberToRemove?.role === "Leader") {
      alert("Cannot remove the club leader. Assign a new leader first.")
      return
    }

    setClub({
      ...club,
      members: club.members.filter((member) => member.id !== memberId),
    })
  }

  const handleChangeLeader = () => {
    if (!newLeaderId) return

    const updatedMembers = club.members.map((member) => {
      if (member.role === "Leader") {
        return { ...member, role: "Member" }
      }
      if (member.id === newLeaderId) {
        return { ...member, role: "Leader" }
      }
      return member
    })

    setClub({
      ...club,
      leader: club.members.find((m) => m.id === newLeaderId)?.name || club.leader,
      members: updatedMembers,
    })

    setIsChangeLeaderDialogOpen(false)
  }

  const handleDeleteClub = () => {
    // In a real app, we would make an API call to delete the club
    router.push("/admin")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="container mx-auto p-4 py-8">
        <Button variant="ghost" className="mb-6 gap-2" onClick={() => router.push("/admin")}>
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{club.name}</h1>
            <p className="text-gray-600">Club Management</p>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button variant="outline" className="gap-2" onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4" />
                  Edit Club
                </Button>
                <Button variant="destructive" className="gap-2" onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash className="h-4 w-4" />
                  Delete Club
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" className="gap-2" onClick={handleCancelEdit}>
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button className="gap-2" onClick={handleSaveChanges}>
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Club Details</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="club-name">Club Name</Label>
                      <Input
                        id="club-name"
                        value={editedClub.name}
                        onChange={(e) => setEditedClub({ ...editedClub, name: e.target.value })}
                      />
                    </div>

                    <div>
                      <Label htmlFor="club-description">Description</Label>
                      <Textarea
                        id="club-description"
                        value={editedClub.description}
                        onChange={(e) => setEditedClub({ ...editedClub, description: e.target.value })}
                        rows={5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Club Name</h3>
                      <p>{club.name}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Description</h3>
                      <p className="text-sm">{club.description}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Created On</h3>
                      <p>{club.createdAt}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Club Leader</h3>
                      <p>{club.leader}</p>
                      <Button
                        variant="link"
                        className="mt-1 h-auto p-0 text-xs"
                        onClick={() => setIsChangeLeaderDialogOpen(true)}
                      >
                        Change Leader
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Total Members</h3>
                      <p>{club.members.length}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Members</CardTitle>
                <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Member</DialogTitle>
                      <DialogDescription>
                        Enter the details of the new member to add them to the club.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="member-name">Member Name</Label>
                        <Input
                          id="member-name"
                          value={newMember.name}
                          onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                          placeholder="Full name of the member"
                        />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddMemberDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddMember}>Add Member</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <MemberList members={club.members} onRemove={handleRemoveMember} />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Delete Club Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Club</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this club? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteClub}>
              Delete Club
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Leader Dialog */}
      <Dialog open={isChangeLeaderDialogOpen} onOpenChange={setIsChangeLeaderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Club Leader</DialogTitle>
            <DialogDescription>
              Select a new leader for the club. The current leader will become a regular member.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Label htmlFor="new-leader">Select New Leader</Label>
            <select
              id="new-leader"
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
              value={newLeaderId}
              onChange={(e) => setNewLeaderId(e.target.value)}
            >
              <option value="">Select a member</option>
              {club.members
                .filter((member) => member.role !== "Leader")
                .map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
            </select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeLeaderDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleChangeLeader} disabled={!newLeaderId}>
              Change Leader
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

