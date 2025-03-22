"use client"

import { CalendarDays, Users } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ClubCardProps {
  club: {
    id: string
    name: string
    description: string
    leader: string
    memberCount: number
    createdAt: string
  }
  onClick: () => void
}

export function ClubCard({ club, onClick }: ClubCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="h-2 bg-primary" />
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1">{club.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{club.description}</p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-500">
            <Users className="mr-2 h-4 w-4" />
            <span>{club.memberCount} members</span>
          </div>
          <div className="flex items-center text-gray-500">
            <CalendarDays className="mr-2 h-4 w-4" />
            <span>Created on {club.createdAt}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full" onClick={onClick}>
          Manage Club
        </Button>
      </CardFooter>
    </Card>
  )
}

