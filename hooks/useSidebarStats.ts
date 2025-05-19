import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
/*
all columns
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
export interface MonthlyStats {
  month: string
  total: number
  larceny_theft: number
  motor_vehicle_theft: number
  other_miscellaneous: number
  assault: number
  malicious_mischief: number
}

// Helper function to get the month string (YYYY-MM)
function getMonthString(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function useSidebarStats() {
  const [data, setData] = useState<MonthlyStats[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly stats from the new view
        const { data: stats, error: supabaseError } = await supabase
          .from('monthly_incident_stats')
          .select('*')
          .order('month', { ascending: true })

        if (supabaseError) {
          throw supabaseError
        }

        if (stats) {
          setData(stats as MonthlyStats[])
          setError(null)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'))
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return {
    data,
    isLoading,
    error
  }
} 