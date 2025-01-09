'use client'

import { useState } from 'react'
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"

const START_DATE = new Date('2018-01-01')
const END_DATE = new Date('2025-12-31')
const TOTAL_WEEKS = Math.floor((END_DATE.getTime() - START_DATE.getTime()) / (7 * 24 * 60 * 60 * 1000))

export default function TimeSlider() {
  const [selectedWeek, setSelectedWeek] = useState(0)

  const handleSliderChange = (value: number[]) => {
    setSelectedWeek(value[0])
  }

  const getCurrentDate = () => {
    const date = new Date(START_DATE.getTime() + selectedWeek * 7 * 24 * 60 * 60 * 1000)
    return date.toISOString().split('T')[0]
  }

  return (
    <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow">
      <div className="flex items-center justify-between mb-2">
        <Label htmlFor="time-slider" className="text-sm font-medium">
          Select Week:
        </Label>
        <span className="text-sm font-medium">{getCurrentDate()}</span>
      </div>
      <Slider
        id="time-slider"
        max={TOTAL_WEEKS}
        step={1}
        value={[selectedWeek]}
        onValueChange={handleSliderChange}
      />
    </div>
  )
}

