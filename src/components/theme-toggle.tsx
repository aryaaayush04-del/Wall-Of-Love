"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="w-11 h-6"></div>
  }

  const currentTheme = theme === 'system' ? systemTheme : theme
  const isDark = currentTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 dark:focus:ring-gray-100 dark:focus:ring-offset-gray-900"
    >
      <span className="sr-only">Toggle theme</span>
      <span
        className={`${
          isDark ? 'translate-x-6' : 'translate-x-1'
        } inline-flex h-4 w-4 transform items-center justify-center rounded-full bg-white transition-transform`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-gray-900" />
        ) : (
          <Sun className="h-3 w-3 text-gray-900" />
        )}
      </span>
    </button>
  )
}
