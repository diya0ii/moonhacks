"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Users, User, LogIn, UserPlus } from "lucide-react"

// Define TypeScript interfaces
interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
}

// Update the JoinedEvent interface to include role
interface JoinedEvent extends Event {
  studentName: string
  studentYear: string
  role: "Attendee" | "Participant" | "Speaker"
}

export default function UserComponent() {
  // Sample events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Tech Conference 2023",
      description: "A conference for tech enthusiasts and professionals",
      date: "2023-11-15",
      location: "Main Auditorium",
    },
    {
      id: "2",
      title: "Hackathon",
      description: "24-hour coding competition for students",
      date: "2023-11-20",
      location: "Computer Science Building",
    },
    {
      id: "3",
      title: "Career Fair",
      description: "Meet potential employers and explore job opportunities",
      date: "2023-12-05",
      location: "Student Center",
    },
    {
      id: "4",
      title: "Workshop: AI Basics",
      description: "Learn the fundamentals of artificial intelligence",
      date: "2023-12-10",
      location: "Room 101",
    },
    {
      id: "5",
      title: "End of Semester Party",
      description: "Celebrate the end of the semester with food and music",
      date: "2023-12-20",
      location: "Campus Lawn",
    },
  ])

  // State for joined events
  const [joinedEvents, setJoinedEvents] = useState<JoinedEvent[]>([])

  // State for active tab
  const [activeTab, setActiveTab] = useState<"events" | "myEvents">("events")

  // State for selected event (for joining)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  // Form state
  const [studentName, setStudentName] = useState("")
  // Add a role state and credits state after the studentYear state
  const [studentYear, setStudentYear] = useState("")
  const [role, setRole] = useState<"Attendee" | "Participant" | "Speaker">("Attendee")
  const [credits, setCredits] = useState(0)

  // Handle joining an event
  const handleJoinEvent = (event: Event) => {
    setSelectedEvent(event)
  }

  // Update the handleSubmit function to include role and add credits
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedEvent && studentName && studentYear) {
      const joinedEvent: JoinedEvent = {
        ...selectedEvent,
        studentName,
        studentYear,
        role,
      }

      // Add credits based on role
      let creditsToAdd = 0
      if (role === "Attendee") creditsToAdd = 5
      else if (role === "Participant") creditsToAdd = 10
      else if (role === "Speaker") creditsToAdd = 50

      setCredits((prevCredits) => prevCredits + creditsToAdd)
      setJoinedEvents([...joinedEvents, joinedEvent])
      setSelectedEvent(null)
      setStudentName("")
      setStudentYear("")
      setRole("Attendee")
    }
  }

  // Update the handleCancel function to reset role
  const handleCancel = () => {
    setSelectedEvent(null)
    setStudentName("")
    setStudentYear("")
    setRole("Attendee")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Update the navbar to include the credits button - replace the existing nav div */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-gray-800">EventHub</div>
          <div className="flex space-x-4 items-center">
            <div className="flex items-center text-purple-600 font-medium mr-4">
              <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full">{credits} Credits</span>
            </div>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <LogIn className="h-4 w-4 mr-1" />
              Login
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              <UserPlus className="h-4 w-4 mr-1" />
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 px-6">
        <button
          className={`py-4 px-6 flex items-center ${
            activeTab === "events"
              ? "border-b-2 border-purple-400 text-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("events")}
        >
          <Calendar className="h-4 w-4 mr-2" />
          All Events
        </button>
        <button
          className={`py-4 px-6 flex items-center ${
            activeTab === "myEvents"
              ? "border-b-2 border-purple-400 text-purple-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
          onClick={() => setActiveTab("myEvents")}
        >
          <User className="h-4 w-4 mr-2" />
          Your Events
        </button>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {activeTab === "events" ? (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-purple-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="flex items-center text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date}
                    </div>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Users className="h-4 w-4 mr-2" />
                      {event.location}
                    </div>
                    {/* Update the event card to always show the Join Event button - replace the group relative div */}
                    <div className="mt-4">
                      <button
                        onClick={() => handleJoinEvent(event)}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md transition-colors duration-300"
                      >
                        Join Event
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Events</h1>
            {joinedEvents.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">You haven't joined any events yet.</p>
                <button
                  onClick={() => setActiveTab("events")}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-md"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {joinedEvents.map((event) => (
                  <div key={event.id} className="bg-purple-50 rounded-lg overflow-hidden shadow-md">
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-800 mb-2">{event.title}</h2>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      <div className="flex items-center text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-gray-500 mb-2">
                        <Users className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-500">Registered as:</p>
                        <p className="font-medium">{event.studentName}</p>
                        {/* Update the joined events display to show the role - add this after the Year line */}
                        <p className="text-sm text-gray-500">Year: {event.studentYear}</p>
                        <p className="text-sm text-gray-500">
                          Role: <span className="font-medium">{event.role}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Credits earned:
                          <span className="font-medium ml-1">
                            {event.role === "Attendee" ? "5" : event.role === "Participant" ? "10" : "50"}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Join Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Join {selectedEvent.title}</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    id="year"
                    value={studentYear}
                    onChange={(e) => setStudentYear(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
                {/* Add the role dropdown to the form - add this before the flex justify-end div */}
                <div className="mb-6">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                    Join as
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value as "Attendee" | "Participant" | "Speaker")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="Attendee">Attendee (5 credits)</option>
                    <option value="Participant">Participant (10 credits)</option>
                    <option value="Speaker">Speaker (50 credits)</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md">
                    Join Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}