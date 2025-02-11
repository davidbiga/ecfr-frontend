import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { State } from "../types"

interface StatsCardsProps {
  state: State
  trend: string | null
}

export function StatsCards({ state, trend }: StatsCardsProps) {
  const totalAgencies = state.data?.byAgency ? Object.keys(state.data.byAgency).length : 0
  const totalCorrections = state.data?.byAgency ? 
    Object.values(state.data.byAgency).reduce((sum, agency) => 
      sum + agency.corrections.length, 0
    ) : 0

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Agencies</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {state.loading ? (
              "Loading..."
            ) : state.error ? (
              "Error"
            ) : (
              totalAgencies
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Federal agencies with corrections
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Corrections</CardTitle>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="h-4 w-4 text-muted-foreground"
          >
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {state.loading ? (
              "Loading..."
            ) : state.error ? (
              "Error"
            ) : (
              totalCorrections
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Total corrections made to date
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Current Change Trend</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {state.loading ? (
              "Loading..."
            ) : state.error ? (
              "Error"
            ) : trend ? (
              `${Number(trend) > 0 ? '+' : ''}${trend}%`
            ) : (
              'No data'
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Trend based on visible data
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 