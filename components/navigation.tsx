"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import { useState } from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface NavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onCreateJobClick?: () => void
}

export function Navigation({ activeTab, onTabChange, onCreateJobClick }: NavigationProps) {
  const { theme, setTheme } = useTheme()

  const navItems = ["Home", "Find Jobs", "Find Talents", "About us", "Testimonials"]

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="bg-background border-b border-border px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center relative">
        {/* Logo and Brand - Centered */}
        <div className="flex items-center absolute left-0">
          <Image src="/logo.png" alt="JobBoard Logo" width={40} height={40} className="mr-3" />
          <span className="text-xl font-bold text-foreground">JobBoard</span>
        </div>

        {/* Navigation Items - Centered */}
        <div className="flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => onTabChange(item)}
              className={`text-sm font-medium transition-colors px-3 py-2 rounded-md ${
                activeTab === item 
                  ? "text-foreground bg-muted" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Action Buttons - Right Side */}
        <div className="flex items-center space-x-3 absolute right-0">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-10 w-10 p-0"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Create Jobs Button */}
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-medium"
            onClick={() => {
              onCreateJobClick?.()
            }}
          >
            Create Jobs
          </Button>
        </div>
      </div>
    </nav>
  )
}
