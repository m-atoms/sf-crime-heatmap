import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Return the date representing the end of the available dataset.
 * This is set to one week prior to the current date to allow for
 * a lag between real time and data updates.
 */
export function getDatasetEndDate(lagDays = 7): Date {
  const date = new Date()
  date.setDate(date.getDate() - lagDays)
  return date
}

/** Convenience helper to format a Date as YYYY-MM-DD */
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0]
}
