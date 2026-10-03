import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { WpmDataPoint } from '../types'

interface WpmChartProps {
  data: WpmDataPoint[]
  height?: number
}

export function WpmChart({ data, height = 150 }: WpmChartProps) {
  if (data.length < 2) return null

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
        <defs>
          <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
            <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="rawGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--text-muted)" stopOpacity={0.2} />
            <stop offset="95%" stopColor="var(--text-muted)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          tickFormatter={v => `${v}s`}
          stroke="var(--border-color)"
        />
        <YAxis
          tick={{ fontSize: 10, fill: 'var(--text-muted)' }}
          stroke="var(--border-color)"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            fontSize: '12px',
            color: 'var(--text-primary)',
          }}
          formatter={(value, name) => [
            `${value} WPM`,
            name === 'wpm' ? 'Net WPM' : 'Raw WPM',
          ]}
          labelFormatter={l => `${l}s`}
        />
        <Area
          type="monotone"
          dataKey="raw"
          stroke="var(--text-muted)"
          fill="url(#rawGrad)"
          strokeWidth={1}
          dot={false}
        />
        <Area
          type="monotone"
          dataKey="wpm"
          stroke="var(--accent)"
          fill="url(#wpmGrad)"
          strokeWidth={2}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
