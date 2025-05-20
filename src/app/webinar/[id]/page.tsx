'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, User, ArrowLeft, Share2, Copy, Video } from 'lucide-react';
import { LogoSVG } from '@/components/LogoSVG';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';

// Helper function to calculate time remaining
const calculateTimeRemaining = (targetDate: Date) => {
  const now = new Date();
  const difference = targetDate.getTime() - now.getTime();
  
  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  
  return { days, hours, minutes, seconds, isExpired: false };
};

interface Webinar {
  id: string;
  title: string;
  description: string;
  scheduledAt: string;
  duration: number;
  coverImage?: string;
  hostName?: string;
}

export default function WebinarPage({ params }: { params: { id: string } }) {
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });
  const [countdownEnded, setCountdownEnded] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Create a stable reference to the ID that doesn't change on re-renders
  const webinarId = params.id;

  useEffect(() => {
    const fetchWebinar = async () => {
      try {
        setIsLoading(true);
        // In a real app, we would fetch the webinar data from the API
        const response = await fetch(`/api/webinars/${webinarId}/public`);
        
        if (response.ok) {
          const data = await response.json();
          setWebinar(data);
        } else {
          console.error('Error fetching webinar:', await response.text());
        }
      } catch (error) {
        console.error('Error fetching webinar:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWebinar();
  }, [webinarId]);
    useEffect(() => {
    if (!webinar) return;
    
    // Set up the countdown timer
    const targetDate = new Date(webinar.scheduledAt);
    
    const updateTimer = () => {
      const remaining = calculateTimeRemaining(targetDate);
      setTimeRemaining(remaining);
      
      // Set countdownEnded to true when the timer expires
      if (remaining.isExpired) {
        setCountdownEnded(true);
      }
    };
    
    // Update the timer immediately
    updateTimer();
    
    // Then update it every second
    const timerId = setInterval(updateTimer, 1000);
    
    // Clean up the interval on unmount
    return () => clearInterval(timerId);
  }, [webinar]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, we would submit the registration to the API
      const response = await fetch(`/api/webinars/${webinarId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Registration failed');
      
      // Show success state
      setIsRegistered(true);
    } catch (error) {
      console.error('Error registering for webinar:', error);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/webinar/${webinarId}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111014] text-white flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-t-violet-600 border-b-violet-600 border-l-transparent border-r-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-violet-400 font-medium">Loading webinar details...</p>
        </div>
      </div>
    );
  }
  
  if (!webinar) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-[#111014] text-white flex flex-col items-center justify-center p-6 text-center"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Webinar Not Found</h2>
        <p className="text-gray-300 mb-8 max-w-md">The webinar you're looking for doesn't exist or has been removed.</p>
        <Link href="/">
          <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
            <ArrowLeft className="mr-2 h-4 w-4" /> Go to Homepage
          </Button>
        </Link>
      </motion.div>
    );
  }

  const scheduledDate = new Date(webinar.scheduledAt);
  const isLive = !timeRemaining.isExpired && new Date() >= scheduledDate;
  const isPast = timeRemaining.isExpired && new Date() > new Date(scheduledDate.getTime() + (webinar.duration * 60000));
  
  const formattedDate = scheduledDate.toLocaleDateString(undefined, { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  
  const formattedTime = scheduledDate.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-[#111014] text-white">
      {/* Header/Nav */}      <header className="border-b border-[#18171c] py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/">
            <LogoSVG className="scale-90" />
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-12">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left column - Webinar details */}
          <div className="space-y-8">
            <div>
              <motion.h1 
                className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {webinar.title}
              </motion.h1>
              <motion.p 
                className="text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {webinar.description}
              </motion.p>
            </div>
            
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-[#18171c] border-0 shadow-xl p-5">
                <h3 className="font-semibold mb-4 text-lg">Webinar Details</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-900/30 p-2 rounded-md">
                      <Calendar className="text-violet-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Date and Time</p>
                      <p className="text-sm text-gray-400">
                        {formattedDate}
                        {' at '}
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-violet-900/30 p-2 rounded-md">
                      <Clock className="text-violet-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Duration</p>
                      <p className="text-sm text-gray-400">{webinar.duration} minutes</p>
                    </div>
                  </div>
                  
                  {webinar.hostName && (
                    <div className="flex items-center gap-3">
                      <div className="bg-violet-900/30 p-2 rounded-md">
                        <User className="text-violet-400 w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Host</p>
                        <p className="text-sm text-gray-400">{webinar.hostName}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
              
              {!isRegistered && !isPast && (
                <Card className="bg-[#18171c] border-0 shadow-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">Share This Webinar</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                      onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Join me at ${webinar.title}`)}`, '_blank')}
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex-1 border-violet-700 text-violet-400 hover:bg-violet-700/20"
                      onClick={copyLink}
                    >
                      {copied ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" /> Copy Link
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
              
              {!isRegistered && !isPast && timeRemaining.days === 0 && timeRemaining.hours === 0 && timeRemaining.minutes < 30 && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring" }}
                  className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-4 rounded-lg shadow-lg"
                >
                  <div className="flex items-center">
                    <div className="h-3 w-3 bg-white rounded-full mr-3 animate-pulse"></div>
                    <p className="font-semibold">Webinar starting soon!</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
          
          {/* Right column - Registration or countdown */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {isLive && (
              <Card className="bg-[#18171c] border-0 shadow-xl overflow-hidden">
                <div className="bg-red-600 p-3 flex items-center gap-2">
                  <div className="h-3 w-3 bg-white rounded-full animate-pulse"></div>
                  <p className="font-semibold">LIVE NOW</p>
                </div>
                <div className="p-6 flex flex-col items-center text-center">
                  <h3 className="font-bold text-xl mb-2">Join This Webinar Now</h3>
                  <p className="text-gray-400 mb-6">The webinar is live right now. Don't miss it!</p>
                  {isRegistered ? (
                    <Link href={`/attend/webinar/${webinarId}`}>
                      <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white">
                        <Video className="h-4 w-4 mr-2" /> Join Webinar
                      </Button>
                    </Link>
                  ) : (null)}
                </div>
              </Card>
            )}
              {!isLive && !isPast && (
              <Card className="bg-[#18171c] border-0 shadow-xl">
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-6 text-center">Time Until Webinar Starts</h3>
                  
                  {countdownEnded ? (
                    <div className="text-center space-y-4">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-lg shadow-lg mb-6"
                      >
                        <h4 className="font-bold text-lg mb-2">Webinar is Ready!</h4>
                        <p className="text-sm">The scheduled time has arrived. You can join now!</p>
                      </motion.div>
                      
                      <Link href={`/attend/webinar/${webinarId}`}>
                        <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800 text-white">
                          <Video className="h-4 w-4 mr-2" /> Join Webinar
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-4 gap-2 mb-8">
                        <div className="flex flex-col items-center">
                          <div className="bg-[#111014] rounded-lg w-full py-4 px-2 flex justify-center items-center text-2xl font-bold text-violet-400 mb-2">
                            {timeRemaining.days.toString().padStart(2, '0')}
                          </div>
                          <span className="text-xs text-gray-400">DAYS</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-[#111014] rounded-lg w-full py-4 px-2 flex justify-center items-center text-2xl font-bold text-violet-400 mb-2">
                            {timeRemaining.hours.toString().padStart(2, '0')}
                          </div>
                          <span className="text-xs text-gray-400">HOURS</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-[#111014] rounded-lg w-full py-4 px-2 flex justify-center items-center text-2xl font-bold text-violet-400 mb-2">
                            {timeRemaining.minutes.toString().padStart(2, '0')}
                          </div>
                          <span className="text-xs text-gray-400">MINUTES</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="bg-[#111014] rounded-lg w-full py-4 px-2 flex justify-center items-center text-2xl font-bold text-violet-400 mb-2">
                            {timeRemaining.seconds.toString().padStart(2, '0')}
                          </div>
                          <span className="text-xs text-gray-400">SECONDS</span>
                        </div>
                      </div>
                  
                      {isRegistered ? (
                        <div className="text-center space-y-4">
                          <div className="bg-green-900/30 p-4 rounded-lg">
                            <div className="flex items-center justify-center mb-2">
                              <CheckCircle className="text-green-400 h-6 w-6 mr-2" />
                              <h4 className="font-medium">You&apos;re Registered!</h4>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              We&apos;ll send you a reminder email before the webinar starts.
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            className="w-full border-violet-700 text-violet-400 hover:bg-violet-700/20"
                            onClick={() => window.open(`https://calendar.google.com/calendar/r/eventedit?text=${encodeURIComponent(webinar.title)}&dates=${encodeURIComponent(scheduledDate.toISOString().replace(/-|:|\.\d+/g, ''))}&details=${encodeURIComponent(webinar.description)}`, '_blank')}
                          >
                            <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                          </Button>
                        </div>
                      ) : (
                        <form onSubmit={handleSubmit} className="space-y-3">
                          <Input
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="bg-[#111014] border-[#2a2833] focus:border-violet-500"
                          />
                          <Input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="bg-[#111014] border-[#2a2833] focus:border-violet-500"
                          />
                          <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                            Register Now
                          </Button>
                        </form>
                      )}
                    </>
                  )}
                </div>
              </Card>
            )}
            
            {isPast && (
              <Card className="bg-[#18171c] border-0 shadow-xl">
                <div className="p-6 text-center">
                  <div className="mb-4">
                    <Badge className="bg-gray-700 hover:bg-gray-600">Webinar Ended</Badge>
                  </div>
                  <h3 className="font-bold text-xl mb-2">This Webinar Has Already Ended</h3>
                  <p className="text-gray-400 mb-6">Sorry, you missed this webinar. Check back for upcoming events or contact the organizer for the recording.</p>
                  <Link href="/dashboard">
                    <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                      Browse Other Webinars
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
            
            {webinar.coverImage && (
              <motion.div
                className="mt-6 rounded-xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <img 
                  src={webinar.coverImage} 
                  alt={webinar.title} 
                  className="w-full h-48 object-cover"
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}