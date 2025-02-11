import { State, Action } from '../app/types'

export const initialState: State = {
  loading: false,
  error: null,
  data: null,
  timeRange: '12M',
  viewType: 'timeline',
  selectedMonth: null,
  selectedAgency: null
}

export function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, error: null, data: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'SET_TIME_RANGE':
      return { ...state, timeRange: action.payload }
    case 'SET_VIEW_TYPE':
      return { ...state, viewType: action.payload }
    case 'SET_SELECTED_MONTH':
      return { ...state, selectedMonth: action.payload, viewType: 'details' }
    case 'SET_SELECTED_AGENCY':
      return { ...state, selectedAgency: action.payload }
    default:
      return state
  }
} 