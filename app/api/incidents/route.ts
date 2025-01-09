import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { promises as fs } from 'fs'
import path from 'path'

interface CSVRecord {
  'Incident Datetime': string
  'Latitude': string
  'Longitude': string
  'Incident Category': string
}

interface Incident {
  incident_datetime: string
  latitude: number | null
  longitude: number | null
  incident_category: string
}

async function fetchIncidents() {
  try {
    const csvPath = path.join(process.cwd(), 'data.csv')
    const fileContent = await fs.readFile(csvPath, 'utf-8')
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      fromLine: 1,
    }) as CSVRecord[]

    return records.map((record: CSVRecord): Incident => ({
      incident_datetime: record['Incident Datetime'],
      latitude: parseFloat(record['Latitude']) || null,
      longitude: parseFloat(record['Longitude']) || null,
      incident_category: record['Incident Category']
    })).filter((incident: Incident) => 
      incident.latitude !== null && 
      incident.longitude !== null
    )
  } catch (error) {
    console.error('Error reading CSV file:', error)
    throw error
  }
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

