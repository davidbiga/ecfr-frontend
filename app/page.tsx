"use client"

import { useEffect, useReducer, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { reducer, initialState } from "@/reducers/corrections"
import { StatsCards } from "./components/stats-cards"
import { TimelineView } from "./components/timeline-view"
import { DetailsView } from "./components/details-view"
import { AgencyDetailsView } from "./components/agency-details-view"
import { TimeRange, ViewType } from "./types"
import { ChartConfig } from "@/components/ui/chart"
import { fetchCorrectionsData } from '../lib/api'
import Image from 'next/image'

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  useEffect(() => {
    async function loadData() {
      dispatch({ type: 'FETCH_START' })
      try {
        const data = await fetchCorrectionsData()
        dispatch({ type: 'FETCH_SUCCESS', payload: data })
      } catch (error) {
        dispatch({ 
          type: 'FETCH_ERROR', 
          payload: error instanceof Error ? error.message : 'Failed to fetch data'
        })
      }
    }
    loadData()
  }, [])

  const { chartData, agencyColors, chartConfig, trend } = useMemo(() => {
    if (!state.data?.byAgency) {
      return { chartData: [], agencyColors: {}, chartConfig: {}, trend: null }
    }

    // Generate agency colors
    const colors = [
      "hsl(217, 91%, 60%)", "hsl(142, 76%, 36%)", "hsl(346, 87%, 48%)",
      "hsl(250, 69%, 61%)", "hsl(32, 95%, 44%)", "hsl(182, 85%, 39%)",
    ]
    
    const agencyColors = Object.keys(state.data.byAgency).reduce((acc, agency, index) => {
      acc[agency] = colors[index % colors.length]
      return acc
    }, {} as Record<string, string>)

    // Generate chart config
    const chartConfig = Object.keys(state.data.byAgency).reduce((acc, agency) => {
      acc[agency] = {
        label: state.data?.byAgency[agency].shortName || agency,
        color: agencyColors[agency],
      }
      return acc
    }, {} as ChartConfig)

    // Process chart data
    const monthlyData = new Map()
    const allAgencies = Object.keys(state.data.byAgency)
    const cutoffDate = new Date()
    const now = new Date()

    switch (state.timeRange) {
      case '3M': cutoffDate.setMonth(now.getMonth() - 3); break
      case '12M': cutoffDate.setMonth(now.getMonth() - 12); break
      case '3Y': cutoffDate.setFullYear(now.getFullYear() - 3); break
      case '5Y': cutoffDate.setFullYear(now.getFullYear() - 5); break
      case '10Y': cutoffDate.setFullYear(now.getFullYear() - 10); break
      case 'ALL': cutoffDate.setFullYear(1900); break
    }

    Object.entries(state.data.byAgency).forEach(([agencyName, agency]) => {
      agency.corrections.forEach(correction => {
        const date = new Date(correction.lastModified)
        if (date >= cutoffDate) {
          const monthKey = date.toLocaleString('default', { month: 'long', year: 'numeric' })
          if (!monthlyData.has(monthKey)) {
            monthlyData.set(monthKey, allAgencies.reduce((acc, agency) => {
              acc[agency] = 0
              return acc
            }, {} as Record<string, number>))
          }
          monthlyData.get(monthKey)[agencyName]++
        }
      })
    })

    const chartData = Array.from(monthlyData.entries())
      .map(([month, agencies]) => ({
        month,
        ...agencies
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

    // Calculate trend
    let trend = null
    if (chartData.length >= 2) {
      const midPoint = Math.floor(chartData.length / 2)
      const [firstHalf, secondHalf] = [chartData.slice(0, midPoint), chartData.slice(midPoint)]
      
      const getHalfAvg = (data: any[]) => data.reduce((sum, month) => 
        sum + Object.entries(month).reduce((monthSum, [key, val]) => 
          key !== 'month' ? monthSum + (val as number) : monthSum, 0
        ), 0) / data.length

      const [firstHalfAvg, secondHalfAvg] = [getHalfAvg(firstHalf), getHalfAvg(secondHalf)]
      
      if (firstHalfAvg !== 0) {
        trend = (((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100).toFixed(1)
      }
    }

    return { chartData, agencyColors, chartConfig, trend }
  }, [state.data, state.timeRange])

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <Image
          src="/logo.svg"
          alt="CFR Logo"
          width={500}
          height={100}
          priority
        />
      </div>

      <StatsCards state={state} trend={trend} />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>CFR Corrections Timeline</CardTitle>
                <CardDescription>Historical changes over time</CardDescription>
              </div>
              <Tabs
                defaultValue={state.timeRange}
                onValueChange={(value) => 
                  dispatch({ type: 'SET_TIME_RANGE', payload: value as TimeRange })
                }
              >
                <TabsList>
                  <TabsTrigger value="3M">3M</TabsTrigger>
                  <TabsTrigger value="12M">12M</TabsTrigger>
                  <TabsTrigger value="3Y">3Y</TabsTrigger>
                  <TabsTrigger value="5Y">5Y</TabsTrigger>
                  <TabsTrigger value="10Y">10Y</TabsTrigger>
                  <TabsTrigger value="ALL">ALL</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Tabs
              defaultValue={state.viewType}
              onValueChange={(value) => 
                dispatch({ type: 'SET_VIEW_TYPE', payload: value as ViewType })
              }
              className="w-[400px]"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="">
          {state.loading ? (
            <div className="flex justify-center items-center h-full">
              Loading...
            </div>
          ) : state.error ? (
            <div className="flex justify-center items-center h-full text-red-500">
              {state.error}
            </div>
          ) : (
            <>
              {state.viewType === 'timeline' ? (
                <TimelineView
                  chartData={chartData}
                  chartConfig={chartConfig}
                  agencyColors={agencyColors}
                  onDataPointClick={(data) => {
                    if (data?.activePayload?.[0]?.payload) {
                      const monthData = data.activePayload[0].payload;
                      dispatch({
                        type: 'SET_SELECTED_MONTH',
                        payload: {
                          month: monthData.month,
                          data: Object.fromEntries(
                            Object.entries(monthData).filter(([key]) => key !== 'month')
                          )
                        }
                      });
                    }
                  }}
                />
              ) : state.viewType === 'details' ? (
                state.selectedAgency ? (
                  <AgencyDetailsView state={state} dispatch={dispatch} />
                ) : (
                  <DetailsView state={state} dispatch={dispatch} agencyColors={agencyColors} />
                )
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">
                    AI Analysis view coming soon...
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
