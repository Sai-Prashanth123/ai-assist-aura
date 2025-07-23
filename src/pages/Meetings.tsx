import { useState } from "react";
import { Layout } from "@/components/Layout";
import { MeetingGenerator } from "@/components/MeetingGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Video, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Search,
  Play,
  MoreHorizontal,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Meeting {
  id: string;
  title: string;
  client: string;
  date: string;
  duration: number;
  status: 'completed' | 'scheduled' | 'in-progress' | 'cancelled';
  aiScore: number;
  participants: number;
  recording?: string;
  notes?: string;
}

const mockMeetings: Meeting[] = [
  {
    id: '1',
    title: 'Product Demo - ABC Corp',
    client: 'ABC Corporation',
    date: '2024-01-22T14:00:00Z',
    duration: 45,
    status: 'completed',
    aiScore: 92,
    participants: 3,
    recording: 'recording-abc-corp.mp4',
    notes: 'Great interest in API integration features. Follow up on pricing for enterprise plan.'
  },
  {
    id: '2',
    title: 'Discovery Call - Tech Startup',
    client: 'InnovateTech Solutions',
    date: '2024-01-22T16:30:00Z',
    duration: 30,
    status: 'in-progress',
    aiScore: 0,
    participants: 2,
  },
  {
    id: '3',
    title: 'Contract Review - Enterprise Co',
    client: 'Enterprise Solutions Ltd',
    date: '2024-01-23T10:00:00Z',
    duration: 60,
    status: 'scheduled',
    aiScore: 0,
    participants: 4,
  },
  {
    id: '4',
    title: 'Follow-up Call - RetailMax',
    client: 'RetailMax Inc',
    date: '2024-01-20T13:00:00Z',
    duration: 25,
    status: 'completed',
    aiScore: 88,
    participants: 2,
    recording: 'recording-retailmax.mp4',
    notes: 'Addressed implementation timeline concerns. Scheduling technical demo next week.'
  }
];



export default function Meetings() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredMeetings = mockMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || meeting.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-accent text-accent-foreground';
      case 'scheduled': return 'bg-primary text-primary-foreground';
      case 'in-progress': return 'bg-warning text-warning-foreground';
      case 'cancelled': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in-progress': return Play;
      case 'cancelled': return AlertCircle;
      default: return Calendar;
    }
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 90) return 'text-accent';
    if (score >= 75) return 'text-warning';
    return 'text-muted-foreground';
  };

  return (
    <Layout>
      <div className="space-y-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meetings</h1>
            <p className="text-muted-foreground">AI-powered meeting management and analytics</p>
          </div>
          
        </div>

        {/* Create New Meeting Section */}
        <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Schedule New Meeting</CardTitle>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">Create and share meeting links instantly</p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span>Quick setup</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <MeetingGenerator />
          </CardContent>
        </Card>

        {/* Meeting History Section */}
        <div className="space-y-6 bg-background/50 rounded-xl p-6 border border-border/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Recent Meetings</h2>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-48"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
                <option value="in-progress">In Progress</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Meetings List */}
          <div className="space-y-4">
            {filteredMeetings.map((meeting) => {
              const StatusIcon = getStatusIcon(meeting.status);
              
                              return (
                  <Card key={meeting.id} className="hover:shadow-lg transition-smooth border border-border/50 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-medium text-foreground text-lg">{meeting.title}</h3>
                            <Badge variant="secondary" className={cn("text-xs", getStatusColor(meeting.status))}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {meeting.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{meeting.client}</span>
                            <span>•</span>
                            <span>{formatDate(meeting.date)}</span>
                            <span>•</span>
                            <span>{meeting.duration} min</span>
                            {meeting.status === 'completed' && meeting.aiScore > 0 && (
                              <>
                                <span>•</span>
                                <span className={cn("font-medium", getAIScoreColor(meeting.aiScore))}>
                                  AI Score: {meeting.aiScore}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {meeting.status === 'scheduled' && (
                            <Button size="sm" variant="default">
                              <Video className="h-3 w-3 mr-1" />
                              Join
                            </Button>
                          )}
                          
                          {meeting.recording && (
                            <Button size="sm" variant="outline">
                              <Play className="h-3 w-3 mr-1" />
                              Recording
                            </Button>
                          )}
                          
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
            })}
            
            {filteredMeetings.length === 0 && (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Video className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-3">No meetings found</h3>
                <p className="text-muted-foreground text-lg">
                  {searchTerm || statusFilter !== "all" ? "Try adjusting your search or filters" : "Create your first meeting to get started"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}