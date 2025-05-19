import { useTime } from '@/contexts/TimeContext'
import { START_DATE } from '@/components/TimeSlider'
import { useMemo } from 'react'
import { Incident } from '@/types/incidents'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
/*
all columns, used for llm dont delete
"Incident Datetime",
"Incident Date",
"Incident Time",
"Incident Year",
"Incident Day of Week",
"Report Datetime",
"Row ID",
"Incident ID",
"Incident Number",
"CAD Number",
"Report Type Code",
"Report Type Description",
"Filed Online",
"Incident Code",
"Incident Category",
"Incident Subcategory",
"Incident Description",
Resolution,
Intersection,
CNN,
"Police District",
"Analysis Neighborhood",
"Supervisor District",
"Supervisor District 2012",
Latitude,
Longitude,
Point,
Neighborhoods,
"ESNCAG - Boundary File",
"Central Market/Tenderloin Boundary Polygon - Updated",
"Civic Center Harm Reduction Project Boundary",
"HSOC Zones as of 2018-06-05",
"Invest In Neighborhoods (IIN) Areas",
"Current Supervisor Districts",
"Current Police Districts"
*/

export function useIncidents() {
  const { selectedWeek } = useTime()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [rawData, setRawData] = useState<Incident[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Query incidents from Supabase using the correct table and column names
        const { data, error: supabaseError } = await supabase
          .from('sfpd_incident_reports')
          .select(`
            "Incident Datetime",
            "Incident Category",
            "Incident Description",
            Latitude,
            Longitude
          `)

        if (supabaseError) {
          throw supabaseError
        }

        if (data) {
          // Map the Supabase row fields to the Incident type expected by the app
          setRawData(
            data.map((row: any) => ({
              incident_datetime: row["Incident Datetime"],
              incident_category: row["Incident Category"],
              incident_description: row["Incident Description"],
              latitude: row.Latitude,
              longitude: row.Longitude,
            }))
          )
          setError(null)
          console.log('Incidents from Supabase:', data)
          if (data && data.length > 0) {
            console.log('First row:', data[0]);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Pre-process data into weekly chunks when rawData changes
  const weeklyData = useMemo(() => {
    if (!rawData) return {}

    const weeklyChunks: { [weekIndex: number]: Incident[] } = {}
    
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

