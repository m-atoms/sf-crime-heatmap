'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface TimeContextType {
  selectedWeek: number
  setSelectedWeek: (week: number) => void
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

export function TimeProvider({ children }: { children: ReactNode }) {
  const [selectedWeek, setSelectedWeek] = useState(0)

  return (
    <TimeContext.Provider value={{ selectedWeek, setSelectedWeek }}>
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider')
  }
  return context
} 