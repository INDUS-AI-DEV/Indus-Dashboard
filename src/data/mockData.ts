export interface Agent {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive';
  score: number;
  callsHandled: number;
  company: string;
}

export interface Call {
  id: string;
  agentId: string;
  agentName: string;
  duration: number; // in minutes
  score: number;
  classification: 'Paid in Full' | 'Partial Paid' | 'Overdue';
  talkPercentage: number;
  speechRate: number; // words per minute
  isFatal: boolean;
  date: Date;
  company: string;
}

export interface KPIData {
  totalAgents: number;
  totalCallsAnalysed: number;
  totalDuration: number;
  averageScore: number;
  customKPI: number;
}

export interface ChartData {
  sectionScores: Array<{ section: string; score: number }>;
  callClassification: Array<{ name: string; value: number; color: string }>;
  keyMetrics: {
    ptpPercentage: number;
    rtpPercentage: number;
    conversionRate: number;
  };
  averageSpeechRate: number;
  talkPercentage: { talk: number; silence: number };
  fatalCalls: { fatal: number; normal: number };
}

// Mock data for different companies
export const mockAgents: Agent[] = [
  { id: '1', name: 'John Smith', email: 'john@dabur.com', status: 'active', score: 92, callsHandled: 156, company: 'dabur.com' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@dabur.com', status: 'active', score: 88, callsHandled: 142, company: 'dabur.com' },
  { id: '3', name: 'Mike Chen', email: 'mike@techcorp.com', status: 'active', score: 95, callsHandled: 178, company: 'techcorp.com' },
  { id: '4', name: 'Emily Davis', email: 'emily@dabur.com', status: 'inactive', score: 76, callsHandled: 89, company: 'dabur.com' },
  { id: '5', name: 'Alex Kumar', email: 'alex@innovate.io', status: 'active', score: 91, callsHandled: 134, company: 'innovate.io' }
];

export const mockCalls: Call[] = [
  {
    id: '1', agentId: '1', agentName: 'John Smith', duration: 12.5, score: 92,
    classification: 'Paid in Full', talkPercentage: 65, speechRate: 145, isFatal: false,
    date: new Date('2024-01-15'), company: 'dabur.com'
  },
  {
    id: '2', agentId: '2', agentName: 'Sarah Johnson', duration: 8.3, score: 88,
    classification: 'Partial Paid', talkPercentage: 58, speechRate: 152, isFatal: false,
    date: new Date('2024-01-15'), company: 'dabur.com'
  },
  {
    id: '3', agentId: '3', agentName: 'Mike Chen', duration: 15.7, score: 95,
    classification: 'Paid in Full', talkPercentage: 72, speechRate: 138, isFatal: false,
    date: new Date('2024-01-14'), company: 'techcorp.com'
  },
  {
    id: '4', agentId: '1', agentName: 'John Smith', duration: 6.2, score: 45,
    classification: 'Overdue', talkPercentage: 42, speechRate: 162, isFatal: true,
    date: new Date('2024-01-14'), company: 'dabur.com'
  },
  {
    id: '5', agentId: '5', agentName: 'Alex Kumar', duration: 11.8, score: 91,
    classification: 'Paid in Full', talkPercentage: 68, speechRate: 141, isFatal: false,
    date: new Date('2024-01-13'), company: 'innovate.io'
  }
];

// User database for authentication
export const mockUsers = [
  { email: 'admin@enterprise.com', password: 'admin123', role: 'admin' as const, name: 'Admin User', company: 'enterprise.com' },
  { email: 'client@dabur.com', password: 'client123', role: 'client' as const, name: 'Dabur Manager', company: 'dabur.com' },
  { email: 'user@techcorp.com', password: 'user123', role: 'client' as const, name: 'Tech Corp User', company: 'techcorp.com' }
];

export const getFilteredData = (userEmail: string, userRole: 'admin' | 'client') => {
  if (userRole === 'admin') {
    return {
      agents: mockAgents,
      calls: mockCalls
    };
  }

  // For clients, filter by company domain
  const userDomain = userEmail.split('@')[1];
  return {
    agents: mockAgents.filter(agent => agent.company === userDomain),
    calls: mockCalls.filter(call => call.company === userDomain)
  };
};

export const calculateKPIs = (agents: Agent[], calls: Call[]): KPIData => {
  const totalDuration = calls.reduce((sum, call) => sum + call.duration, 0);
  const averageScore = calls.length > 0 
    ? calls.reduce((sum, call) => sum + call.score, 0) / calls.length 
    : 0;

  return {
    totalAgents: agents.length,
    totalCallsAnalysed: calls.length,
    totalDuration: Math.round(totalDuration),
    averageScore: Math.round(averageScore),
    customKPI: 87 // Placeholder custom metric
  };
};

export const mockCallLogs = [
  {
    id: '1',
    phoneNumber: '(123) 456-7890',
    name: 'John Doe',
    callDate: '2nd Aug, 2023',
    callingTime: '12:30 PM',
    disposition: 'Answered',
    ringingTime: 5,
    duration: 180,
    company: 'dabur.com',
    agentScore: 8.5,
    transcript: `Agent: Hello, this is Sarah from Dabur Customer Care. How can I help you today?
Customer: Hi, I'm calling about my recent order. I haven't received it yet.
Agent: I'm sorry to hear that. Let me look up your order details. Can you provide me with your order number?
Customer: Yes, it's DB-2023-08-001234.
Agent: Thank you. I can see your order was placed on July 28th. According to our tracking, it should have been delivered yesterday. Let me check with our logistics team.
Customer: That would be great, thank you.
Agent: I've escalated this to our logistics team and they'll call you within 2 hours with an update. Is this the best number to reach you?
Customer: Yes, this number is fine. Thank you for your help.
Agent: You're welcome! Is there anything else I can help you with today?
Customer: No, that's all. Thank you again.
Agent: Have a great day!`,
    summary: 'Customer inquiry about delayed order. Issue escalated to logistics team for resolution.',
    recording: true
  },
  {
    id: '2',
    phoneNumber: '(234) 567-8901',
    name: 'Jane Smith',
    callDate: '2nd Oct, 2025',
    callingTime: '8:10 AM',
    disposition: 'No Answer',
    ringingTime: 8,
    duration: 0,
    company: 'dabur.com',
    agentScore: 0,
    transcript: null,
    summary: null,
    recording: false
  },
  {
    id: '3',
    phoneNumber: '(345) 678-9012',
    name: 'Robert Johnson',
    callDate: '2nd May, 2025',
    callingTime: '9:45 AM',
    disposition: 'Busy',
    ringingTime: 7,
    duration: 45,
    company: 'dabur.com',
    agentScore: 6.5,
    transcript: `Agent: Hello, this is Mike from Dabur Support.
Customer: Hi, I'm busy right now. Can you call back later?
Agent: Of course! What would be a better time for you?
Customer: Maybe around 2 PM today?
Agent: Perfect, I'll call you at 2 PM. Have a good day!
Customer: Thanks, bye.`,
    summary: 'Customer was busy, scheduled callback for 2 PM.',
    recording: true
  },
  {
    id: '4',
    phoneNumber: '(456) 789-0123',
    name: 'Emily Davis',
    callDate: '26th Jun, 2025',
    callingTime: '11:20 AM',
    disposition: 'Failed',
    ringingTime: 8,
    duration: 0,
    company: 'dabur.com',
    agentScore: 0,
    transcript: null,
    summary: 'Call failed due to network issues.',
    recording: false
  },
  {
    id: '5',
    phoneNumber: '(567) 890-1234',
    name: 'Michael Brown',
    callDate: '1st Aug, 2023',
    callingTime: '3:15 PM',
    disposition: 'Answered',
    ringingTime: 4,
    duration: 320,
    company: 'enterprise.com',
    agentScore: 9.2,
    transcript: `Agent: Good afternoon! This is Lisa from Enterprise Solutions. How are you today?
Customer: Hi Lisa, I'm doing well. I'm calling about upgrading our current plan.
Agent: That's wonderful! I'd be happy to help you with that. Can you tell me more about what you're looking for?
Customer: We need more user licenses and additional storage space.
Agent: Absolutely! Currently you're on our Business plan with 50 users. How many additional users do you need?
Customer: We're expanding and need about 25 more users.
Agent: Perfect! And for storage, you're currently using about 80% of your 1TB allocation. Would 2TB be sufficient?
Customer: Yes, that sounds perfect. What would be the cost difference?
Agent: Let me calculate that for you. The upgrade would be an additional $125 per month. This includes the 25 additional users and the storage upgrade.
Customer: That's reasonable. Can we implement this starting next month?
Agent: Absolutely! I'll process this upgrade to take effect on your next billing cycle. You'll receive a confirmation email within the hour.
Customer: Excellent! Thank you so much for your help.
Agent: You're very welcome! Is there anything else I can assist you with today?
Customer: No, that covers everything. Have a great day!
Agent: Thank you, you too!`,
    summary: 'Successful plan upgrade - added 25 users and increased storage to 2TB. Additional $125/month.',
    recording: true
  },
  {
    id: '6',
    phoneNumber: '(678) 901-2345',
    name: 'Sarah Wilson',
    callDate: '30th Jul, 2023',
    callingTime: '10:05 AM',
    disposition: 'Answered',
    ringingTime: 3,
    duration: 95,
    company: 'enterprise.com',
    agentScore: 7.8,
    transcript: `Agent: Hello, this is Tom from Enterprise Support. How can I help you?
Customer: Hi, I'm having trouble accessing my dashboard. It keeps showing an error message.
Agent: I'm sorry to hear that. Can you tell me what error message you're seeing?
Customer: It says "Authentication failed. Please try again."
Agent: I see. Let me check your account status. Can you confirm your email address?
Customer: Yes, it's sarah.wilson@enterprise.com
Agent: Thank you. I can see the issue. There was a recent password reset that didn't complete properly. I'm going to send you a new password reset link.
Customer: Okay, that sounds good.
Agent: You should receive the email within a few minutes. Please check your spam folder as well.
Customer: Got it, I'll check. Thank you for your help.
Agent: You're welcome! Please let us know if you have any other issues.`,
    summary: 'Authentication issue resolved with password reset link.',
    recording: true
  }
];

export const calculateChartData = (calls: Call[]): ChartData => {
  const sectionScores = [
    { section: 'Opening', score: 85 },
    { section: 'Discovery', score: 78 },
    { section: 'Presentation', score: 82 },
    { section: 'Objection Handling', score: 74 },
    { section: 'Closing', score: 89 }
  ];

  const classificationCounts = calls.reduce((acc, call) => {
    acc[call.classification] = (acc[call.classification] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const callClassification = [
    { name: 'Paid in Full', value: classificationCounts['Paid in Full'] || 0, color: '#22c55e' },
    { name: 'Partial Paid', value: classificationCounts['Partial Paid'] || 0, color: '#eab308' },
    { name: 'Overdue', value: classificationCounts['Overdue'] || 0, color: '#ef4444' }
  ];

  const avgSpeechRate = calls.length > 0 
    ? calls.reduce((sum, call) => sum + call.speechRate, 0) / calls.length 
    : 0;

  const avgTalkPercentage = calls.length > 0
    ? calls.reduce((sum, call) => sum + call.talkPercentage, 0) / calls.length
    : 0;

  const fatalCount = calls.filter(call => call.isFatal).length;

  return {
    sectionScores,
    callClassification,
    keyMetrics: {
      ptpPercentage: 68,
      rtpPercentage: 72,
      conversionRate: 45
    },
    averageSpeechRate: Math.round(avgSpeechRate),
    talkPercentage: {
      talk: Math.round(avgTalkPercentage),
      silence: Math.round(100 - avgTalkPercentage)
    },
    fatalCalls: {
      fatal: fatalCount,
      normal: calls.length - fatalCount
    }
  };
};