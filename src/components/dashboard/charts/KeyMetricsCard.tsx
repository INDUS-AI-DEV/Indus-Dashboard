import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface KeyMetricsCardProps {
  data: {
    ptpPercentage: number;
    rtpPercentage: number;
    conversionRate: number;
  };
}

export const KeyMetricsCard: React.FC<KeyMetricsCardProps> = ({ data }) => {
  const metrics = [
    { 
      label: 'PTP %', 
      value: data.ptpPercentage, 
      trend: 5.2, 
      isPositive: true 
    },
    { 
      label: 'RTP %', 
      value: data.rtpPercentage, 
      trend: 2.1, 
      isPositive: true 
    },
    { 
      label: 'Conversion Rate', 
      value: data.conversionRate, 
      trend: -1.3, 
      isPositive: false 
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="chart-container"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Key Metrics</h3>
        <p className="text-sm text-muted-foreground">Important performance indicators</p>
      </div>
      
      <div className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={metric.label} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
              <p className="text-2xl font-bold text-foreground">{metric.value}%</p>
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              metric.isPositive ? 'text-success' : 'text-destructive'
            }`}>
              {metric.isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              {Math.abs(metric.trend)}%
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};