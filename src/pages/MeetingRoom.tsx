import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  LiveKitRoom, 
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { Room, RoomOptions, VideoPresets } from "livekit-client";
import "@livekit/components-styles";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AISuggestions } from "@/components/AISuggestions";
import { 
  Users,
  MessageSquare,
  Settings,
  MoreVertical,
  Info,
  Shield
} from "lucide-react";

// API Configuration
const API_BASE_URL = "https://backendgaap.azurewebsites.net";

interface MeetingInfo {
  meeting_id: string;
  meeting_name: string;
  host_name: string;
  participant_count: number;
}

export default function MeetingRoom() {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [livekitUrl, setLivekitUrl] = useState<string>("");
  const [participantName, setParticipantName] = useState<string>("");
  const [meetingInfo, setMeetingInfo] = useState<MeetingInfo | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isPreJoinComplete, setIsPreJoinComplete] = useState(false);
  const [error, setError] = useState<string>("");
  const [isHost, setIsHost] = useState<boolean>(false);

  // Fetch meeting information
  useEffect(() => {
    const fetchMeetingInfo = async () => {
      if (!meetingId) return;
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}`);
        if (!response.ok) {
          throw new Error("Meeting not found");
        }
        const data = await response.json();
        setMeetingInfo(data);
      } catch (error) {
        setError("Failed to load meeting information");
        console.error("Error fetching meeting:", error);
      }
    };

    fetchMeetingInfo();
  }, [meetingId]);

  // Fetch LiveKit configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/config`);
        const config = await response.json();
        setLivekitUrl(config.livekit_url);
      } catch (error) {
        console.error("Error fetching config:", error);
      }
    };

    fetchConfig();
  }, []);

  const handleJoinMeeting = async () => {
    if (!participantName.trim() || !meetingId) return;

    setIsJoining(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/meetings/${meetingId}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participant_name: participantName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to join meeting");
      }

      const data = await response.json();
      setToken(data.token);
      setIsPreJoinComplete(true);
      
      // Determine if this user is the host (simple check - first to join or host name match)
      const isHostUser = meetingInfo?.host_name === participantName || 
                        meetingInfo?.participant_count === 0;
      setIsHost(isHostUser);
      
    } catch (error) {
      setError("Failed to join meeting. Please try again.");
      console.error("Error joining meeting:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const onLeave = useCallback(() => {
    navigate("/meetings");
  }, [navigate]);

  // Improved room options for better camera compatibility
  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
    // Remove hard-coded video settings to allow auto-detection
    videoCaptureDefaults: {
      resolution: VideoPresets.h720.resolution,
    },
    audioCaptureDefaults: {
      autoGainControl: true,
      echoCancellation: true,
      noiseSuppression: true,
    },
    // Enable automatic video quality adjustment
    publishDefaults: {
      videoSimulcastLayers: [VideoPresets.h180, VideoPresets.h360, VideoPresets.h720],
    },
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Info className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => navigate("/meetings")} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3"
            >
              Back to Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!meetingInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading meeting...</p>
        </div>
      </div>
    );
  }

  if (!isPreJoinComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Ready to join?
              </h1>
              <p className="text-gray-600 text-sm">
                "{meetingInfo.meeting_name}"
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Hosted by {meetingInfo.host_name} • {meetingInfo.participant_count} participants
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="participant-name" className="text-sm font-medium text-gray-700">
                  Your name
                </Label>
                <Input
                  id="participant-name"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => navigate("/meetings")}
                  variant="outline"
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full py-3"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleJoinMeeting}
                  disabled={!participantName.trim() || isJoining}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3"
                >
                  {isJoining ? "Joining..." : "Join now"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!token || !livekitUrl) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Connecting to meeting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <LiveKitRoom
        token={token}
        serverUrl={livekitUrl}
        options={roomOptions}
        onDisconnected={onLeave}
        className="h-screen"
        // Add connection error handling
        onError={(error) => {
          console.error("LiveKit connection error:", error);
          setError("Failed to connect to video call. Please check your camera and microphone permissions.");
        }}
      >
        <div className="h-full flex flex-col bg-white">
          {/* Google Meet Style Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">M</span>
                  </div>
                  <div>
                    <h1 className="text-lg font-medium text-gray-900">
                      {meetingInfo.meeting_name}
                    </h1>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Live</span>
                      </div>
                      <span>•</span>
                      <span>{meetingInfo.participant_count} participants</span>
                      {isHost && (
                        <>
                          <span>•</span>
                          <span className="text-blue-600 font-medium">Host</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2 h-10 w-10"
                >
                  <Info className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2 h-10 w-10"
                >
                  <Users className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2 h-10 w-10"
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2 h-10 w-10"
                >
                  <Shield className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-gray-600 hover:bg-gray-100 rounded-full p-2 h-10 w-10"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Video Conference Area with Google Meet styling */}
          <div className="flex-1 bg-gray-50" style={{ 
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)' 
          }}>
            <VideoConference 
              chatMessageFormatter={undefined}
              style={{
                '--lk-bg': '#f8fafc',
                '--lk-fg': '#1f2937',
                '--lk-accent': '#3b82f6',
              } as React.CSSProperties}
            />
            <RoomAudioRenderer />
          </div>
        </div>
      </LiveKitRoom>
      
      {/* AI Suggestions Panel - Only visible to host */}
      {meetingId && (
        <AISuggestions 
          meetingId={meetingId} 
          isHost={isHost}
        />
      )}
    </div>
  );
}