import { useTime } from '@/contexts/TimeContext'
import { START_DATE } from '@/components/TimeSlider'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

export interface HeatmapIncident {
  latitude: number
  longitude: number
  incident_count: number
}

export function useIncidents() {
  const { selectedWeek } = useTime()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [data, setData] = useState<HeatmapIncident[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Calculate the week start date based on selectedWeek
        const weekStart = new Date(START_DATE)
        weekStart.setDate(weekStart.getDate() + selectedWeek * 7)
        const weekStartStr = weekStart.toISOString().slice(0, 10) // 'YYYY-MM-DD'

        // Query the heatmap view for the selected week
        const { data, error: supabaseError } = await supabase
          .from('weekly_incident_heatmap')
          .select('latitude, longitude, incident_count')
          .eq('week_start', weekStartStr)

        if (supabaseError) {
          console.error('Supabase error:', supabaseError)
          throw supabaseError
        }

        if (data) {
          setData(data as HeatmapIncident[])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [selectedWeek])

  return {
    data,
    isLoading,
    error
  }
}

