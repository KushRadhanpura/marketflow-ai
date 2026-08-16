'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const campaignTrend = [
  { day: 'Mon', value: 1200 },
  { day: 'Tue', value: 1500 },
  { day: 'Wed', value: 1400 },
  { day: 'Thu', value: 1700 },
  { day: 'Fri', value: 1800 },
  { day: 'Sat', value: 2200 },
  { day: 'Sun', value: 2400 },
];

export function PerformanceLineChart() {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={campaignTrend}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="day" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip />
        <Line type="monotone" dataKey="value" stroke="#15803d" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function ChannelBarChart({ data }: Readonly<{ data: Array<{ channel: string; value: number }> }>) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis dataKey="channel" stroke="#64748b" />
        <YAxis stroke="#64748b" />
        <Tooltip />
        <Bar dataKey="value" radius={[12, 12, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.channel} fill={entry.channel === 'Instagram' ? '#15803d' : '#0f766e'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
