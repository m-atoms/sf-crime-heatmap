import useSWR from 'swr'
import { Incident } from '@/types/incidents'
import { useMemo } from 'react'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useAllIncidents() {
  const { data: rawData, error, isLoading } = useSWR<Incident[]>('/api/incidents', fetcher)

  // Filter out non-criminal incidents
  const data = useMemo(() => {
    return rawData?.filter(incident => incident.incident_category !== 'Non-Criminal') || []
  }, [rawData])

  return {
    data,
    isLoading,
    error
  }
} 