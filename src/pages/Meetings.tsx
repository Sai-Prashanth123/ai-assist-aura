import { useState } from "react";
import { Layout } from "@/components/Layout";
import { MeetingGenerator } from "@/components/MeetingGenerator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Video, 
  Calendar, 
  Clock, 
  Users, 
  TrendingUp, 
  Search,
  Filter,
  Play,
  Download,
  Share2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Calendar as CalendarIcon
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

const stats = [
  { label: "Total Meetings", value: "47", icon: Video, trend: "+12%" },
  { label: "Avg AI Score", value: "89%", icon: TrendingUp, trend: "+5%" },
  { label: "Success Rate", value: "94%", icon: CheckCircle, trend: "+2%" },
  { label: "This Week", value: "8", icon: CalendarIcon, trend: "+3" },
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Meetings</h1>
            <p className="text-muted-foreground">AI-powered meeting management and analytics</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="shadow-subtle hover:shadow-medium transition-smooth">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <span className="text-sm text-accent font-medium">{stat.trend}</span>
                    </div>
                  </div>
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="meetings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="meetings">Meeting History</TabsTrigger>
            <TabsTrigger value="create">Create Meeting</TabsTrigger>
          </TabsList>

          <TabsContent value="meetings" className="space-y-6">
            {/* Filters */}
            <Card className="shadow-subtle">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search meetings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Meetings List */}
            <div className="space-y-4">
              {filteredMeetings.map((meeting) => {
                const StatusIcon = getStatusIcon(meeting.status);
                
                return (
                  <Card key={meeting.id} className="shadow-subtle hover:shadow-medium transition-smooth">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-foreground text-lg">{meeting.title}</h3>
                              <p className="text-muted-foreground">{meeting.client}</p>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Badge className={cn("flex items-center gap-1", getStatusColor(meeting.status))}>
                                <StatusIcon className="h-3 w-3" />
                                {meeting.status}
                              </Badge>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(meeting.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{meeting.duration} min</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{meeting.participants} participants</span>
                            </div>
                            
                            {meeting.status === 'completed' && (
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span className={cn("font-medium", getAIScoreColor(meeting.aiScore))}>
                                  AI Score: {meeting.aiScore}%
                                </span>
                              </div>
                            )}
                          </div>

                          {meeting.notes && (
                            <p className="text-sm text-foreground bg-secondary p-3 rounded-lg">
                              {meeting.notes}
                            </p>
                          )}

                          <div className="flex gap-2">
                            {meeting.status === 'scheduled' && (
                              <Button size="sm" variant="default">
                                <Video className="h-3 w-3 mr-1" />
                                Join Meeting
                              </Button>
                            )}
                            
                            {meeting.recording && (
                              <Button size="sm" variant="outline">
                                <Play className="h-3 w-3 mr-1" />
                                View Recording
                              </Button>
                            )}
                            
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3 mr-1" />
                              Export
                            </Button>
                            
                            <Button size="sm" variant="outline">
                              <Share2 className="h-3 w-3 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="create">
            <Card className="shadow-medium">
              <CardHeader>
                <CardTitle>Create New AI-Powered Meeting</CardTitle>
              </CardHeader>
              <CardContent>
                <MeetingGenerator />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}