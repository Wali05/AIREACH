import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Bell, CheckCircle, AlertCircle } from 'lucide-react';

interface NotificationCardProps {
  attendeeCount: number;
  webinarId: string;
}

export function NotificationCard({ attendeeCount, webinarId }: NotificationCardProps) {
  const [sendingNotification, setSendingNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'reminder' | 'registration' | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<'success' | 'error' | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');

  const handleSendNotification = async (type: 'reminder' | 'registration') => {
    setSendingNotification(true);
    setNotificationType(type);
    setNotificationStatus(null);
    
    try {
      const response = await fetch(`/api/webinars/${webinarId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setNotificationStatus('success');
        setNotificationMessage(
          `Successfully sent ${data.emailsSent} ${type === 'reminder' ? 'reminder' : 'registration'} emails.`
        );
      } else {
        throw new Error(data.error || 'Failed to send notifications');
      }
    } catch (error) {
      console.error('Error sending notifications:', error);
      setNotificationStatus('error');
      setNotificationMessage('Failed to send notifications. Please try again.');
    } finally {
      setSendingNotification(false);
      
      // Clear notification after 5 seconds
      setTimeout(() => {
        setNotificationStatus(null);
        setNotificationMessage('');
      }, 5000);
    }
  };

  return (
    <Card className="p-6 border-0 dark:border dark:border-gray-800 shadow-lg bg-white dark:bg-gray-900/50 backdrop-blur-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          Email Notifications
        </h3>
        <Badge 
          variant="outline" 
          className="border-violet-200 dark:border-violet-800 text-violet-600 dark:text-violet-400"
        >
          {attendeeCount} Recipients
        </Badge>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        Send email notifications to all registered attendees for this webinar
      </p>
      
      <AnimatePresence>
        {notificationStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`${
              notificationStatus === 'success' 
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            } p-3 rounded-md mb-4`}
          >
            <div className="flex items-center">
              {notificationStatus === 'success' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <AlertCircle className="h-4 w-4 mr-2" />
              )}
              <p className="text-sm">{notificationMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="space-y-3">
        <Button 
          onClick={() => handleSendNotification('registration')}
          disabled={sendingNotification}
          variant="outline"
          className="w-full border-violet-200 dark:border-violet-800 hover:bg-violet-100/10 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
        >
          <Mail className="h-4 w-4 mr-2" />
          {sendingNotification && notificationType === 'registration' 
            ? 'Sending...' 
            : 'Send Registration Confirmations'}
        </Button>
        
        <Button 
          onClick={() => handleSendNotification('reminder')}
          disabled={sendingNotification}
          variant="outline"
          className="w-full border-violet-200 dark:border-violet-800 hover:bg-violet-100/10 dark:hover:bg-violet-900/20 text-violet-600 dark:text-violet-400"
        >
          <Bell className="h-4 w-4 mr-2" />
          {sendingNotification && notificationType === 'reminder' 
            ? 'Sending...' 
            : 'Send Reminder Emails'}
        </Button>
      </div>
    </Card>
  );
}
