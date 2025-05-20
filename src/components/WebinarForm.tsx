'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Webinar } from '@/lib/store';
import AiAgentSelector from './AiAgentSelector';

// Form validation schema
const formSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long'),
  description: z.string().min(10, 'Description must be at least 10 characters long'),
  status: z.enum(['draft', 'scheduled', 'live', 'ended']),
  hostName: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface WebinarFormProps {
  initialData?: Partial<Webinar>;
  onSubmit: (data: FormData & { agentId?: string }) => Promise<void>;
}

export default function WebinarForm({ initialData, onSubmit }: WebinarFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(
    initialData?.agentId
  );
    const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      status: initialData?.status || 'draft',
      hostName: initialData?.hostName || '',
    },
  });

  const handleFormSubmit = async (data: FormData) => {
    try {
      setSubmitting(true);
      // Include the selected agent ID with the form data
      await onSubmit({ ...data, agentId: selectedAgentId });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          id="title"
          type="text"
          {...register('title')}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />
        {errors.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          {...register('description')}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />
        {errors.description && (
          <p className="text-red-600 text-sm">{errors.description.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <label htmlFor="hostName" className="block text-sm font-medium">
          Host Name
        </label>
        <input
          id="hostName"
          type="text"
          {...register('hostName')}
          placeholder="Enter the name of the webinar host"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        />
        {errors.hostName && (
          <p className="text-red-600 text-sm">{errors.hostName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="status" className="block text-sm font-medium">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={submitting}
        >
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="live">Live</option>
          <option value="ended">Ended</option>
        </select>
        {errors.status && (
          <p className="text-red-600 text-sm">{errors.status.message}</p>
        )}
      </div>

      <div className="border-t pt-6 mt-6">
        <AiAgentSelector 
          onSelect={handleAgentSelect} 
          selectedAgentId={selectedAgentId}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border rounded hover:bg-gray-50"
          disabled={submitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-70"
          disabled={submitting}
        >
          {submitting ? 'Saving...' : 'Save Webinar'}
        </button>
      </div>
    </form>
  );
} 