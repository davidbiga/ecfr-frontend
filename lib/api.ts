import { ApiResponse } from '../app/types'

export async function fetchCorrectionsData(): Promise<ApiResponse> {
  const response = await fetch('http://localhost:3000/api/analysis/historical-changes')
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}