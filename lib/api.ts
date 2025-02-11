import { ApiResponse } from '../app/types'

export async function fetchCorrectionsData(): Promise<ApiResponse> {
  const response = await fetch('https://xlw4zm-3000.csb.app/api/analysis/historical-changes')
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}