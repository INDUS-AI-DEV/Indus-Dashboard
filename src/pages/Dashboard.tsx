import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Phone, 
  Clock, 
  TrendingUp, 
  Target 
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { KPICard } from '@/components/dashboard/KPICard';
import { SectionScoreChart } from '@/components/dashboard/charts/SectionScoreChart';
import { CallClassificationChart } from '@/components/dashboard/charts/CallClassificationChart';
import { KeyMetricsCard } from '@/components/dashboard/charts/KeyMetricsCard';
import { SpeechRateGauge } from '@/components/dashboard/charts/SpeechRateGauge';
import { TalkPercentageChart } from '@/components/dashboard/charts/TalkPercentageChart';
import { FatalCallsChart } from '@/components/dashboard/charts/FatalCallsChart';
import { 
  getFilteredData, 
  calculateKPIs, 
  calculateChartData 
} from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get filtered data based on user role
  const { agents, calls } = useMemo(() => {
    if (!user) return { agents: [], calls: [] };
    return getFilteredData(user.email, user.role);
  }, [user]);

  // Calculate KPIs and chart data
  const kpiData = useMemo(() => calculateKPIs(agents, calls), [agents, calls]);
  const chartData = useMemo(() => calculateChartData(calls), [calls]);

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
      toast({
        title: "Download Complete",
        description: "Dashboard report has been downloaded successfully."
      });
      setIsLoading(false);
    }, 2000);
  };

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
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          <KPICard
            title="Total Agents"
            value={kpiData.totalAgents}
            icon={Users}
            trend={{ value: 8.2, isPositive: true }}
            delay={0.1}
          />
          <KPICard
            title="Total Calls Analysed"
            value={kpiData.totalCallsAnalysed.toLocaleString()}
            icon={Phone}
            trend={{ value: 12.5, isPositive: true }}
            delay={0.2}
          />
          <KPICard
            title="Total Duration"
            value={`${kpiData.totalDuration}m`}
            icon={Clock}
            trend={{ value: 3.1, isPositive: false }}
            delay={0.3}
          />
          <KPICard
            title="Average Agent Score"
            value={`${kpiData.averageScore}%`}
            icon={TrendingUp}
            trend={{ value: 5.7, isPositive: true }}
            delay={0.4}
          />
          <KPICard
            title="Custom KPI"
            value={`${kpiData.customKPI}%`}
            icon={Target}
            trend={{ value: 2.3, isPositive: true }}
            delay={0.5}
          />
        </motion.section>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* First Row */}
          <div className="lg:col-span-2">
            <SectionScoreChart data={chartData.sectionScores} />
          </div>
          <CallClassificationChart data={chartData.callClassification} />
          
          {/* Second Row */}
          <KeyMetricsCard data={chartData.keyMetrics} />
          <SpeechRateGauge value={chartData.averageSpeechRate} />
          <TalkPercentageChart data={chartData.talkPercentage} />
          
          {/* Third Row - Full Width for Fatal Calls */}
          <div className="lg:col-span-2 xl:col-span-3">
            <FatalCallsChart data={chartData.fatalCalls} />
          </div>
        </div>

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