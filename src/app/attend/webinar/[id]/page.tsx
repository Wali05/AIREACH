"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import VideoPlayer from "@/components/VideoPlayer";
import ChatPanel from "@/components/ChatPanel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, Users, MessageSquare, Phone } from "lucide-react";
import { motion } from "framer-motion";

interface Webinar {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  presenter: {
    name: string;
    title: string;
    imageUrl?: string;
  };
  attendeeCount?: number;
}

export default function WebinarAttendPage() {  const params = useParams();
  // Create a stable webinarId from params to prevent unnecessary re-renders
  const webinarId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [webinar, setWebinar] = useState<Webinar | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [hostActive, setHostActive] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch webinar data
        const res = await fetch(`/api/webinars/${webinarId}/public`);
        
        if (!res.ok) {
          throw new Error("Failed to load webinar");
        }
        
        const data = await res.json();
        setWebinar(data);
        
        // Check if host is active
        await checkHostStatus();
      } catch (err) {
        setError("Could not load webinar details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
      async function checkHostStatus() {
      try {
        const res = await fetch(`/api/webinars/${webinarId}/host-status`);
        if (!res.ok) throw new Error("Failed to check host status");
        
        const data = await res.json();
        setHostActive(data.isHostActive);
      } catch (err) {
        console.error("Error checking host status:", err);
      }
    }
    
    fetchData();
    
    // Set up polling to check for host activity every 15 seconds
    const hostCheckInterval = setInterval(() => {
      checkHostStatus();
    }, 15000);
    
    return () => clearInterval(hostCheckInterval);
  }, [webinarId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookCall = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      // Call VAPI agent booking endpoint
      const res = await fetch("/api/vapi/book-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          webinarId: id
        })
      });
      
      if (!res.ok) {
        throw new Error("Failed to book call");
      }
      
      setFormSuccess(true);
      // Reset form after success
      setTimeout(() => {
        setShowBookingModal(false);
        setFormSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          message: ""
        });
      }, 3000);
    } catch (err) {
      console.error("Error booking call:", err);
      // Show error message
    } finally {
      setFormSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading webinar...</h2>
        </div>
      </div>
    );
  }

  if (error || !webinar) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-900 to-indigo-900 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Webinar</h2>
          <p className="text-gray-600 mb-6">{error || "This webinar could not be found or is no longer available."}</p>
          <Button onClick={() => window.location.href = "/"} className="w-full">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  return (    <div className="min-h-screen bg-gradient-to-br from-violet-900 to-indigo-900 py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header with enhanced animation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center relative"
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute left-0 top-0 w-24 h-24 rounded-full bg-purple-500/10 blur-xl -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.5 }}
          />
          <motion.div 
            className="absolute right-0 bottom-0 w-32 h-32 rounded-full bg-indigo-500/10 blur-xl -z-10" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5 }}
          />
          
          {/* Title with gradient */}
          <motion.h1 
            className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-violet-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {webinar.title}
          </motion.h1>
          
          {/* Description with animation */}
          <motion.p 
            className="text-indigo-200 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            {webinar.description}
          </motion.p>
          
          {/* Webinar details with animation */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 mt-6 text-sm text-white"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.div 
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Calendar className="h-4 w-4 text-violet-300" />
              <span>{new Date(webinar.startTime).toLocaleDateString()}</span>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
            >
              <Clock className="h-4 w-4 text-violet-300" />
              <span>{new Date(webinar.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </motion.div>
            {webinar.attendeeCount && (
              <motion.div 
                className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
              >
                <Users className="h-4 w-4 text-violet-300" />
                <span>{webinar.attendeeCount} attendees</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        
        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">          {/* Video player with enhanced styling */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-2xl relative"
          >
            {/* Status indicator */}
            <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-white">LIVE</span>
            </div>
              {/* Video element with host waiting screen */}
            <div className="relative">
              {hostActive ? (
                <>
                  <VideoPlayer sessionId={id} />
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/40 to-transparent"></div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-br from-indigo-900 to-violet-900 w-full h-[400px] flex flex-col items-center justify-center p-6 text-center"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500 rounded-full blur-md animate-pulse opacity-30"></div>
                    <div className="relative w-16 h-16 border-4 border-t-indigo-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">Host Will Be Active Soon</h3>
                  <p className="text-indigo-200 max-w-md mb-6">The webinar host is preparing to go live. Please wait a moment while we set everything up for you.</p>
                  
                  <div className="flex items-center justify-center gap-1.5 text-indigo-300 bg-white/10 px-4 py-2 rounded-lg animate-pulse">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full"></span>
                    <span className="text-sm">Getting ready...</span>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Presenter info with enhanced styling */}
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900/80 p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar with glow effect */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-md animate-pulse"></div>
                    <div className="relative w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg border-2 border-indigo-400/30">
                      {webinar.presenter?.imageUrl ? (
                        <Image 
                          src={webinar.presenter.imageUrl} 
                          alt={webinar.presenter.name} 
                          width={48}
                          height={48}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        webinar.presenter?.name?.charAt(0) || "P"
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-white">{webinar.presenter?.name || "Presenter"}</h3>
                    <p className="text-sm text-indigo-200">{webinar.presenter?.title || "Host"}</p>
                  </div>
                </div>
                
                {/* Enhanced controls */}
                <div className="flex items-center gap-2">
                  <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-900/50 hover:bg-indigo-800/60 p-2 rounded-full"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
            {/* Enhanced Chat panel */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl border border-white/20"
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-white" />
                <h3 className="font-medium text-white">Live Chat</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-indigo-200 bg-indigo-800/50 px-2 py-1 rounded-full">
                  {Math.floor(Math.random() * 20) + 10} online
                </span>
              </div>
            </div>
            <div className="h-[500px] bg-gradient-to-b from-gray-900/50 to-indigo-900/30">
              <ChatPanel sessionId={id} />
            </div>
          </motion.div>
        </div>
        
        {/* Enhanced Call to action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => setShowBookingModal(true)}
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50 flex items-center gap-2 shadow-lg shadow-indigo-500/20 px-6 py-6 text-lg"
            >
              <Phone className="h-5 w-5" />
              Book a Call with Our Expert
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              onClick={() => window.location.href = `/api/payments/checkout?webinarId=${id}`}
              size="lg" 
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10 px-6 py-6 text-lg shadow-lg shadow-indigo-900/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                <path d="M21 8v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8"></path>
                <path d="M19 12H5"></path>
                <path d="M12 16a4 4 0 0 0 0-8"></path>
              </svg>
              Get Full Access
            </Button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Booking modal */}
      <Dialog open={showBookingModal} onOpenChange={setShowBookingModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Book a Call with Our Expert</DialogTitle>
            <DialogDescription>
              Fill out this form and our AI agent will contact you to schedule a personalized consultation.
            </DialogDescription>
          </DialogHeader>
          
          {formSuccess ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Request Submitted!</h3>
              <p className="text-gray-600">We'll be in touch with you shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleBookCall} className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <Input
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="What would you like to discuss?"
                  />
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={formSubmitting} className="w-full sm:w-auto">
                  {formSubmitting ? "Submitting..." : "Book Call"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
