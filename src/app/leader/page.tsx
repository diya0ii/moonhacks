"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, PlusCircle, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
// import EventChatbotPopup from '@/components/EventChatbotPopup';
import EventChatbotPopup from "@/components/ui/EventChatbotPopup"
import { MessageSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LeaderNavbar } from "@/components/leader-navbar"
import { TaskCard } from "@/components/task-card"
import { EventCardOne , EventCardTwo } from "@/components/event-card"

// Mock data for the club leader dashboard
const clubData = {
  id: "1",
  name: "Programming Club",
  description: "A club for programming enthusiasts to collaborate and learn together.",
  memberCount: 15,
  tasks: [
    {
      id: "1",
      title: "Website Redesign",
      description: "Redesign the club's website with a modern UI",
      assignedTo: "Alice Johnson",
      deadline: "2023-06-15",
      status: "pending",
      submittedAt: null,
    },
    {
      id: "2",
      title: "Workshop Preparation",
      description: "Prepare materials for the upcoming JavaScript workshop",
      assignedTo: "Bob Smith",
      deadline: "2023-06-10",
      status: "completed",
      submittedAt: "2023-06-08",
    },
    {
      id: "3",
      title: "Hackathon Planning",
      description: "Create a plan for the summer hackathon event",
      assignedTo: "Emma Davis",
      deadline: "2023-06-20",
      status: "pending",
      submittedAt: null,
    },
  ],
  events: [
    {
      id: "1",
      title: "JavaScript Workshop",
      description: "Introduction to JavaScript for beginners",
      date: "2023-06-25",
      location: "Computer Lab 101",
      status: "upcoming",
    },
    {
      id: "2",
      title: "Summer Hackathon",
      description: "24-hour coding competition with prizes",
      date: "2023-07-15",
      location: "Student Center",
      status: "upcoming",
    },
  ],
  members: [
    { id: "1", name: "John Doe", role: "Leader", joinedAt: "2023-01-15" },
    { id: "2", name: "Alice Johnson", role: "Member", joinedAt: "2023-01-20" },
    { id: "3", name: "Bob Smith", role: "Member", joinedAt: "2023-02-05" },
    { id: "4", name: "Emma Davis", role: "Member", joinedAt: "2023-02-10" },
    { id: "5", name: "Michael Brown", role: "Member", joinedAt: "2023-03-15" },
  ],
}

export default function LeaderDashboard() {
  const router = useRouter()
  const [showChatbot, setShowChatbot] = useState(false);

  const [club, setClub] = useState(clubData)
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false)
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    deadline: "",
  })
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
  })

  const handleAddTask = () => {
    if (!newTask.title || !newTask.description || !newTask.assignedTo || !newTask.deadline) {
      return
    }

    const task = {
      id: (club.tasks.length + 1).toString(),
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      deadline: newTask.deadline,
      status: "pending",
      submittedAt: null,
    }

    setClub({
      ...club,
      tasks: [...club.tasks, task],
    })

    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      deadline: "",
    })

    setIsAddTaskDialogOpen(false)
  }

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.description || !newEvent.date || !newEvent.location) {
      return
    }

    const event = {
      id: (club.events.length + 1).toString(),
      title: newEvent.title,
      description: newEvent.description,
      date: newEvent.date,
      location: newEvent.location,
      status: "upcoming",
    }

    setClub({
      ...club,
      events: [...club.events, event],
    })

    setNewEvent({
      title: "",
      description: "",
      date: "",
      location: "",
    })

    setIsAddEventDialogOpen(false)
  }

  const handleTaskAction = (taskId: string, action: "approve" | "reject") => {
    const updatedTasks = club.tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          status: action === "approve" ? "approved" : "rejected",
        }
      }
      return task
    })

    setClub({
      ...club,
      tasks: updatedTasks,
    })
  }
  const LeaderDashboard = () => {
    const [showChatbot, setShowChatbot] = useState(false);
    
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Lead Dashboard</h1>
        
        {/* Your existing dashboard content */}
        
        {/* Add a button to open the chatbot */}
        <Button 
          onClick={() => setShowChatbot(true)}
          className="flex items-center gap-2"
        >
          <MessageSquare size={16} />
          Event Planning Assistant
        </Button>

     
        
        {/* Add the chatbot popup component with visibility control */}
        {showChatbot && (
          <EventChatbotPopup onClose={() => setShowChatbot(false)} />
        )}
      </div>
    );
  };
  
  

  return (
    <div className="min-h-screen bg-gray-50">
      <LeaderNavbar clubName={club.name} />

      <main className="container mx-auto p-4 py-8">
        <div className="mb-8 flex">
          <h1 className="text-3xl font-bold text-gray-900">{club.name} Dashboard </h1>
          <Button 
        onClick={() => setShowChatbot(true)} 
        className="flex items-center gap-2 ml-10 mb-20"
      >
        <MessageSquare size={16} />
        Event Planning Assistant
      </Button> 
        </div>
          <p className="text-gray-600">Manage your club, members, tasks, and events</p>

        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-primary">{club.memberCount}</CardTitle>
              <CardDescription>Total Members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="mr-2 h-4 w-4" />
                Active club members
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-purple-600">
                {club.tasks.filter((task) => task.status === "pending").length}
              </CardTitle>
              <CardDescription>Pending Tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="mr-2 h-4 w-4" />
                Awaiting completion
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-cyan-600">
                {club.events.filter((event) => event.status === "upcoming").length}
              </CardTitle>
              <CardDescription>Upcoming Events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 h-4 w-4" />
                Scheduled activities
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Tasks</h2>

            <Dialog open={isAddTaskDialogOpen} onOpenChange={setIsAddTaskDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Assign New Task
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Assign New Task</DialogTitle>
                  <DialogDescription>Create a new task and assign it to a club member.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="task-title">Task Title</Label>
                    <Input
                      id="task-title"
                      value={newTask.title}
                      onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      placeholder="e.g., Website Redesign"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="task-description">Description</Label>
                    <Textarea
                      id="task-description"
                      value={newTask.description}
                      onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                      placeholder="Describe the task in detail"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="task-assignee">Assign To</Label>
                    <select
                      id="task-assignee"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={newTask.assignedTo}
                      onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    >
                      <option value="">Select a member</option>
                      {club.members
                        .filter((member) => member.role !== "Leader")
                        .map((member) => (
                          <option key={member.id} value={member.name}>
                            {member.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="task-deadline">Deadline</Label>
                    <Input
                      id="task-deadline"
                      type="date"
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTaskDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddTask}>Assign Task</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {club.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onApprove={() => handleTaskAction(task.id, "approve")}
                onReject={() => handleTaskAction(task.id, "reject")}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Events</h2>

            <Dialog open={isAddEventDialogOpen} onOpenChange={setIsAddEventDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create New Event
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>Schedule a new event for your club.</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="event-title">Event Title</Label>
                    <Input
                      id="event-title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      placeholder="e.g., JavaScript Workshop"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="event-description">Description</Label>
                    <Textarea
                      id="event-description"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      placeholder="Describe the event"
                      rows={3}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="event-date">Date</Label>
                    <Input
                      id="event-date"
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="event-location">Location</Label>
                    <Input
                      id="event-location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      placeholder="e.g., Computer Lab 101"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddEventDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddEvent}>Create Event</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <EventCardOne />
            <EventCardTwo />
          </div>
         
        </div>
    
    
      </main>

     
     
      
      <EventChatbotPopup 
        isFloating={false} 
        isOpen={showChatbot} 
        onClose={() => setShowChatbot(false)} 
      />
     
      
    </div>


  )
}

