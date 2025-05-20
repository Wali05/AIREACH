'use client';

import { useState, useEffect } from 'react';
import { CirclePlus, Search, Info } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Agent {
  id: string;
  name: string;
  description: string;
  firstMessage: string;
  systemPrompt: string;
  isSelected?: boolean;
}

export default function AIAgentsPage() {
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        // Fetch agents from your Vapi API
        const response = await fetch('/api/vapi/agents');
        
        if (!response.ok) {
          throw new Error(`Error fetching agents: ${response.statusText}`);
        }
        
        const data = await response.json();
        if (Array.isArray(data.agents) && data.agents.length > 0) {
          setAgents(data.agents);
          setSelectedAgent(data.agents[0]);
        } else {
          // Mock data for development if API returns empty array
          const mockAgents = [
            {
              id: '1',
              name: 'Test AI',
              description: 'A test AI assistant for development',
              firstMessage: 'Hi there, this is Test AI from customer support. How can I help you today?',
              systemPrompt: '# Lead Qualification & Nurturing Agent Prompt\n\n## Identity & Purpose\n\nYou are Morgan, a business development voice assistant for GrowthPartners, a B2B software solutions provider. Your primary purpose is to identify qualified leads, understand their business challenges, and connect them with the appropriate sales representatives for solutions that match their needs.'
            },
            {
              id: '2',
              name: 'Jenny',
              description: 'Sales assistant for webinars',
              firstMessage: 'Hello! I\'m Jenny, your sales assistant. How may I assist you today?',
              systemPrompt: '# Sales Assistant Prompt\n\nYou are Jenny, a friendly sales assistant focused on helping customers find the right solutions.'
            },
            {
              id: '3',
              name: 'Real Assistant',
              description: 'General purpose AI assistant',
              firstMessage: 'Welcome! How can I assist you today?',
              systemPrompt: 'You are a helpful assistant.'
            }
          ];
          setAgents(mockAgents);
          setSelectedAgent(mockAgents[0]);
        }
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-[#111014] text-white min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">AI Agents</h1>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white">
          <CirclePlus className="mr-2 h-4 w-4" />
          Create Assistant
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left sidebar with agent list */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search Assistants"
              className="bg-[#18171c] border-none pl-9 text-white placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            {loading ? (
              <div className="p-4 text-center">Loading AI agents...</div>
            ) : filteredAgents.length === 0 ? (
              <div className="p-4 text-center">No agents found</div>
            ) : (
              filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedAgent?.id === agent.id
                      ? 'bg-[#23222a] border-l-2 border-violet-500'
                      : 'bg-[#18171c] hover:bg-[#23222a]'
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <h3 className="font-medium">{agent.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{agent.description}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right panel with agent details */}
        <div className="col-span-2">
          {selectedAgent ? (
            <Card className="p-6 bg-[#18171c] border-none">
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-semibold">Model</h2>
                  <p className="text-gray-400 text-sm mt-1">Configure the behavior of the assistant</p>
                </div>
                <Button variant="outline" className="border-gray-700 bg-[#23222a] text-white hover:bg-[#2a2930] hover:text-white">
                  Update Assistant
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium">First Message</h3>
                    <Info className="h-4 w-4 ml-2 text-gray-400" />
                  </div>
                  <Input 
                    className="bg-[#23222a] border-none text-white"
                    value={selectedAgent.firstMessage}
                    readOnly
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <h3 className="font-medium">System Prompt</h3>
                    <Info className="h-4 w-4 ml-2 text-gray-400" />
                  </div>
                  <div className="bg-[#23222a] rounded-md p-4 font-mono text-sm text-gray-300 h-[300px] overflow-y-auto whitespace-pre-wrap">
                    {selectedAgent.systemPrompt}
                  </div>
                </div>

                <Separator className="bg-gray-800" />
                
                <div className="flex justify-between items-center pt-2">
                  <h3 className="font-medium">Provider</h3>
                  <div className="flex items-center">
                    <span className="text-gray-400">Model</span>
                    <Info className="h-4 w-4 ml-2 text-gray-400" />
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select an agent to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 