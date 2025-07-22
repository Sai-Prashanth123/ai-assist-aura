import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  Share, 
  Users, 
  MessageSquare,
  ThumbsUp,
  Clock,
  Brain,
  ArrowRight,
  Lightbulb,
  Target,
  AlertTriangle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestion {
  id: string;
  type: 'pricing' | 'feature' | 'objection' | 'closing';
  confidence: number;
  message: string;
  context: string;
  timestamp: string;
}

const mockSuggestions: AISuggestion[] = [
  {
    id: '1',
    type: 'pricing',
    confidence: 92,
    message: "Mention the 20% discount for annual subscriptions when they ask about pricing.",
    context: "Customer showing price sensitivity",
    timestamp: new Date().toISOString()
  },
  {
    id: '2',
    type: 'feature',
    confidence: 88,
    message: "Highlight the API integration capabilities - they mentioned needing to connect with their CRM.",
    context: "Integration requirements discussed",
    timestamp: new Date(Date.now() - 60000).toISOString()
  },
  {
    id: '3',
    type: 'objection',
    confidence: 95,
    message: "Address their concern about implementation time by sharing the ABC Corp case study.",
    context: "Implementation timeline concerns",
    timestamp: new Date(Date.now() - 120000).toISOString()
  }
];

export default function MeetingRoom() {
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [suggestions, setSuggestions] = useState<AISuggestion[]>(mockSuggestions);
  const [notes, setNotes] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'pricing': return Target;
      case 'feature': return Lightbulb;
      case 'objection': return AlertTriangle;
      case 'closing': return ThumbsUp;
      default: return MessageSquare;
    }
  };

  const getSuggestionColor = (type: string) => {
    switch (type) {
      case 'pricing': return 'bg-warning/10 text-warning border-warning/20';
      case 'feature': return 'bg-primary/10 text-primary border-primary/20';
      case 'objection': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'closing': return 'bg-accent/10 text-accent border-accent/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex gap-6">
        {/* Main Video Area */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Video Container */}
          <Card className="flex-1 shadow-strong relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-700 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
                {/* Main Speaker */}
                <div className="bg-slate-800 rounded-lg flex items-center justify-center relative col-span-2 lg:col-span-1">
                  <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-medium">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                    <span className="text-white text-sm font-medium">John Smith (You)</span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground">
                      <Brain className="h-3 w-3 mr-1" />
                      AI Active
                    </Badge>
                  </div>
                </div>
                
                {/* Client */}
                <div className="bg-slate-800 rounded-lg flex items-center justify-center relative">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg">
                    <span className="text-white text-sm font-medium">Sarah Johnson</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Meeting Controls */}
          <Card className="shadow-medium">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button
                    variant={isAudioOn ? "default" : "destructive"}
                    size="icon"
                    onClick={() => setIsAudioOn(!isAudioOn)}
                    className="rounded-full"
                  >
                    {isAudioOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant={isVideoOn ? "default" : "destructive"}
                    size="icon"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="rounded-full"
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                  
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>23:45</span>
                  </div>
                  
                  <Button variant="destructive" className="rounded-full">
                    <Phone className="h-4 w-4 mr-2" />
                    End Call
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions Sidebar */}
        {showSuggestions && (
          <div className="w-80 flex flex-col gap-4">
            <Card className="shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    AI Assistant
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSuggestions(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4 max-h-[60vh] overflow-y-auto">
                {suggestions.map((suggestion) => {
                  const Icon = getSuggestionIcon(suggestion.type);
                  
                  return (
                    <div
                      key={suggestion.id}
                      className="p-4 rounded-lg border transition-smooth hover:shadow-medium cursor-pointer glass"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                          getSuggestionColor(suggestion.type)
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="secondary" className="text-xs capitalize">
                              {suggestion.type}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <div className="w-2 h-2 bg-accent rounded-full"></div>
                              <span className="text-xs text-muted-foreground">
                                {suggestion.confidence}%
                              </span>
                            </div>
                          </div>
                          
                          <p className="text-sm text-foreground mb-2">
                            {suggestion.message}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {suggestion.context}
                            </span>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                              Use This
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Meeting Notes */}
            <Card className="flex-1 shadow-medium">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Meeting Notes
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add your meeting notes here..."
                  className="min-h-[200px] resize-none"
                />
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    Save Notes
                  </Button>
                  <Button variant="default" size="sm" className="flex-1">
                    AI Summary
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Collapsed Suggestions Trigger */}
        {!showSuggestions && (
          <Button
            variant="default"
            className="fixed right-4 top-1/2 transform -translate-y-1/2 rounded-full w-12 h-12 shadow-strong"
            onClick={() => setShowSuggestions(true)}
          >
            <Brain className="h-5 w-5" />
          </Button>
        )}
      </div>
    </Layout>
  );
}