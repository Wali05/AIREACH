'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';

interface Attendee {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'joined' | 'left';
  joinedAt: string | null;
  webinar: {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    status: 'draft' | 'scheduled' | 'live' | 'ended';
    hostedBy: {
      name: string;
      imageUrl: string;
    };
  };
}

export default function AttendWebinar() {
  const params = useParams();
  const router = useRouter();
  const webinarId = params.id as string;
  
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(false);

  // Fetch attendee details for this webinar
  useEffect(() => {
    async function fetchAttendee() {
      try {
        const response = await fetch(`/api/attendees/webinar/${webinarId}/attendee-details`);
        if (!response.ok) {
          throw new Error('Failed to fetch webinar data');
        }
        const data = await response.json();
        setAttendee(data);
      } catch (err) {
        setError('Could not load webinar details. Please try again.');
        console.error('Error fetching webinar data:', err);
      } finally {
        setLoading(false);
      }
    }

    if (webinarId) {
      fetchAttendee();
    }
  }, [webinarId]);

  // Join webinar when it's live
  useEffect(() => {
    async function joinWebinar() {
      if (attendee?.webinar.status === 'live' && !joined) {
        try {
          const response = await fetch(`/api/attendees/webinar/${webinarId}/join`, {
            method: 'POST',
          });
          
          if (response.ok) {
            setJoined(true);
            // Initialize Stream client here
            // This is a placeholder - you would need to implement the actual Stream client initialization
          } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to join webinar');
          }
        } catch (err) {
          setError('Error joining webinar. Please try again.');
          console.error('Error joining webinar:', err);
        }
      }
    }

    if (attendee && !joined) {
      joinWebinar();
    }
  }, [attendee, webinarId, joined]);

  // Leave webinar when navigating away
  useEffect(() => {
    return () => {
      if (joined && webinarId) {
        fetch(`/api/attendees/webinar/${webinarId}/leave`, {
          method: 'POST',
        }).catch(err => {
          console.error('Error leaving webinar:', err);
        });
      }
    };
  }, [joined, webinarId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <span className="ml-2 text-lg">Loading webinar...</span>
      </div>
    );
  }

  if (error || !attendee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-center mb-6">{error || 'Could not load webinar details'}</p>
        <button 
          onClick={() => router.push('/')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  const webinarStatus = attendee.webinar.status;
  const isLive = webinarStatus === 'live';
  const hasEnded = webinarStatus === 'ended';
  const scheduledDate = new Date(attendee.webinar.scheduledAt);

  // Pre-webinar waiting room
  if (!isLive && !hasEnded) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{attendee.webinar.title}</h1>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h2 className="text-lg font-semibold text-blue-800">Webinar starts soon</h2>
            <p className="text-blue-700">
              Scheduled for {scheduledDate.toLocaleDateString()} at {scheduledDate.toLocaleTimeString()}
            </p>
            <p className="mt-2 text-sm">This page will automatically update when the webinar goes live.</p>
          </div>
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">About this webinar</h2>
            <p className="text-gray-700">{attendee.webinar.description}</p>
          </div>
          
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
              {attendee.webinar.hostedBy.imageUrl && (
                <img 
                  src={attendee.webinar.hostedBy.imageUrl} 
                  alt={attendee.webinar.hostedBy.name}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="font-medium">Hosted by {attendee.webinar.hostedBy.name}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Webinar has ended
  if (hasEnded) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white rounded-lg shadow-md p-6 md:p-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">{attendee.webinar.title}</h1>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-6">
            <h2 className="text-lg font-semibold">This webinar has ended</h2>
            <p>Thank you for your interest. The webinar is no longer available.</p>
          </div>
          
          <button 
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  // Live webinar view
  return (
    <div className="flex flex-col h-screen">
      <div className="bg-indigo-600 py-3 px-4 flex items-center justify-between">
        <h1 className="text-white font-medium truncate">{attendee.webinar.title}</h1>
        <div className="flex items-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-1.5"></span>
            LIVE
          </span>
        </div>
      </div>
      
      <div className="flex-grow grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50">
        {/* Video content - Main area */}
        <div className="md:col-span-3 bg-black rounded-lg overflow-hidden flex items-center justify-center">
          {/* This is where Stream Video would be rendered */}
          <div className="text-center p-8">
            <p className="text-white">Connecting to live stream...</p>
          </div>
        </div>
        
        {/* Chat sidebar */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-3 border-b border-gray-200">
            <h2 className="font-medium">Live Chat</h2>
          </div>
          <div className="flex-grow p-4 overflow-y-auto">
            {/* Implement Stream Chat UI here */}
            <p className="text-gray-500 text-center text-sm">Chat messages will appear here</p>
          </div>
          <div className="border-t border-gray-200 p-3">
            <div className="flex">
              <input 
                type="text" 
                placeholder="Type a message..." 
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 