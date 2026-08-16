'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

// ─── Formatters ───────────────────────────────────────────────────────────────

function fmtNum(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return String(value);
}

function fmtPct(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({
  active,
  payload,
  label,
  formatter,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
  formatter?: (v: number) => string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid rgb(229 231 235)',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 6px rgba(11,17,32,0.06)',
        fontSize: 13,
        fontFamily: 'inherit',
      }}
    >
      {label && <div style={{ fontWeight: 600, marginBottom: 6, color: '#0b1120' }}>{label}</div>}
      {payload.map((entry) => (
        <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, flexShrink: 0 }} />
          <span style={{ color: '#6b7280' }}>{entry.name}:</span>
          <span style={{ fontWeight: 600, color: '#0b1120' }}>
            {formatter ? formatter(entry.value) : fmtNum(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Channel Bar Chart ────────────────────────────────────────────────────────

const CHANNEL_COLORS = [
  '#166534',
  '#0f766e',
  '#1d4ed8',
  '#7c3aed',
  '#b45309',
  '#be123c',
];

export function ChannelBarChart({
  data,
  metric = 'Engagements',
}: Readonly<{
  data: Array<{ channel: string; value: number }>;
  metric?: string;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ width: '100%', height: 220 }} />;
  }

  if (!data.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-sm text-muted">
        No channel data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} barCategoryGap="35%" margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(229 231 235)" vertical={false} />
        <XAxis
          dataKey="channel"
          stroke="rgb(107 114 128)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={4}
        />
        <YAxis
          stroke="rgb(107 114 128)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtNum}
          width={40}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(22,101,52,0.04)' }} />
        <Bar dataKey="value" name={metric} radius={[4, 4, 0, 0]} maxBarSize={48}>
          {data.map((entry, index) => (
            <Cell key={entry.channel} fill={CHANNEL_COLORS[index % CHANNEL_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Performance Line Chart ───────────────────────────────────────────────────

export function PerformanceLineChart({
  data,
}: Readonly<{
  data?: Array<{ day: string; impressions?: number; engagements?: number; value?: number }>;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ width: '100%', height: 220 }} />;
  }

  // Fallback demo data if no data provided
  const chartData = data ?? [
    { day: 'Day 1', impressions: 3200, engagements: 420 },
    { day: 'Day 2', impressions: 4100, engagements: 580 },
    { day: 'Day 3', impressions: 3800, engagements: 510 },
    { day: 'Day 4', impressions: 5200, engagements: 740 },
    { day: 'Day 5', impressions: 4900, engagements: 680 },
    { day: 'Day 6', impressions: 6100, engagements: 890 },
    { day: 'Day 7', impressions: 7400, engagements: 1020 },
  ];

  const hasTwo = 'engagements' in chartData[0];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(229 231 235)" vertical={false} />
        <XAxis
          dataKey="day"
          stroke="rgb(107 114 128)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          dy={4}
        />
        <YAxis
          stroke="rgb(107 114 128)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={fmtNum}
          width={44}
        />
        <Tooltip content={<CustomTooltip />} />
        {hasTwo && (
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
          />
        )}
        <Line
          type="monotone"
          dataKey={hasTwo ? 'impressions' : 'value'}
          name="Impressions"
          stroke="#166534"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: '#166534' }}
        />
        {hasTwo && (
          <Line
            type="monotone"
            dataKey="engagements"
            name="Engagements"
            stroke="#0f766e"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 3"
            activeDot={{ r: 4, fill: '#0f766e' }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// ─── Analytics Metric Bar Chart ───────────────────────────────────────────────

export function AnalyticsBarChart({
  data,
  dataKey,
  nameKey,
  formatter,
  color,
}: Readonly<{
  data: Array<Record<string, string | number>>;
  dataKey: string;
  nameKey: string;
  formatter?: (v: number) => string;
  color?: string;
}>) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{ width: '100%', height: 200 }} />;
  }

  if (!data.length) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgb(229 231 235)" horizontal={false} />
        <XAxis
          type="number"
          stroke="rgb(107 114 128)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatter ?? fmtNum}
        />
        <YAxis
          type="category"
          dataKey={nameKey}
          stroke="rgb(107 114 128)"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          width={90}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          content={<CustomTooltip formatter={formatter} />}
          cursor={{ fill: 'rgba(22,101,52,0.04)' }}
        />
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} fill={color ?? '#166534'} maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Engagement Rate Chart ────────────────────────────────────────────────────

export function EngagementRateChart({
  data,
}: Readonly<{
  data: Array<{ channel: string; value: number }>;
}>) {
  return (
    <AnalyticsBarChart
      data={data}
      dataKey="value"
      nameKey="channel"
      formatter={fmtPct}
      color="#0f766e"
    />
  );
}
