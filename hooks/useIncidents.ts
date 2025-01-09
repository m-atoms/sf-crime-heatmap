import useSWR from 'swr'
import { Incident } from '@/types/incidents'
import { useTime } from '@/contexts/TimeContext'
import { START_DATE } from '@/components/TimeSlider'
import { useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useIncidents() {
  const { data: rawData, error, isLoading } = useSWR<Incident[]>('/api/incidents', fetcher)
  const { selectedWeek } = useTime()

  const data = useMemo(() => {
    if (!rawData) return []

    const weekStart = new Date(START_DATE.getTime() + selectedWeek * 7 * 24 * 60 * 60 * 1000)
    const weekEnd = new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000)

    return rawData.filter(incident => {
      const incidentDate = new Date(incident.incident_datetime)
      return incidentDate >= weekStart && incidentDate < weekEnd
    })
  }, [rawData, selectedWeek])

  return {
    data,
    isLoading,
    error
  }
}

