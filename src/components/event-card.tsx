import { useState } from "react"
import { Calendar, Clock, MapPin, Video } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    startTime: string
    location: string
    status: string
    imageUrl: string
  }
}

export function EventCard({ event }: EventCardProps) {
  const [showJitsi, setShowJitsi] = useState(false)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "upcoming":
        return (
          <Badge variant="outline" className="border-blue-500 text-blue-500">
            Upcoming
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Completed
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const joinMeeting = () => {
    setShowJitsi(true)
  }

  const closeMeeting = () => {
    setShowJitsi(false)
  }

  return (
    <Card className="transform transition-all duration-300 hover:translate-y-1 hover:shadow-lg bg-white/90 backdrop-blur">
      {/* Event Image */}
      <div className="w-full h-48 overflow-hidden rounded-t-lg">
        <img 
          src={`/public/${event.imageUrl}`} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">{event.title}</CardTitle>
          {getStatusBadge(event.status)}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">{event.description}</p>
        <div className="space-y-2.5 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Date: {event.date}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Start Time: {event.startTime}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <MapPin className="mr-2 h-4 w-4 text-indigo-500" />
            <span>Location: {event.location}</span>
          </div>
          
          {event.status === "upcoming" && !showJitsi && (
            <div className="pt-3">
              <button 
                onClick={joinMeeting}
                className="flex items-center justify-center w-full px-4 py-2 mt-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
              >
                <Video className="mr-2 h-4 w-4" />
                Join Meeting
              </button>
            </div>
          )}
          
          {showJitsi && (
            <div className="mt-4 space-y-4">
              <div className="rounded-md overflow-hidden h-64 w-full">
                <iframe
                  src={`https://meet.jit.si/${event.id}`}
                  allow="camera; microphone; fullscreen; display-capture; autoplay"
                  className="w-full h-full border-0"
                ></iframe>
              </div>
              <button 
                onClick={closeMeeting}
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Leave Meeting
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Example usage with multiple events
export default function EventsGrid() {
  const events = [
    {
      id: "club-meeting-2025-03-22",
      title: "Weekly Club Meeting",
      description: "Join us for our weekly discussion on the latest industry trends and networking.",
      date: "March 22, 2025",
      startTime: "6:30 PM EST",
      location: "Community Center, Room 204",
      status: "upcoming",
      imageUrl: "/one.jpg"
    },
    {
      id: "workshop-2025-03-24",
      title: "Tech Workshop",
      description: "Hands-on workshop exploring new technologies and their applications.",
      date: "March 24, 2025",
      startTime: "2:00 PM EST",
      location: "Innovation Lab",
      status: "upcoming",
      imageUrl: "/two.jpg"
    }
  ]
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 max-w-6xl mx-auto">
      {events.map(event => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}