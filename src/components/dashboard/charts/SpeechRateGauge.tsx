import React from 'react';
import { motion } from 'framer-motion';

interface SpeechRateGaugeProps {
  value: number; // words per minute
}

export const SpeechRateGauge: React.FC<SpeechRateGaugeProps> = ({ value }) => {
  // Normalize value to percentage (assuming 100-200 WPM range)
  const minWPM = 100;
  const maxWPM = 200;
  const percentage = Math.min(100, Math.max(0, ((value - minWPM) / (maxWPM - minWPM)) * 100));
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColorByValue = (wpm: number) => {
    if (wpm >= 120 && wpm <= 160) return 'hsl(var(--success))'; // Optimal range
    if (wpm >= 100 && wpm <= 180) return 'hsl(var(--warning))'; // Acceptable range
    return 'hsl(var(--destructive))'; // Too slow or too fast
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="chart-container"
    >
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">Average Rate of Speech</h3>
        <p className="text-sm text-muted-foreground">Words per minute (WPM)</p>
      </div>
      
      <div className="flex items-center justify-center h-48">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              stroke={getColorByValue(value)}
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-foreground">{value}</div>
            <div className="text-xs text-muted-foreground">WPM</div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-sm text-muted-foreground">
          Optimal range: 120-160 WPM
        </div>
      </div>
    </motion.div>
  );
};