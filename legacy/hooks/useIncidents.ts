import useSWR from 'swr'
import { Incident } from '@/types/incidents'
import { useTime } from '@/contexts/TimeContext'
import { START_DATE } from '@/components/TimeSlider'
import { useMemo } from 'react'
import { useAllIncidents } from './useAllIncidents'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

type WeeklyIncidents = { [weekIndex: number]: Incident[] }

export function useIncidents() {
  const { data: rawData, isLoading, error } = useAllIncidents()
  const { selectedWeek } = useTime()

  // Pre-process data into weekly chunks when rawData changes
  const weeklyData = useMemo(() => {
    if (!rawData) return {}

    const weeklyChunks: WeeklyIncidents = {}
    
    rawData.forEach(incident => {
      const incidentDate = new Date(incident.incident_datetime)
      const weekIndex = Math.floor((incidentDate.getTime() - START_DATE.getTime()) / (7 * 24 * 60 * 60 * 1000))
      
      if (!weeklyChunks[weekIndex]) {
        weeklyChunks[weekIndex] = []
      }
      weeklyChunks[weekIndex].push(incident)
    })

    return weeklyChunks
  }, [rawData])

  // Get data for selected week
  const data = useMemo(() => {
    return weeklyData[selectedWeek] || []
  }, [weeklyData, selectedWeek])

  return {
    data,
    isLoading,
    error
  }
}

