"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, TreesIcon as Lungs, User, MessageSquare } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()

  // Don't show navigation on welcome, login, or signup pages
  if (pathname === "/" || pathname === "/login" || pathname === "/signup") {
    return null
  }

  const navItems = [
    { href: "/home", icon: Home, label: "Home" },
    { href: "/breathing", icon: Lungs, label: "Breathing" },
    { href: "/reviews", icon: MessageSquare, label: "Community" },
    { href: "/account", icon: User, label: "Account" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? "text-orange-500" : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

