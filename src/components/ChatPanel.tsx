'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

interface ChatPanelProps {
  sessionId: string;
}

// Type definition for the mock messages
interface MockMessage {
  id: string;
  text: string;
  user: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: Date;
}

export default function ChatPanel({ sessionId }: ChatPanelProps) {
  const { user: clerkUser } = useUser();
  const [chatClient, setChatClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // For mock implementation when API keys aren't available
  const [useMockChat, setUseMockChat] = useState(false);
  const [mockMessages, setMockMessages] = useState<MockMessage[]>([
    {
      id: '1',
      text: 'Welcome to the webinar chat!',
      user: { id: 'host', name: 'Host' },
      createdAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
    },
    {
      id: '2',
      text: 'How do I ask questions during the presentation?',
      user: { id: 'user1', name: 'John Doe' },
      createdAt: new Date(Date.now() - 1000 * 60 * 8) // 8 minutes ago
    },
    {
      id: '3',
      text: 'Just type your question in the chat and I\'ll answer during the Q&A section.',
      user: { id: 'host', name: 'Host' },
      createdAt: new Date(Date.now() - 1000 * 60 * 7) // 7 minutes ago
    },
    {
      id: '4',
      text: 'Thanks for the clarification!',
      user: { id: 'user1', name: 'John Doe' },
      createdAt: new Date(Date.now() - 1000 * 60 * 6) // 6 minutes ago
    },
    {
      id: '5',
      text: 'Is there a way to download the slides after the presentation?',
      user: { id: 'user2', name: 'Jane Smith' },
      createdAt: new Date(Date.now() - 1000 * 60 * 4) // 4 minutes ago
    },
    {
      id: '6',
      text: 'Yes, we\'ll send all attendees a follow-up email with the slides and recording.',
      user: { id: 'host', name: 'Host' },
      createdAt: new Date(Date.now() - 1000 * 60 * 3) // 3 minutes ago
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Only proceed if we have the user information
    if (!clerkUser?.id) return;

    // Initialize the Stream Chat client
    const initChat = async () => {
      try {
        setLoading(true);

        // Fetch token from our API
        const response = await fetch('/api/stream/chat-token');

        if (!response.ok) {
          // If API fails, fallback to mock implementation
          if (response.status === 500) {
            console.warn('Using mock chat implementation due to API error');
            setUseMockChat(true);
            setLoading(false);
            return;
          }
          throw new Error(`Failed to fetch chat token: ${response.statusText}`);
        }

        const { token } = await response.json();

        // Initialize Stream Chat client
        const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
        
        if (!apiKey) {
          console.warn('Stream API key not found, using mock implementation');
          setUseMockChat(true);
          setLoading(false);
          return;
        }

        const client = StreamChat.getInstance(apiKey);
        
        // Connect user
        await client.connectUser(
          {
            id: clerkUser.id,
            name: clerkUser.fullName || clerkUser.firstName || 'User',
            image: clerkUser.imageUrl
          },
          token
        );

        // Create and join a channel for this webinar
        const channel = client.channel('messaging', sessionId, {
          members: [clerkUser.id]
        });

        await channel.watch();
        
        setChatClient(client);
        setChannel(channel);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing chat:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize chat');
        setLoading(false);
        setUseMockChat(true);
      }
    };

    initChat();

    // Cleanup function
    return () => {
      if (chatClient) {
        chatClient.disconnectUser().then(() => {
          setChatClient(null);
          setChannel(null);
        });
      }
    };
  }, [clerkUser, sessionId]);

  // For mock implementation
  const handleMockSendMessage = () => {
    if (!newMessage.trim() || !clerkUser) return;
    
    const message: MockMessage = {
      id: `mock-${Date.now()}`,
      text: newMessage,
      user: {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || 'You',
        image: clerkUser.imageUrl
      },
      createdAt: new Date()
    };
    
    setMockMessages([...mockMessages, message]);
    setNewMessage('');
  };

  // Show loading state
  if (loading && !useMockChat) {
    return (
      <div className="border rounded-lg h-full flex items-center justify-center p-8 bg-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error && !useMockChat) {
    return (
      <div className="border rounded-lg h-full p-6 bg-white">
        <div className="p-4 bg-red-50 text-red-600 rounded">
          <h3 className="font-bold mb-2">Failed to connect to chat</h3>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // If using real StreamChat
  if (chatClient && channel && !useMockChat) {
    return (
      <div className="border rounded-lg h-full overflow-hidden">
        <Chat client={chatClient} theme="messaging light">
          <Channel channel={channel}>
            <Window>
              <ChannelHeader />
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </Channel>
        </Chat>
      </div>
    );
  }

  // Mock chat implementation as fallback
  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-full bg-white">
      <div className="bg-gray-100 p-3 border-b flex items-center">
        <div className="font-medium">Webinar Chat</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockMessages.map((message) => (
          <div 
            key={message.id} 
            className={`flex ${message.user.id === clerkUser?.id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] px-3 py-2 rounded-lg ${
                message.user.id === clerkUser?.id 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : message.user.id === 'host'
                    ? 'bg-green-100 text-gray-800 rounded-bl-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.user.id !== clerkUser?.id && (
                <div className="font-medium text-xs mb-1">
                  {message.user.name}
                  {message.user.id === 'host' && <span className="ml-1 text-green-700">(Host)</span>}
                </div>
              )}
              <p>{message.text}</p>
              <div className="text-xs opacity-70 mt-1 text-right">
                {new Intl.DateTimeFormat('en-US', { 
                  hour: 'numeric', 
                  minute: 'numeric'
                }).format(message.createdAt)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleMockSendMessage()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleMockSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
} 