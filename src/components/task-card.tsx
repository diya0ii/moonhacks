"use client"

import { CheckCircle, Clock, X } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    assignedTo: string
    deadline: string
    status: string
    submittedAt: string | null
  }
  onApprove: () => void
  onReject: () => void
}

export function TaskCard({ task, onApprove, onReject }: TaskCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="border-yellow-500 text-yellow-500">
            Pending
          </Badge>
        )
      case "completed":
        return (
          <Badge variant="outline" className="border-green-500 text-green-500">
            Completed
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "completed":
        return "bg-blue-500"
      case "approved":
        return "bg-green-500"
      case "rejected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 w-full ${getStatusColor(task.status)}`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="line-clamp-1">{task.title}</CardTitle>
          {getStatusBadge(task.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{task.description}</p>
        <div className="space-y-2 text-sm">
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Assigned to: {task.assignedTo}</span>
          </div>
          <div className="flex items-center text-gray-500">
            <Clock className="mr-2 h-4 w-4" />
            <span>Deadline: {task.deadline}</span>
          </div>
          {task.submittedAt && (
            <div className="flex items-center text-gray-500">
              <CheckCircle className="mr-2 h-4 w-4" />
              <span>Submitted: {task.submittedAt}</span>
            </div>
          )}
        </div>
      </CardContent>

      {task.status === "completed" && (
        <CardFooter className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="w-full gap-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600"
            onClick={onApprove}
          >
            <CheckCircle className="h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="outline"
            className="w-full gap-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={onReject}
          >
            <X className="h-4 w-4" />
            Reject
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

