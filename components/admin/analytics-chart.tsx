"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface AnalyticsChartProps {
  data: { date: string; views: number; downloads: number }[]
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  // Format dates for display
  const formattedData = data.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    }),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
        <XAxis
          dataKey="date"
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <YAxis
          className="text-xs"
          tick={{ fill: "hsl(var(--muted-foreground))" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "6px",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="views"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
          name="Views"
        />
        <Line
          type="monotone"
          dataKey="downloads"
          stroke="hsl(var(--chart-2, 142 76% 36%))"
          strokeWidth={2}
          dot={false}
          name="Downloads"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
