"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function AdminNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 py-4">
                <Link href="/admin" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/admin/settings" className="text-lg font-medium" onClick={() => setIsOpen(false)}>
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>

          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">College Admin</span>
          </Link>

          <nav className="hidden md:flex md:gap-6">
            <Link href="/admin" className="text-sm font-medium text-gray-900 transition-colors hover:text-primary">
              Dashboard
            </Link>
            <Link
              href="/admin/settings"
              className="text-sm font-medium text-gray-500 transition-colors hover:text-primary"
            >
              
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Admin Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/">Sign out</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

