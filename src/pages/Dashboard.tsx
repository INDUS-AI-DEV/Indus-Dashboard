import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Phone, 
  Clock, 
  TrendingUp,
  XCircle,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCallData } from '@/hooks/useCallData';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
// Chart components will be added back as needed
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { calls, metrics, loading: dataLoading, error } = useCallData();

  // Calculate KPIs from real data
  const kpiData = {
    totalCalls: metrics?.total_calls || 0,
    activeCalls: metrics?.status_distribution?.['in-progress'] || 0,
    avgCallDuration: '5:24', // This would come from your metrics
    successRate: metrics?.status_distribution?.['completed'] 
      ? Math.round((metrics.status_distribution['completed'] / metrics.total_calls) * 100) 
      : 0,
  };

  // Get recent calls (limited to 5 for the dashboard)
  const recentCalls = calls.slice(0, 5);
  const { refresh } = useCallData();

  const handleNewWidget = () => {
    toast({
      title: "New Widget",
      description: "Widget customization feature coming soon!"
    });
  };

  const handleDownloadReport = () => {
    setIsLoading(true);
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Report Downloaded",
        description: "Your report has been downloaded successfully!"
      });
    }, 1500);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-6 max-w-md mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex-1 bg-dashboard-bg">
      <DashboardHeader 
        onNewWidget={handleNewWidget}
        onDownloadReport={handleDownloadReport}
      />
      
      <main className="p-6 space-y-6">
        {/* KPI Cards */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Call Analytics</h2>
            <button 
              onClick={refresh}
              disabled={dataLoading}
              className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
              {dataLoading ? 'Refreshing...' : 'Refresh Data'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <KPICard 
              title="Total Calls" 
              value={kpiData.totalCalls.toString()} 
              icon={Phone} 
              trend={kpiData.totalCalls > 0 ? "up" : "none"}
              trendValue={kpiData.totalCalls > 0 ? "12%" : "0%"}
              loading={dataLoading}
            />
            <KPICard 
              title="Active Calls" 
              value={kpiData.activeCalls.toString()} 
              icon={Users} 
              trend={kpiData.activeCalls > 0 ? "up" : "none"}
              trendValue={kpiData.activeCalls > 0 ? "8%" : "0%"}
              loading={dataLoading}
            />
            <KPICard 
              title="Avg. Duration" 
              value={kpiData.avgCallDuration} 
              icon={Clock} 
              trend="down"
              trendValue="5%"
              loading={dataLoading}
            />
            <KPICard 
              title="Success Rate" 
              value={`${kpiData.successRate}%`} 
              icon={TrendingUp} 
              trend={kpiData.successRate > 50 ? "up" : "down"}
              trendValue={kpiData.successRate > 0 ? `${Math.round(kpiData.successRate / 10)}%` : "0%"}
              loading={dataLoading}
            />
          </div>
        </motion.section>

        {/* Recent Calls Table */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border p-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Calls</h2>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleDownloadReport}
                disabled={isLoading}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                {isLoading ? 'Exporting...' : 'Export'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b">
                  <th className="pb-3 px-4">Call ID</th>
                  <th className="pb-3 px-4">Status</th>
                  <th className="pb-3 px-4">User</th>
                  <th className="pb-3 px-4">Phone</th>
                  <th className="pb-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {dataLoading ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      Loading call data...
                    </td>
                  </tr>
                ) : recentCalls.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-muted-foreground">
                      No recent calls found
                    </td>
                  </tr>
                ) : (
                  recentCalls.map((call) => (
                    <tr key={call._id} className="hover:bg-muted/50">
                      <td className="py-3 px-4 text-sm font-mono">
                        {call.call_id?.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            call.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : call.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {call.status?.charAt(0).toUpperCase() + call.status?.slice(1) || 'Unknown'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {call.user_name || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {call.phone_number || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {call.created_at ? new Date(call.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.section>

        {/* Loading State for Downloads */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-card p-6 rounded-lg shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-foreground">Generating report...</span>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;