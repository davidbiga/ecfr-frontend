import { State } from "../types"
import { Dispatch } from "react"
import { Action } from "../types"

interface DetailsViewProps {
  state: State
  dispatch: Dispatch<Action>
  agencyColors: Record<string, string>
}

export function DetailsView({ state, dispatch, agencyColors }: DetailsViewProps) {
  if (!state.selectedMonth) return null

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">
          Changes for {state.selectedMonth.month}
        </h3>
        <button
          onClick={() => dispatch({ type: 'SET_VIEW_TYPE', payload: 'timeline' })}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Back to Timeline
        </button>
      </div>
      <div className="space-y-4">
        {Object.entries(state.selectedMonth.data)
          .filter(([, value]) => value > 0)
          .sort(([, a], [, b]) => b - a)
          .map(([agency, count]) => (
            <button
              key={agency}
              className="w-full text-left"
              onClick={() => {
                const monthDate = new Date(state.selectedMonth!.month);
                const startOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                const endOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                
                const agencyCorrections = state.data?.byAgency[agency]?.corrections.filter(
                  correction => {
                    const correctionDate = new Date(correction.lastModified);
                    return correctionDate >= startOfMonth && correctionDate <= endOfMonth;
                  }
                ) || [];

                dispatch({
                  type: 'SET_SELECTED_AGENCY',
                  payload: {
                    name: agency,
                    month: state.selectedMonth!.month,
                    corrections: agencyCorrections
                  }
                });
              }}
            >
              <div className="flex items-center justify-between p-4 rounded-lg border hover:border-blue-500">
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: agencyColors[agency] }}
                  />
                  <span className="font-medium">
                    {state.data?.byAgency[agency]?.shortName || agency}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">{count}</span>
                  <span className="text-sm text-muted-foreground">
                    {count === 1 ? 'correction' : 'corrections'}
                  </span>
                </div>
              </div>
            </button>
        ))}
      </div>
    </div>
  )
} 