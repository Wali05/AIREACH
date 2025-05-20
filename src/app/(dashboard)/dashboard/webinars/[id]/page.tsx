'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import { 
  Calendar, 
  Clock, 
  Users, 
  Edit, 
  Trash2, 
  Send, 
  Video, 
  ExternalLink,
  ArrowLeft,
  CheckCircle,
  Copy,
  Bell,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Share2 } from 'lucide-react';
import { NotificationCard } from '@/components/NotificationCard';

interface Attendee {
  id: string;
  userId: string;
  webinarId: string;
  status: 'pending' | 'joined' | 'left';
  joinedAt: string | null;
  user: {
    id: string;
    email: string;
  };
}

interface Webinar {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'scheduled' | 'live' | 'ended';
  hostId: string;
  agentId: string | null;
  createdAt: string;
  attendees: Attendee[];
  coverImage?: string;
  scheduledAt: string;
  duration: number;
  _count?: {
    attendees: number;
  };
}

export default function WebinarDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);
  // No notification state needed here as it's handled by the NotificationCard component
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Create a stable reference to the ID that doesn't change on re-renders
  const webinarId = params.id;
  
  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/webinars/${webinarId}`);
        const data = await response.json();
        setWebinar(data);
      } catch (error) {
        console.error('Error fetching webinar:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWebinar();
  }, [webinarId]);

  // Notification handling is now managed by the NotificationCard component

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await fetch(`/api/webinars/${webinarId}`, {
        method: 'DELETE',
      });
      router.push('/dashboard/webinars');
    } catch (error) {
      console.error('Error deleting webinar:', error);
      alert('Failed to delete webinar');
    } finally {
      setDeleteLoading(false);
    }
  };

  const copyLink = () => {
    const link = `${typeof window !== 'undefined' ? window.location.origin : ''}/webinar/${webinarId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-violet-600 border-b-violet-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-violet-600 dark:text-violet-400 font-medium">Loading webinar details...</p>
        </div>
      </div>
    );
  }

  if (!webinar) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[60vh] text-center"
      >
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Webinar Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">The webinar you're looking for doesn't exist or has been removed.</p>
        <Link href="/dashboard/webinars">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Webinars
          </Button>
        </Link>
      </motion.div>
    );
  }

  const formattedDate = format(new Date(webinar.scheduledAt), 'MMMM d, yyyy');
  const formattedTime = format(new Date(webinar.scheduledAt), 'h:mm a');
  const webinarUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/webinar/${webinarId}`;

  const scheduledDate = new Date(webinar.scheduledAt);
  const isLive = new Date() >= scheduledDate && 
    new Date() <= new Date(scheduledDate.getTime() + (webinar.duration * 60000));
  
  const isPast = new Date() > new Date(scheduledDate.getTime() + (webinar.duration * 60000));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header with back button */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link href="/dashboard/webinars">
            <Button variant="ghost" className="mr-4 hover:bg-transparent hover:text-violet-600 dark:hover:text-violet-400 p-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400">
            Webinar Details
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="border-violet-200 hover:border-violet-400 hover:bg-violet-100/10 dark:border-violet-800 dark:hover:border-violet-600 dark:hover:bg-violet-900/20"
            onClick={() => router.push(`/dashboard/webinars/${webinarId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2 text-violet-600 dark:text-violet-400" /> Edit
          </Button>
          <AnimatePresence mode="wait">
            {showDeleteConfirm ? (
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Button
                  variant="outline"
                  className="border-gray-200 hover:border-gray-400 hover:bg-gray-100/10 dark:border-gray-800 dark:hover:border-gray-600 dark:hover:bg-gray-900/20"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                >
                  Confirm
                </Button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Button
                  variant="outline"
                  className="border-red-200 hover:border-red-400 hover:bg-red-100/10 dark:border-red-900 dark:hover:border-red-700 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Webinar details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-0 dark:border dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-lg">
            {webinar.coverImage && (
              <div className="h-60 overflow-hidden relative">
                <img
                  src={webinar.coverImage || 'https://via.placeholder.com/1200x400?text=No+Cover+Image'}
                  alt={webinar.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {isLive && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-md flex items-center gap-1.5 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-white"></span>
                    <span>LIVE NOW</span>
                  </div>
                )}
                {isPast && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-gray-700 text-white text-sm font-medium rounded-md">
                    Completed
                  </div>
                )}
                {!isLive && !isPast && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-emerald-600 text-white text-sm font-medium rounded-md">
                    Upcoming
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                {webinar.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                {webinar.description}
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Date</span>
                  <span className="text-violet-600 dark:text-violet-400 font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1.5 opacity-70" /> {formattedDate}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Time</span>
                  <span className="text-violet-600 dark:text-violet-400 font-medium flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 opacity-70" /> {formattedTime}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Duration</span>
                  <span className="text-violet-600 dark:text-violet-400 font-medium">
                    {webinar.duration} minutes
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-1">Attendees</span>
                  <span className="text-violet-600 dark:text-violet-400 font-medium flex items-center">
                    <Users className="h-4 w-4 mr-1.5 opacity-70" /> {webinar._count?.attendees || 0}
                  </span>
                </div>
              </div>
              
              <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
              
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 flex flex-wrap sm:flex-nowrap items-center justify-between">
                <div className="mb-3 sm:mb-0">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Webinar Public Link</p>
                  <div className="flex items-center">
                    <ExternalLink className="h-4 w-4 text-violet-600 dark:text-violet-400 mr-1.5" />
                    <span className="text-gray-800 dark:text-gray-200 font-medium truncate max-w-[200px] sm:max-w-[300px]">
                      {webinarUrl}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => window.open(webinarUrl, '_blank')}
                    className="w-1/2 sm:w-auto border-violet-200 dark:border-violet-900 hover:bg-violet-100/10 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                  >
                    <Share2 className="h-4 w-4 mr-2" /> Share
                  </Button>
                  <Button
                    onClick={copyLink}
                    variant="outline"
                    className="w-1/2 sm:w-auto border-violet-200 dark:border-violet-900 hover:bg-violet-100/10 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" /> Copy Link
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Right column - Stats and quick actions */}
        <div className="space-y-6">
          <Card className="p-6 border-0 dark:border dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-lg">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                onClick={() => window.open(webinarUrl, '_blank')}
              >
                View Public Page
              </Button>
              <Button 
                variant="outline"
                className="w-full border-violet-200 dark:border-violet-800 hover:bg-violet-100/10 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
                onClick={() => router.push(`/dashboard/webinars/${webinarId}/edit`)}
              >
                Edit Webinar
              </Button>
            </div>
            
            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Status</h4>
              <div className="flex items-center space-x-2">
                {isLive && <Badge className="bg-red-500 hover:bg-red-600">Live Now</Badge>}
                {isPast && <Badge className="bg-gray-700 hover:bg-gray-800">Completed</Badge>}
                {!isLive && !isPast && <Badge className="bg-emerald-600 hover:bg-emerald-700">Upcoming</Badge>}
              </div>
            </div>
            
            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Created</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date(webinar.createdAt).toLocaleString()}
              </p>
            </div>
            
            <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />
            
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300">Scheduled</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {formattedDate} at {formattedTime}
              </p>
            </div>
          </Card>

          {/* Notification Card */}
          <NotificationCard 
            attendeeCount={webinar._count?.attendees || 0} 
            webinarId={webinarId} 
          />
        </div>
      </div>
    </motion.div>
  );
}