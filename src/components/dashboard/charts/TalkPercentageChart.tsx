import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

interface TalkPercentageChartProps {
  data: { talk: number; silence: number };
}

export const TalkPercentageChart: React.FC<TalkPercentageChartProps> = ({ data }) => {
  const chartData = [
    { name: 'Talk Time', value: data.talk, color: 'hsl(var(--chart-primary))' },
    { name: 'Silence', value: data.silence, color: 'hsl(var(--muted))' }
  ];

  const renderCustomLabel = (entry: any) => {
    return `${entry.value}%`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="chart-container"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Average Talk Percentage</h3>
        <p className="text-sm text-muted-foreground">Talk time vs silence ratio</p>
      </div>
      
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
              startAngle={90}
              endAngle={450}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              wrapperStyle={{ fontSize: '12px' }}
              iconType="circle"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-muted-foreground">
          Ideal talk percentage: 60-70%
        </div>
      </div>
    </motion.div>
  );
};