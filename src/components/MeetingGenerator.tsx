import { useState } from "react";
import { Calendar, Clock, Shield, Copy, Share2, QrCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface MeetingLink {
  id: string;
  name: string;
  url: string;
  createdAt: string;
  expiresAt: string;
  securityEnabled: boolean;
  password?: string;
}

export function MeetingGenerator() {
  const [meetingName, setMeetingName] = useState("");
  const [duration, setDuration] = useState("60");
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [generatedLinks, setGeneratedLinks] = useState<MeetingLink[]>([]);
  const { toast } = useToast();

  const generateMeeting = () => {
    if (!meetingName.trim()) {
      toast({
        title: "Meeting name required",
        description: "Please enter a name for your meeting.",
        variant: "destructive",
      });
      return;
    }

    const meetingId = Math.random().toString(36).substr(2, 9);
    const password = securityEnabled ? Math.random().toString(36).substr(2, 6) : undefined;
    
    const newMeeting: MeetingLink = {
      id: meetingId,
      name: meetingName,
      url: `https://sales-ai.meeting.app/join/${meetingId}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + parseInt(duration) * 60 * 1000).toISOString(),
      securityEnabled,
      password,
    };

    setGeneratedLinks(prev => [newMeeting, ...prev]);
    setMeetingName("");
    
    toast({
      title: "Meeting link generated",
      description: "Your AI-powered meeting link is ready to share.",
    });
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
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">AI</span>
            </div>
            Generate AI Meeting Link
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="meeting-name">Meeting Name</Label>
                <Input
                  id="meeting-name"
                  value={meetingName}
                  onChange={(e) => setMeetingName(e.target.value)}
                  placeholder="e.g., Product Demo with ABC Corp"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <select
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:ring-2 focus:ring-primary"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security">Security Protection</Label>
                  <p className="text-sm text-muted-foreground">Require password to join</p>
                </div>
                <Switch
                  id="security"
                  checked={securityEnabled}
                  onCheckedChange={setSecurityEnabled}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-secondary rounded-lg">
                <h4 className="font-medium text-foreground mb-2">AI Features Included</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Real-time conversation analysis</li>
                  <li>• Intelligent response suggestions</li>
                  <li>• Automated meeting notes</li>
                  <li>• Objection handling prompts</li>
                  <li>• Follow-up recommendations</li>
                </ul>
              </div>
              
              <Button 
                onClick={generateMeeting}
                variant="premium"
                size="lg"
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Generate Meeting Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

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
                      {meeting.securityEnabled && (
                        <Shield className="h-4 w-4 text-accent" />
                      )}
                    </div>
                    
                    <div className="font-mono text-sm bg-secondary p-2 rounded border">
                      {meeting.url}
                    </div>
                    
                    {meeting.password && (
                      <div className="text-sm text-muted-foreground">
                        Password: <span className="font-mono bg-secondary px-1 rounded">{meeting.password}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created: {formatDateTime(meeting.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Expires: {formatDateTime(meeting.expiresAt)}</span>
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
                    
                    <Button variant="default" size="sm">
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