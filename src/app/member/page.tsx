"use client"

import { useState } from "react"
import { Calendar, CheckCircle, Clock, FileText, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { MemberNavbar } from "@/components/member-navbar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

// Mock data for the member dashboard
const memberData = {
  id: "2",
  name: "Alice Johnson",
  club: {
    id: "1",
    name: "Programming Club",
  },
  tasks: [
    {
      id: "1",
      title: "Website Redesign",
      description: "Redesign the club's website with a modern UI",
      deadline: "2023-06-15",
      status: "pending",
      feedback: null,
    },
    {
      id: "4",
      title: "Create Logo Proposals",
      description: "Design 3 logo proposals for the club rebranding",
      deadline: "2023-06-20",
      status: "pending",
      feedback: null,
    },
    {
      id: "5",
      title: "Documentation Update",
      description: "Update the club's documentation with the latest information",
      deadline: "2023-06-10",
      status: "approved",
      feedback: "Great work! The documentation is now much clearer.",
    },
    {
      id: "6",
      title: "Social Media Graphics",
      description: "Create graphics for the club's social media accounts",
      deadline: "2023-06-05",
      status: "rejected",
      feedback: "The graphics don't match our brand guidelines. Please revise.",
    },
  ],
  upcomingEvents: [
    {
      id: "1",
      title: "JavaScript Workshop",
      date: "2023-06-25",
      location: "Computer Lab 101",
    },
    {
      id: "2",
      title: "Summer Hackathon",
      date: "2023-07-15",
      location: "Student Center",
    },
  ],
}

export default function MemberDashboard() {
  const [member, setMember] = useState(memberData)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [submission, setSubmission] = useState({ content: "" })

  const pendingTasks = member.tasks.filter((task) => task.status === "pending")
  const completedTasks = member.tasks.filter((task) => task.status === "approved" || task.status === "rejected")

  const handleOpenSubmitDialog = (task: any) => {
    setSelectedTask(task)
    setSubmission({ content: "" })
    setIsSubmitDialogOpen(true)
  }

  const handleSubmitTask = () => {
    if (!submission.content) return

    const updatedTasks = member.tasks.map((task) => {
      if (task.id === selectedTask.id) {
        return {
          ...task,
          status: "submitted", // Add a new status for submitted but not yet reviewed
        }
      }
      return task
    })

    setMember({
      ...member,
      tasks: updatedTasks,
    })

    setIsSubmitDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "submitted":
        return "bg-blue-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pending
          </Badge>
        )
      case "submitted":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Submitted
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  // Calculate task completion rate
  const completionRate = Math.round(
    (member.tasks.filter((task) => task.status === "approved").length / member.tasks.length) * 100,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <MemberNavbar memberName={member.name} clubName={member.club.name} />

      <main className="container mx-auto p-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-gray-600">Track your tasks and upcoming events</p>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary">{pendingTasks.length}</CardTitle>
              <CardDescription>Pending Tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                Tasks awaiting completion
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-purple-600">
                {member.tasks.filter((task) => task.status === "approved").length}
              </CardTitle>
              <CardDescription>Completed Tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <CheckCircle className="mr-2 h-4 w-4" />
                Successfully completed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-cyan-600">{member.upcomingEvents.length}</CardTitle>
              <CardDescription>Upcoming Events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                Events to attend
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Completion Progress</CardTitle>
              <CardDescription>Your overall task completion rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Completion Rate</span>
                  <span className="font-medium">{completionRate}%</span>
                </div>
                <Progress value={completionRate} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Pending Tasks</h2>

          {pendingTasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <CheckCircle className="mb-2 h-12 w-12 text-green-500" />
                <p className="text-center text-gray-500">You have no pending tasks</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pendingTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <div className={`h-1 w-full ${getStatusColor(task.status)}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{task.title}</CardTitle>
                      {getStatusBadge(task.status)}
                    </div>
                    <CardDescription>Due: {task.deadline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{task.description}</p>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2" onClick={() => handleOpenSubmitDialog(task)}>
                      <Upload className="h-4 w-4" />
                      Submit Task
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Completed Tasks</h2>

          {completedTasks.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center p-6">
                <FileText className="mb-2 h-12 w-12 text-gray-400" />
                <p className="text-center text-gray-500">No completed tasks yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {completedTasks.map((task) => (
                <Card key={task.id} className="overflow-hidden">
                  <div className={`h-1 w-full ${getStatusColor(task.status)}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{task.title}</CardTitle>
                      {getStatusBadge(task.status)}
                    </div>
                    <CardDescription>Due: {task.deadline}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600">{task.description}</p>

                    {task.feedback && (
                      <div className="mt-4 rounded-md bg-gray-50 p-3">
                        <h4 className="text-xs font-medium text-gray-500">Feedback:</h4>
                        <p className="text-sm">{task.feedback}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Upcoming Events</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {member.upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {event.date}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-4 w-4"
                      >
                        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {event.location}
                    </div>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Submit Task Dialog */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Task: {selectedTask?.title}</DialogTitle>
            <DialogDescription>Provide details about your completed task.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Textarea
              placeholder="Describe what you've done, include links or details about your work..."
              value={submission.content}
              onChange={(e) => setSubmission({ content: e.target.value })}
              rows={5}
              className="resize-none"
            />

            <div className="mt-4">
              <Button variant="outline" className="w-full gap-2 border-dashed" type="button">
                <Upload className="h-4 w-4" />
                Attach Files (Optional)
              </Button>
              <p className="mt-1 text-xs text-gray-500">You can attach files to provide additional context.</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubmitDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitTask} disabled={!submission.content}>
              Submit Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

