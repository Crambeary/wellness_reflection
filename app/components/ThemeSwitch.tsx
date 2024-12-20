import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Select defaultValue={theme} onValueChange={e => setTheme(e)}>
      <SelectTrigger className="w-full dark:text-white dark:bg-gray-800">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent className="dark:text-white dark:bg-gray-800">
        <SelectItem value="system">System</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
        <SelectItem value="light">Light</SelectItem>
      </SelectContent>
    </Select>
  )
}

export default ThemeSwitch