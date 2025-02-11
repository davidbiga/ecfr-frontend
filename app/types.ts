// Types for our API response
export type CfrReference = {
  cfr_reference: string
  hierarchy: {
    title: string
    chapter?: string
    subchapter?: string
    part?: string
    subpart?: string
    section: string
  }
}

export type Correction = {
  titleNum: number
  errorCorrected: string
  errorOccurred: string
  action: string
  lastModified: string
  cfrReferences: CfrReference[]
}

export type AgencyData = {
  name: string
  shortName: string
  titles: number[]
  correctionCount: number
  lastCorrectionDate: string
  modificationDates: string[]
  corrections: Correction[]
}

export type ApiResponse = {
  totalCorrections: number
  totalAgencies: number
  byAgency: Record<string, AgencyData>
}

export type TimeRange = '3M' | '12M' | '3Y' | '5Y' | '10Y' | 'ALL'
export type ViewType = 'timeline' | 'analysis' | 'details'

export type SelectedMonth = {
  month: string
  data: Record<string, number>
} | null

export type SelectedAgency = {
  name: string
  month: string
  corrections: Correction[]
} | null

export type State = {
  loading: boolean
  error: string | null
  data: ApiResponse | null
  timeRange: TimeRange
  viewType: ViewType
  selectedMonth: SelectedMonth
  selectedAgency: SelectedAgency
}

export type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: ApiResponse }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'SET_TIME_RANGE'; payload: TimeRange }
  | { type: 'SET_VIEW_TYPE'; payload: ViewType }
  | { type: 'SET_SELECTED_MONTH'; payload: SelectedMonth }
  | { type: 'SET_SELECTED_AGENCY'; payload: SelectedAgency } 