'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  StreamVideo,
  useCall,
  CallControls,
  SpeakerLayout,
  StreamVideoClient,
  CallParticipantsList,
  useStreamVideoClient
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import HostWaitingScreen from './HostWaitingScreen';

interface VideoPlayerProps {
  sessionId: string;
  isHostActive?: boolean;
  webinarTitle?: string;
  scheduledTime?: string;
  hostName?: string;
}

export default function VideoPlayer({ 
  sessionId, 
  isHostActive = true, 
  webinarTitle = "Webinar",
  scheduledTime,
  hostName
}: VideoPlayerProps) {
  const { user } = useUser();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [callId, setCallId] = useState<string>('');
  const [callType, setCallType] = useState<string>('default');
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(true);
  useEffect(() => {
    if (!user?.id) return;

    const initializeVideo = async () => {
      try {
        setIsJoining(true);
        setError(null);
        
        // Fetch token from our API
        const response = await fetch('/api/stream/video-token', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to get video token: ${response.statusText}`);
        }
        
        const { token } = await response.json();
        
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        
        if (!apiKey) {
          throw new Error('Stream API key not configured');
        }
        
        // Initialize the Stream Video client
        const videoClient = new StreamVideoClient({
          apiKey,
          token,
          user: {
            id: user.id,
            name: user.fullName || user.firstName || 'User',
            image: user.imageUrl
          }
        });
        
        // Get the call (meeting)
        const webinarCallId = `webinar-${sessionId}`;
        const webinarCallType = 'default';
        
        setCallId(webinarCallId);
        setCallType(webinarCallType);
        
        // Create or join the call
        try {
          const currentCall = videoClient.call(webinarCallType, webinarCallId);
          
          // Try to get the call or create it if it doesn't exist
          await currentCall.getOrCreate({
            data: {
              starts_at: new Date().toISOString(),
              custom: {
                webinarId: sessionId
              }
            }
          });
          
          // Join the call
          await currentCall.join({ create: true });
          
          setClient(videoClient);
          setIsJoining(false);
        } catch (err) {
          console.error('Failed to create or join call:', err);
          setError(err instanceof Error ? err.message : 'Failed to join video call');
          setIsJoining(false);
        }
      } catch (err) {
        console.error('Error setting up video:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize video');
        setIsJoining(false);
      }
    };
    
    // Only initialize video if the host is active
    if (isHostActive) {
      initializeVideo();
    }
    
    // Cleanup function
    return () => {
      const currentClient = client;
      const currentCallId = callId;
      const currentCallType = callType;
      
      if (currentClient && currentCallId && currentCallType) {
        // Get the call and leave it
        const call = currentClient.call(currentCallType, currentCallId);
        if (call) {
          call.leave().catch(console.error);
        }
        // Disconnect the client
        currentClient.disconnectUser().catch(console.error);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, user, isHostActive]);
  // Show the host waiting screen if the host isn't active yet
  if (!isHostActive) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-900 aspect-video">
        <HostWaitingScreen 
          webinarTitle={webinarTitle} 
          scheduledTime={scheduledTime}
          hostName={hostName} 
        />
      </div>
    );
  }

  // Show loading state
  if (isJoining) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center aspect-video">
        <div className="flex flex-col items-center text-white">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p>Connecting to video session...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !client) {
    return (
      <div className="border rounded-lg overflow-hidden bg-gray-900 flex items-center justify-center aspect-video">
        <div className="bg-red-800 p-4 rounded-lg max-w-md text-white">
          <h3 className="font-bold mb-2">Failed to connect to video</h3>
          <p className="text-sm mb-4">{error || 'Video connection failed'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-white text-red-800 rounded hover:bg-gray-100"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // When we have a client, we can render the video UI
  return (
    <div className="border rounded-lg overflow-hidden bg-gray-900">
      <StreamVideo client={client}>
        <StreamCallContent callId={callId} callType={callType} />
      </StreamVideo>
    </div>
  );
}

// Separate component for call content
// We need to pass callId and callType props to match the parent component's expectations,
// but we don't actually use them directly as we use the useCall hook
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StreamCallContent(_props: { callId: string; callType: string }) {
  const call = useCall();

  if (!call) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <p>Connecting to call...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <SpeakerLayout />
      </div>
      <div className="bg-gray-800 p-3">
        <CallControls />
      </div>
      <div className="bg-gray-800 border-t border-gray-700 p-3">
        <CallParticipantsList onClose={() => {}} />
      </div>
    </div>
  );
}