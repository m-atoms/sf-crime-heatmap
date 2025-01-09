import { NextResponse } from 'next/server'

// This is a mock function. In a real application, you would fetch data from a database or external API.
async function fetchIncidents() {
  // Simulating API delay
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Generate mock data
  const incidents = Array.from({ length: 1000 }, (_, i) => ({
    incident_datetime: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
    longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
    incident_category: ['Larceny Theft', 'Assault', 'Burglary', 'Vehicle Theft', 'Robbery'][Math.floor(Math.random() * 5)]
  }))

  return incidents
}

export async function GET() {
  try {
    const incidents = await fetchIncidents()
    return NextResponse.json(incidents)
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 })
  }
}

