import React from 'react';
import VideoPlayer from '@/components/VideoPlayer';
import ChatPanel from '@/components/ChatPanel';

export default function LiveWebinarPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Live Webinar</h1>
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h2 className="text-xl font-semibold mb-2">Video Stream</h2>
        <VideoPlayer sessionId={resolvedParams.id} />
        <h2 className="text-xl font-semibold mt-4 mb-2">Chat</h2>
        <ChatPanel sessionId={resolvedParams.id} />
      </div>
    </div>
  );
} 