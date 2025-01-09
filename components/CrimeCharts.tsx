"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { useIncidents } from "@/hooks/useIncidents"
import { useMemo } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export default function CrimeCharts() {
  const { data: incidents } = useIncidents()
  
  const chartData = useMemo(() => {
    const hourlyData: { [hour: string]: number } = {}
    
    // Initialize hours
    for (let i = 0; i < 24; i++) {
      hourlyData[`${i}:00`] = 0
    }
    
    // Count incidents by hour
    incidents.forEach(incident => {
      const hour = new Date(incident.incident_datetime).getHours()
      hourlyData[`${hour}:00`] = (hourlyData[`${hour}:00`] || 0) + 1
    })
    
    return Object.entries(hourlyData).map(([hour, count]) => ({
      hour,
      incidents: count
    }))
  }, [incidents])

  const chartConfig = {
    incidents: {
      label: "Incidents",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <Card>
        <CardHeader>
          <CardTitle>Hourly Crime Distribution</CardTitle>
          <CardDescription>Bar chart showing incidents by hour</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar dataKey="incidents" fill="var(--color-desktop)" radius={8} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Crime Trend</CardTitle>
          <CardDescription>Area chart showing incident distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="hour"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="incidents"
                type="natural"
                fill="var(--color-desktop)"
                fillOpacity={0.4}
                stroke="var(--color-desktop)"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
} 