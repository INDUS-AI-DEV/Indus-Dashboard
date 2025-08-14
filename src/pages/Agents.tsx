import React from 'react';
import { motion } from 'framer-motion';

const Agents: React.FC = () => {
  return (
    <div className="flex-1 bg-dashboard-bg">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Manage Agents</h1>
            <p className="text-muted-foreground">Agent performance and management</p>
          </div>
          
          <div className="chart-container h-96 flex items-center justify-center">
            <div className="text-center">
              <p className="text-lg font-medium text-muted-foreground">
                Agent management interface coming soon
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                This will include agent profiles, performance metrics, and training materials
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Agents;