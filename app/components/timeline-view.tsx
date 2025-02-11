import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { State } from "../types"

interface TimelineViewProps {
  chartData: any[]
  chartConfig: ChartConfig
  agencyColors: Record<string, string>
  onDataPointClick: (data: any) => void
}

export function TimelineView({ chartData, chartConfig, agencyColors, onDataPointClick }: TimelineViewProps) {
  return (
    <ChartContainer config={chartConfig} className="h-full">
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 16,
          right: 20,
          bottom: 40,
          left: 40,
        }}
        onClick={onDataPointClick}
      >
        <defs>
          {Object.entries(agencyColors).map(([agency, color]) => (
            <linearGradient key={agency} id={`gradient-${agency}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.2} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid 
          vertical={false} 
          stroke="#f0f0f0"
          strokeDasharray="8 8"
        />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={16}
          angle={-45}
          textAnchor="end"
          height={70}
          fontSize={12}
          stroke="#888888"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={12}
          stroke="#888888"
          allowDecimals={false}
          label={{ 
            value: "Corrections",
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: '#888888', fontSize: 12 }
          }}
        />
        <ChartTooltip 
          cursor={{
            stroke: "#888888",
            strokeWidth: 1,
            strokeDasharray: "4 4"
          }} 
          content={<ChartTooltipContent />}
          wrapperStyle={{
            outline: 'none'
          }}
        />
        {Object.entries(agencyColors).map(([agency, color]) => (
          <Line
            key={agency}
            dataKey={agency}
            type="monotone"
            stroke={color}
            strokeWidth={2}
            dot={{
              fill: "white",
              stroke: color,
              strokeWidth: 2,
              r: 4,
            }}
            activeDot={{
              fill: color,
              stroke: "white",
              strokeWidth: 2,
              r: 6,
            }}
            fill={`url(#gradient-${agency})`}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
} 