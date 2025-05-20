'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { ChevronLeft, Save } from 'lucide-react';
import { AiAgentSelector } from '../../../../../../components';

// Form schema
const WebinarSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  scheduledDate: z.string().min(1, "Date is required"),
  scheduledTime: z.string().min(1, "Time is required"),
  duration: z.number().min(15, "Duration must be at least 15 minutes"),
  isPublic: z.boolean(),
  agentId: z.string().min(1, "You must select an AI Agent"),
  status: z.enum(['draft', 'scheduled', 'live', 'ended']),
});

type WebinarFormValues = z.infer<typeof WebinarSchema>;

interface Webinar {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended';
  hostId: string;
  agentId: string | null;
  createdAt: string;
}

// Define page props with optional searchParams to match App Router signature
type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] };
}

export default function EditWebinar({ params, searchParams }: PageProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [webinarData, setWebinarData] = useState<Webinar | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(null);
  
  // Initialize form with default values
  const form = useForm<WebinarFormValues>({
    resolver: zodResolver(WebinarSchema),
    defaultValues: {
      title: '',
      description: '',
      scheduledDate: format(new Date(), 'yyyy-MM-dd'),
      scheduledTime: '12:00',
      duration: 60,
      isPublic: false,
      agentId: '',
      status: 'draft',
    },
  });
  
  // Fetch webinar data
  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        // In a real app, this would be an API call
        // const response = await fetch(`/api/webinars/${params.id}`);
        // const data = await response.json();
        
        // Mock data for now
        setTimeout(() => {
          const mockData = {
            id: params.id,
            title: 'Advanced Customer Engagement Tactics',
            description: 'Leverage AI to improve customer engagement during live webinars. Learn practical techniques that can be implemented immediately.',
            status: 'scheduled' as const,
            hostId: 'user123',
            agentId: 'agent456',
            createdAt: new Date(Date.now() + 86400000 * 5).toISOString(), // 5 days from now
          };
          
          setWebinarData(mockData);
          
          // Set form values
          const createdDate = new Date(mockData.createdAt);
          
          form.reset({
            title: mockData.title,
            description: mockData.description,
            scheduledDate: format(createdDate, 'yyyy-MM-dd'),
            scheduledTime: format(createdDate, 'HH:mm'),
            duration: 60, // This would come from the API
            isPublic: true, // This would come from the API
            agentId: mockData.agentId || '',
            status: mockData.status,
          });
          
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching webinar:', error);
        setIsLoading(false);
      }
    };

    fetchWebinar();
  }, [params.id, form]);

  // Handle form submission
  const onSubmit = async (data: WebinarFormValues) => {
    setIsSaving(true);
    try {
      // Format date and time
      const scheduledAt = new Date(`${data.scheduledDate}T${data.scheduledTime}`);
      
      const updateData = {
        title: data.title,
        description: data.description,
        scheduledAt: scheduledAt.toISOString(),
        duration: data.duration,
        isPublic: data.isPublic,
        agentId: data.agentId,
        status: data.status,
      };

      // In a real app, this would be an API call
      // await fetch(`/api/webinars/${params.id}`, {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updateData),
      // });
      
      // Mock successful response
      console.log('Webinar update data:', updateData);
      
      // Redirect to webinar details page after a brief delay (simulating API call)
      setTimeout(() => {
        setIsSaving(false);
        router.push(`/dashboard/webinars/${params.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error updating webinar:', error);
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-2">Loading webinar...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-8">
        <Link href={`/dashboard/webinars/${params.id}`} className="mr-4 text-gray-500 hover:text-gray-700">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Webinar</h1>
          <p className="mt-1 text-sm text-gray-600">
            Update your webinar details, schedule, or AI agent
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  form.formState.errors.title ? 'border-red-500' : ''
                }`}
                {...form.register('title')}
              />
              {form.formState.errors.title && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  form.formState.errors.description ? 'border-red-500' : ''
                }`}
                {...form.register('description')}
              ></textarea>
              {form.formState.errors.description && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.description.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    form.formState.errors.scheduledDate ? 'border-red-500' : ''
                  }`}
                  {...form.register('scheduledDate')}
                />
                {form.formState.errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.scheduledDate.message}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
                  Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="scheduledTime"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                    form.formState.errors.scheduledTime ? 'border-red-500' : ''
                  }`}
                  {...form.register('scheduledTime')}
                />
                {form.formState.errors.scheduledTime && (
                  <p className="mt-1 text-sm text-red-600">{form.formState.errors.scheduledTime.message}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
                Duration (minutes) <span className="text-red-500">*</span>
              </label>
              <select
                id="duration"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  form.formState.errors.duration ? 'border-red-500' : ''
                }`}
                {...form.register('duration', { valueAsNumber: true })}
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
                <option value={90}>90 minutes</option>
                <option value={120}>2 hours</option>
              </select>
              {form.formState.errors.duration && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.duration.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="status"
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                  form.formState.errors.status ? 'border-red-500' : ''
                }`}
                {...form.register('status')}
              >
                <option value="draft">Draft</option>
                <option value="scheduled">Scheduled</option>
                {form.watch('status') === 'ended' && (
                  <option value="ended">Ended</option>
                )}
              </select>
              {form.formState.errors.status && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.status.message}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="isPublic"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                {...form.register('isPublic')}
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700">
                Make this webinar public (anyone can register)
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                AI Agent <span className="text-red-500">*</span>
              </label>
              <AiAgentSelector 
                onSelect={(agentId) => form.setValue('agentId', agentId)} 
                selectedAgentId={form.watch('agentId')}
              />
              {form.formState.errors.agentId && (
                <p className="mt-1 text-sm text-red-600">{form.formState.errors.agentId.message}</p>
              )}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Link
              href={`/dashboard/webinars/${params.id}`}
              className="mr-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}