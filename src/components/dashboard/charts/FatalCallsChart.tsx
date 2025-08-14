import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { AlertTriangle } from 'lucide-react';

interface FatalCallsChartProps {
  data: { fatal: number; normal: number };
}

export const FatalCallsChart: React.FC<FatalCallsChartProps> = ({ data }) => {
  const total = data.fatal + data.normal;
  const chartData = [
    { name: 'Fatal Calls', value: data.fatal, color: 'hsl(var(--destructive))' },
    { name: 'Normal Calls', value: data.normal, color: 'hsl(var(--success))' }
  ];

  const renderCustomLabel = (entry: any) => {
    if (entry.value === 0) return '';
    return `${entry.value}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="chart-container"
    >
      <div className="mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Fatal Calls</h3>
          <p className="text-sm text-muted-foreground">Calls requiring immediate attention</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-destructive">{data.fatal}</div>
          <div className="text-xs text-muted-foreground">Fatal</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">{data.normal}</div>
          <div className="text-xs text-muted-foreground">Normal</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>

      <div className="h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={50}
              fill="#8884d8"
              dataKey="value"
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
      
      {data.fatal > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <p className="text-sm text-destructive font-medium">
            ⚠️ {data.fatal} fatal call{data.fatal !== 1 ? 's' : ''} need{data.fatal === 1 ? 's' : ''} immediate review
          </p>
        </div>
      )}
    </motion.div>
  );
};