"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const industryConfig: ChartConfig = {
  count: { label: "Submissions", color: "var(--chart-2)" },
}

const dailyConfig: ChartConfig = {
  count: { label: "Submissions", color: "var(--chart-3)" },
}

export function IndustryBarChart({
  data,
}: {
  data: { industry: string; count: number }[]
}) {
  return (
    <ChartContainer config={industryConfig} className="h-64 w-full">
      <BarChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="industry" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={6} />
      </BarChart>
    </ChartContainer>
  )
}

export function DailyLineChart({
  data,
}: {
  data: { date: string; count: number }[]
}) {
  return (
    <ChartContainer config={dailyConfig} className="h-64 w-full">
      <LineChart data={data} margin={{ left: 4, right: 4, top: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} fontSize={12} />
        <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} width={28} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line
          dataKey="count"
          type="monotone"
          stroke="var(--color-count)"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
