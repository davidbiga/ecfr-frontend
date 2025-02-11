import { State } from "../types"
import { Dispatch } from "react"
import { Action } from "../types"
import { generateECFRUrl } from "../../lib/utils"

interface AgencyDetailsViewProps {
  state: State
  dispatch: Dispatch<Action>
}

export function AgencyDetailsView({ state, dispatch }: AgencyDetailsViewProps) {
  if (!state.selectedAgency) return null

  return (
    <div className="h-full overflow-auto">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {state.data?.byAgency[state.selectedAgency.name]?.shortName || state.selectedAgency.name}
          </h3>
          <p className="text-sm text-muted-foreground">
            Corrections for {state.selectedAgency.month}
          </p>
        </div>
        <button
          onClick={() => dispatch({ type: 'SET_SELECTED_AGENCY', payload: null })}
          className="text-sm text-blue-500 hover:text-blue-600"
        >
          Back to Summary
        </button>
      </div>
      <div className="space-y-4">
        {state.selectedAgency.corrections.map((correction, index) => (
          <div
            key={index}
            className="p-4 rounded-lg border space-y-2"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="font-medium">
                  Title {correction.titleNum}
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(correction.errorCorrected).toLocaleDateString()}
                </div>
              </div>
              <div className="text-sm font-medium">
                {correction.action}
              </div>
            </div>
            <div className="text-sm space-y-1">
              {correction.cfrReferences.map((ref, i) => (
                <a
                  key={i}
                  href={generateECFRUrl(ref)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-muted-foreground hover:text-blue-500 hover:underline"
                >
                  <div className="flex items-center gap-2">
                    <span>
                      {ref.hierarchy.title} 
                      {ref.hierarchy.chapter && ` > Chapter ${ref.hierarchy.chapter}`}
                      {ref.hierarchy.part && ` > Part ${ref.hierarchy.part}`}
                      {ref.hierarchy.section && ` > §${ref.hierarchy.section}`}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 