import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, Download, Search, Calendar, Play, FileText, Phone, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuth } from '@/hooks/useAuth';
import { mockCallLogs } from '@/data/mockData';

const Calls: React.FC = () => {
  const { user } = useAuth();
  const [selectedCall, setSelectedCall] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dispositionFilter, setDispositionFilter] = useState('all');
  const [dateRange, setDateRange] = useState('7d');

  // Filter calls based on user role and search criteria
  const filteredCalls = mockCallLogs.filter(call => {
    if (user?.role !== 'admin' && call.company !== user?.company) return false;
    if (searchTerm && !call.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !call.phoneNumber.includes(searchTerm)) return false;
    if (dispositionFilter !== 'all' && call.disposition !== dispositionFilter) return false;
    return true;
  });

  const getDispositionColor = (disposition: string) => {
    switch (disposition) {
      case 'Answered': return 'bg-success text-success-foreground';
      case 'No Answer': return 'bg-warning text-warning-foreground';
      case 'Busy': return 'bg-accent text-accent-foreground';
      case 'Failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return '-';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 bg-dashboard-bg">
      <div className="p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Call Logs</h1>
              <p className="text-muted-foreground">Detailed call analytics and transcripts</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Manage Fields
              </Button>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Filters</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select value={dispositionFilter} onValueChange={setDispositionFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All dispositions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All dispositions</SelectItem>
                    <SelectItem value="Answered">Answered</SelectItem>
                    <SelectItem value="No Answer">No Answer</SelectItem>
                    <SelectItem value="Busy">Busy</SelectItem>
                    <SelectItem value="Failed">Failed</SelectItem>
                  </SelectContent>
                </Select>

                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search phone or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call Logs Table */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Call Logs ({filteredCalls.length})</CardTitle>
                <Badge variant="secondary">{filteredCalls.length} records</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Phone Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Call Date</TableHead>
                    <TableHead>Calling Time</TableHead>
                    <TableHead>Call Disposition</TableHead>
                    <TableHead>Ringing Time</TableHead>
                    <TableHead>Call Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCalls.map((call) => (
                    <TableRow key={call.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{call.phoneNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          {call.name}
                        </div>
                      </TableCell>
                      <TableCell>{call.callDate}</TableCell>
                      <TableCell>{call.callingTime}</TableCell>
                      <TableCell>
                        <Badge className={getDispositionColor(call.disposition)}>
                          {call.disposition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          {call.ringingTime}s
                        </div>
                      </TableCell>
                      <TableCell>{formatDuration(call.duration)}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {call.transcript && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedCall(call)}
                            >
                              <FileText className="w-4 h-4" />
                            </Button>
                          )}
                          {call.recording && (
                            <Button variant="ghost" size="sm">
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Call Transcript Modal */}
          <Dialog open={!!selectedCall} onOpenChange={() => setSelectedCall(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  Call Transcript - {selectedCall?.name} ({selectedCall?.phoneNumber})
                </DialogTitle>
              </DialogHeader>
              {selectedCall && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Call Date</p>
                      <p className="text-sm text-muted-foreground">{selectedCall.callDate}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Duration</p>
                      <p className="text-sm text-muted-foreground">{formatDuration(selectedCall.duration)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Disposition</p>
                      <Badge className={getDispositionColor(selectedCall.disposition)}>
                        {selectedCall.disposition}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Agent Score</p>
                      <p className="text-sm text-muted-foreground">{selectedCall.agentScore}/10</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Transcript</h4>
                    <div className="p-4 bg-background border rounded-lg max-h-96 overflow-y-auto">
                      <div className="space-y-4">
                        {selectedCall.transcript?.split('\n').map((line, index) => (
                          <div key={index} className="space-y-1">
                            {line.includes('Agent:') && (
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                                <div>
                                  <p className="text-sm font-medium text-primary">Agent</p>
                                  <p className="text-sm">{line.replace('Agent:', '').trim()}</p>
                                </div>
                              </div>
                            )}
                            {line.includes('Customer:') && (
                              <div className="flex gap-3">
                                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                                <div>
                                  <p className="text-sm font-medium text-secondary">Customer</p>
                                  <p className="text-sm">{line.replace('Customer:', '').trim()}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedCall.summary && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Call Summary</h4>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm">{selectedCall.summary}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>
    </div>
  );
};

export default Calls;