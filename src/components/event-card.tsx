import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  event: {
    id: string
    title: string
    description: string
    date: string
    location: string
    status: string
  }
}

export function EventCard({ event }: EventCardProps) {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{event.title}</CardTitle>
          {getStatusBadge(event.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">{event.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Date: {event.date}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>Location: {event.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

