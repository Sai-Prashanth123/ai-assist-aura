import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  Lightbulb, 
  MessageSquare, 
  Sparkles,
  X,
  Volume2,
  VolumeX,
  Settings,
  Minimize2,
  Maximize2,
  Mic
} from "lucide-react";

interface AISuggestion {
  type: "ai_suggestion";
  timestamp: string;
  speaker: string;
  trigger_text: string;
  suggestion: string;
  confidence: number;
}

interface Transcript {
  timestamp: string;
  speaker: string;
  text: string;
  confidence?: number;
}

interface AISuggestionsProps {
  meetingId: string;
  isHost?: boolean;
}

export function AISuggestions({ meetingId, isHost = false }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("suggestions");
  const wsRef = useRef<WebSocket | null>(null);
  const suggestionsEndRef = useRef<HTMLDivElement>(null);
  const transcriptsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest suggestion
  const scrollToBottomSuggestions = () => {
    suggestionsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToBottomTranscripts = () => {
    transcriptsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottomSuggestions();
  }, [suggestions]);

  useEffect(() => {
    scrollToBottomTranscripts();
  }, [transcripts]);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!isHost || !aiEnabled) return;

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`wss://backendgaap.azurewebsites.net:8765/${meetingId}`);
        wsRef.current = ws;

        ws.onopen = () => {
          console.log("AI Suggestions WebSocket connected");
          setIsConnected(true);
          // Send ping to maintain connection
          ws.send(JSON.stringify({ type: "ping" }));
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            
            if (data.type === "ai_suggestion") {
              setSuggestions(prev => [...prev, data]);
              
              // Play notification sound if not muted
              if (!isMuted) {
                playNotificationSound();
              }
            } else if (data.type === "transcript") {
              setTranscripts(prev => [...prev, data]);
            }
          } catch (error) {
            console.error("Error parsing WebSocket message:", error);
          }
        };

        ws.onclose = () => {
          console.log("AI Suggestions WebSocket disconnected");
          setIsConnected(false);
          
          // Attempt to reconnect after 3 seconds
          setTimeout(() => {
            if (aiEnabled) {
              connectWebSocket();
            }
          }, 3000);
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
          setIsConnected(false);
        };

      } catch (error) {
        console.error("Error connecting to WebSocket:", error);
      }
    };

    if (aiEnabled) {
      connectWebSocket();
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [meetingId, isHost, aiEnabled, isMuted]);

  const playNotificationSound = () => {
    // Create a subtle notification sound
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const startAI = async () => {
    try {
      const response = await fetch(`https://backendgaap.azurewebsites.net/api/meetings/${meetingId}/start-ai`, {
        method: "POST",
      });
      
      if (response.ok) {
        setAiEnabled(true);
      } else {
        console.error("Failed to start AI agent");
      }
    } catch (error) {
      console.error("Error starting AI agent:", error);
    }
  };

  const stopAI = async () => {
    try {
      await fetch(`https://backendgaap.azurewebsites.net/api/meetings/${meetingId}/stop-ai`, {
        method: "POST",
      });
      
      setAiEnabled(false);
      setIsConnected(false);
      
      if (wsRef.current) {
        wsRef.current.close();
      }
    } catch (error) {
      console.error("Error stopping AI agent:", error);
    }
  };

  const clearSuggestions = () => {
    setSuggestions([]);
    setTranscripts([]);
  };

  if (!isHost) {
    return null; // Only show to host
  }

  return (
    <Card className={`fixed right-4 top-20 w-80 bg-white shadow-lg border border-gray-200 z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-96'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
            {isConnected && (
              <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                Live
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMuted(!isMuted)}
              className="h-8 w-8 p-0"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8 p-0"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {!isMinimized && (
          <div className="flex gap-2 mt-2">
            {!aiEnabled ? (
              <Button 
                onClick={startAI} 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-1" />
                Start AI
              </Button>
            ) : (
              <Button 
                onClick={stopAI} 
                variant="outline" 
                size="sm"
              >
                Stop AI
              </Button>
            )}
            
            {suggestions.length > 0 && (
              <Button 
                onClick={clearSuggestions} 
                variant="ghost" 
                size="sm"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      {!isMinimized && (
        <CardContent className="p-3 pt-0">
          {!aiEnabled ? (
            <div className="text-center py-8 text-gray-500">
              <Bot className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Click "Start AI" to enable real-time suggestions</p>
            </div>
          ) : !isConnected ? (
            <div className="text-center py-8 text-gray-500">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm">Connecting to AI assistant...</p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggestions" className="flex items-center gap-1">
                  <Lightbulb className="h-4 w-4" />
                  Suggestions
                  {suggestions.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {suggestions.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="transcripts" className="flex items-center gap-1">
                  <Mic className="h-4 w-4" />
                  Transcripts
                  {transcripts.length > 0 && (
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {transcripts.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="suggestions" className="mt-3">
                <ScrollArea className="h-64">
                  <div className="space-y-3">
                    {suggestions.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No suggestions yet</p>
                        <p className="text-xs text-gray-400 mt-1">
                          AI will provide suggestions based on participant questions and discussion
                        </p>
                      </div>
                    ) : (
                      suggestions.map((suggestion, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2">
                            <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {suggestion.suggestion}
                              </p>
                              
                              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                <span>
                                  Triggered by: "{suggestion.trigger_text.slice(0, 30)}..."
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(suggestion.confidence * 100)}%
                                </Badge>
                              </div>
                              
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(suggestion.timestamp).toLocaleTimeString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={suggestionsEndRef} />
                  </div>
                </ScrollArea>
              </TabsContent>
              
              <TabsContent value="transcripts" className="mt-3">
                <ScrollArea className="h-64">
                  <div className="space-y-2">
                    {transcripts.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Mic className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">Listening for conversation...</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Real-time transcription will appear here
                        </p>
                      </div>
                    ) : (
                      transcripts.map((transcript, index) => (
                        <div 
                          key={index}
                          className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3"
                        >
                          <div className="flex items-start gap-2">
                            <Mic className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                                                             <div className="flex items-center justify-between mb-1">
                                 <span className="text-xs font-medium text-green-700">
                                   {transcript.speaker}
                                 </span>
                                <span className="text-xs text-gray-400">
                                  {new Date(transcript.timestamp).toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900">
                                {transcript.text}
                              </p>
                              {transcript.confidence && (
                                <Badge variant="outline" className="text-xs mt-2">
                                  {Math.round(transcript.confidence * 100)}% confidence
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={transcriptsEndRef} />
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      )}
    </Card>
  );
} 