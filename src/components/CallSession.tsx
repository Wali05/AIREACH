'use client';

import { useState, useCallback, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

interface CallSessionProps {
  agentId: string;
  onEnd: (transcript: string, durationSec: number) => void;
}

export default function CallSession({ agentId, onEnd }: CallSessionProps) {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'in-progress' | 'ended'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [vapiInstance, setVapiInstance] = useState<any>(null);
  const [call, setCall] = useState<any>(null);
  
  // Initialize Vapi client once
  useEffect(() => {
    const vapiKey = process.env.NEXT_PUBLIC_VAPI_KEY;
    if (!vapiKey) {
      setError('Vapi API key not configured');
      return;
    }
    
    try {
      const vapi = new Vapi(vapiKey);
      setVapiInstance(vapi);
    } catch (err) {
      console.error('Error initializing Vapi:', err);
      setError('Failed to initialize Vapi client');
    }
  }, []);
  
  const startCall = useCallback(() => {
    if (!vapiInstance) {
      setError('Vapi client not initialized');
      return;
    }
    
    try {
      setCallStatus('calling');
      setError(null);
      
      // Create a call using the Vapi SDK
      const newCall = vapiInstance.start({
        assistantId: agentId,
        recipientId: 'attendee-' + Date.now(),
        onSpeechStart: () => {
          setCallStatus('in-progress');
        },
        onCallEnd: (result: any) => {
          setCallStatus('ended');
          if (result && result.transcript) {
            // Calculate duration in seconds (might need adjustment based on actual API response)
            const durationSec = Math.floor(result.duration / 1000) || 0;
            onEnd(result.transcript, durationSec);
          } else {
            onEnd('Call ended without transcript', 0);
          }
        },
        onError: (err: Error) => {
          console.error('Call error:', err);
          setError(err.message || 'Error during call');
          setCallStatus('idle');
        }
      });
      
      setCall(newCall);
    } catch (err) {
      console.error('Error starting call:', err);
      setError(err instanceof Error ? err.message : 'Failed to start call');
      setCallStatus('idle');
    }
  }, [agentId, onEnd, vapiInstance]);
  
  const endCall = useCallback(() => {
    if (call) {
      try {
        call.stop();
        // The onCallEnd callback will handle status updates and transcript
      } catch (err) {
        console.error('Error ending call:', err);
        setError(err instanceof Error ? err.message : 'Failed to end call');
      }
    }
  }, [call]);
  
  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-medium mb-4">AI Agent Call</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex items-center mb-4">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          callStatus === 'idle' ? 'bg-gray-400' :
          callStatus === 'calling' ? 'bg-yellow-400 animate-pulse' :
          callStatus === 'in-progress' ? 'bg-green-500 animate-pulse' :
          'bg-blue-500'
        }`} />
        <span className="text-sm">
          {callStatus === 'idle' ? 'Ready to start' :
           callStatus === 'calling' ? 'Connecting...' :
           callStatus === 'in-progress' ? 'Call in progress' :
           'Call ended'}
        </span>
      </div>
      
      <div className="flex gap-3">
        {callStatus === 'idle' && (
          <button
            onClick={startCall}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            disabled={!vapiInstance}
          >
            Start Call
          </button>
        )}
        
        {(callStatus === 'calling' || callStatus === 'in-progress') && (
          <button
            onClick={endCall}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            End Call
          </button>
        )}
        
        {callStatus === 'ended' && (
          <button
            onClick={() => {
              setCallStatus('idle');
              setCall(null);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            New Call
          </button>
        )}
      </div>
    </div>
  );
} 