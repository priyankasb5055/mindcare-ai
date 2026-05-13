import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-card/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl">
        <p className="text-textPrimary font-medium text-sm mb-1">{format(new Date(data.date), 'MMM d, yyyy')}</p>
        <p className="text-accent2 text-lg font-bold flex items-center gap-2">
          {data.emoji} {data.moodScore}/5
        </p>
        <p className="text-xs text-textMuted capitalize mt-1">{data.mood}</p>
      </div>
    );
  }
  return null;
};

const MoodChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-white/5 border-dashed rounded-xl">
        <p className="text-textMuted text-sm">Not enough data to display chart.</p>
      </div>
    );
  }

  // Format data for Recharts (reverse to show chronological order)
  const chartData = [...data].reverse().map(item => ({
    ...item,
    formattedDate: format(new Date(item.date), 'MMM d')
  }));

  return (
    <div className="w-full h-[300px] min-h-[300px]">
      <ResponsiveContainer
        width="100%"
        height={300}
      >
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e90ff" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#1e90ff" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="formattedDate" 
            stroke="#4a6080" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis 
            domain={[1, 5]} 
            ticks={[1, 2, 3, 4, 5]}
            stroke="#4a6080" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1, strokeDasharray: '3 3' }} />
          <Area 
            type="monotone" 
            dataKey="moodScore" 
            stroke="#1e90ff" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorScore)" 
            activeDot={{ r: 6, fill: '#2dd4bf', stroke: '#0f2a4a', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
