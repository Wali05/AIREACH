'use client';

import { useState, useEffect } from 'react';

interface Agent {
  id: string;
  name: string;
  description: string;
}

interface AiAgentSelectorProps {
  onSelect: (agentId: string) => void;
  selectedAgentId?: string;
}

export default function AiAgentSelector({ onSelect, selectedAgentId }: AiAgentSelectorProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | undefined>(selectedAgentId);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/vapi/agents');
        
        if (!response.ok) {
          throw new Error(`Error fetching agents: ${response.statusText}`);
        }
        
        const data = await response.json();
        setAgents(data.agents);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleSelect = (agentId: string) => {
    setSelected(agentId);
    onSelect(agentId);
  };

  if (loading) {
    return <div className="p-4 text-center">Loading AI agents...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded">
        Error loading AI agents: {error}
      </div>
    );
  }

  if (agents.length === 0) {
    return <div className="p-4 text-center">No AI agents available</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium">Select an AI Sales Agent</h3>
      
      <div className="space-y-4">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className={`p-4 border rounded-lg cursor-pointer transition ${
              selected === agent.id ? 'border-blue-500 bg-blue-50' : 'hover:border-gray-300'
            }`}
            onClick={() => handleSelect(agent.id)}
          >
            <div className="flex items-start">
              <input
                type="radio"
                id={`agent-${agent.id}`}
                name="agent"
                value={agent.id}
                checked={selected === agent.id}
                onChange={() => handleSelect(agent.id)}
                className="mt-1 mr-3"
              />
              <div>
                <label 
                  htmlFor={`agent-${agent.id}`}
                  className="block font-medium cursor-pointer"
                >
                  {agent.name}
                </label>
                <p className="text-gray-600 text-sm mt-1">{agent.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 