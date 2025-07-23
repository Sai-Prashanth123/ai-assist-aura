import { useState } from "react";
import { Calendar, Clock, Copy, Share2, QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface MeetingLink {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  scheduledAt?: string;
}

export function MeetingGenerator() {
  const [meetingName, setMeetingName] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [meetingTime, setMeetingTime] = useState("");
  const [generatedLinks, setGeneratedLinks] = useState<MeetingLink[]>([]);
  const { toast } = useToast();

  const generateMeeting = async () => {
    if (!meetingName.trim()) {
      toast({
        title: "Meeting name required",
        description: "Please enter a name for your meeting.",
        variant: "destructive",
      });
      return;
    }

    if (!meetingDate || !meetingTime) {
      toast({
        title: "Date and time required",
        description: "Please select both date and time for your meeting.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meeting_name: meetingName,
          host_name: "Host User", // You can get this from authentication context
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }

      const data = await response.json();
      const scheduledDateTime = new Date(`${meetingDate}T${meetingTime}`);
      
      const newMeeting: MeetingLink = {
        id: data.meeting_id,
        name: data.meeting_name,
        url: `${window.location.origin}/meeting/${data.meeting_id}`,
        createdAt: data.created_at,
        expiresAt: new Date(scheduledDateTime.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        scheduledAt: scheduledDateTime.toISOString(),
      };

      setGeneratedLinks(prev => [newMeeting, ...prev]);
      setMeetingName("");
      setMeetingDate("");
      setMeetingTime("");
      
      toast({
        title: "Meeting created successfully",
        description: `Meeting "${data.meeting_name}" scheduled for ${scheduledDateTime.toLocaleDateString()} at ${scheduledDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      });
    } catch (error) {
      console.error("Error creating meeting:", error);
      toast({
        title: "Failed to create meeting",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Meeting link has been copied.",
    });
  };

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <Label htmlFor="meeting-name">Meeting Name</Label>
          <Input
            id="meeting-name"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
            placeholder="e.g., Product Demo with ABC Corp"
            className="mt-1"
          />
        </div>
        
        <div className="lg:col-span-1">
          <Label htmlFor="meeting-date">Date</Label>
          <Input
            id="meeting-date"
            type="date"
            value={meetingDate}
            onChange={(e) => setMeetingDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="mt-1"
          />
        </div>
        
        <div className="lg:col-span-1">
          <Label htmlFor="meeting-time">Time</Label>
          <Input
            id="meeting-time"
            type="time"
            value={meetingTime}
            onChange={(e) => setMeetingTime(e.target.value)}
            className="mt-1"
          />
        </div>
        
        <div className="lg:col-span-1 flex items-end">
          <Button 
            onClick={generateMeeting}
            variant="default"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      {generatedLinks.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Recent Meeting Links</h3>
          
          {generatedLinks.map((meeting) => (
            <Card key={meeting.id} className="shadow-subtle">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-foreground">{meeting.name}</h4>
                    </div>
                    
                    <div className="font-mono text-sm bg-secondary p-2 rounded border">
                      {meeting.url}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {meeting.scheduledAt && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span className="font-medium text-foreground">
                            Scheduled: {new Date(meeting.scheduledAt).toLocaleDateString()} at {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Created: {formatDateTime(meeting.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(meeting.url)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <QrCode className="h-3 w-3" />
                    </Button>
                    
                    <Button variant="outline" size="sm">
                      <Share2 className="h-3 w-3" />
                    </Button>
                    
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => window.open(meeting.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}