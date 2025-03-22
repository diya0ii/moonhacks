"use client"

import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MemberListProps {
  members: {
    id: string
    name: string
    role: string
    joinedAt: string
  }[]
  onRemove: (id: string) => void
}

export function MemberList({ members, onRemove }: MemberListProps) {
  return (
    <div className="space-y-2">
      {members.map((member) => (
        <div key={member.id} className="flex items-center justify-between rounded-md border p-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{member.name}</span>
              {member.role === "Leader" && (
                <Badge variant="outline" className="border-primary text-primary">
                  Leader
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500">Joined: {member.joinedAt}</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500 hover:text-red-500"
            onClick={() => onRemove(member.id)}
            disabled={member.role === "Leader"}
            title={member.role === "Leader" ? "Cannot remove leader" : "Remove member"}
          >
            <Trash className="h-4 w-4" />
            <span className="sr-only">Remove member</span>
          </Button>
        </div>
      ))}
    </div>
  )
}

