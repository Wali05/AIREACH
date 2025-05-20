'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Plus, Search, Filter, Clock, Users, ArrowUpRight, Trash, Info } from 'lucide-react';
// import { FileUploadDemo } from '@/components/FileUploadDemo'; // Temporarily disabled

export default function WebinarsPage() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showFileUpload, setShowFileUpload] = useState(false);
  // Define a proper type for webinars
  interface Webinar {
    id: string;
    title: string;
    description: string;
    scheduledAt: string;
    duration: number;
    coverImage?: string;
    _count?: {
      attendees: number;
    };
  }
  
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  
  // Fetch webinars for current user
  useEffect(() => {
    async function fetchWebinars() {
      const res = await fetch('/api/webinars');
      if (res.ok) {
        const data = await res.json();
        setWebinars(data);
      }
    }
    fetchWebinars();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-300">
            Webinars
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your upcoming and past webinars
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowFileUpload(!showFileUpload)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-lg shadow-lg"
        >
          <Plus size={18} />
          <span>New Webinar</span>
        </motion.button>
      </div>

      {/* File Upload Feedback */}
      {showFileUpload && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8 p-4 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-lg"
        >
          <div className="flex items-center">
            <Info size={18} className="text-violet-600 dark:text-violet-400 mr-2" />
            <p className="text-violet-700 dark:text-violet-300">
              File upload functionality is coming soon. You&apos;ll be able to upload webinar materials here.
            </p>
          </div>
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search webinars..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Calendar size={16} className="text-violet-500" />
            <span>Date</span>
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Filter size={16} className="text-violet-500" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        <TabButton active={activeTab === 'upcoming'} onClick={() => setActiveTab('upcoming')}>
          Upcoming
        </TabButton>
        <TabButton active={activeTab === 'past'} onClick={() => setActiveTab('past')}>
          Past
        </TabButton>
        <TabButton active={activeTab === 'drafts'} onClick={() => setActiveTab('drafts')}>
          Drafts
        </TabButton>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {webinars.map((webinar) => {
          const dateObj = new Date(webinar.scheduledAt);
          const now = new Date();
          const isLive = now >= dateObj && now <= new Date(dateObj.getTime() + (webinar.duration ?? 0) * 60000);
          return (
            <WebinarCard
              key={webinar.id}
              webinar={{
                id: webinar.id,
                title: webinar.title,
                description: webinar.description,
                date: dateObj.toLocaleDateString(),
                time: dateObj.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' }),
                attendees: webinar._count?.attendees ?? 0,
                isLive,
                coverImage: webinar.coverImage || 'https://via.placeholder.com/400x200?text=No+Image'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function TabButton({ children, active, onClick }: { children: React.ReactNode, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-medium text-sm transition-all relative ${
        active ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
      }`}
    >
      {children}
      {active && (
        <motion.div
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-600 to-cyan-500 dark:from-violet-400 dark:to-cyan-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
}

interface WebinarCardProps {
  webinar: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    attendees: number;
    isLive: boolean;
    coverImage: string;
  };
}

function WebinarCard({ webinar }: WebinarCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group bg-white dark:bg-gray-800/50 rounded-xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={webinar.coverImage}
          alt={webinar.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {webinar.isLive && (
          <div className="absolute top-4 left-4 px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-md flex items-center gap-1 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span>LIVE NOW</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.a
            href={`/webinar/${webinar.id}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
          >
            <ArrowUpRight size={16} className="text-violet-600 dark:text-violet-400" />
          </motion.a>
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Are you sure you want to delete this webinar?')) {
                fetch(`/api/webinars/${webinar.id}`, { method: 'DELETE' })
                  .then(() => {
                    window.location.reload();
                  });
              }
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg"
          >
            <Trash size={16} className="text-red-500" />
          </motion.button>
        </div>
      </div>
      <a href={`/dashboard/webinars/${webinar.id}`} className="block">
        <div className="p-5">
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {webinar.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
            {webinar.description}
          </p>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Calendar size={14} />
              <span>{webinar.date}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Clock size={14} />
              <span>{webinar.time}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
              <Users size={14} />
              <span>{webinar.attendees}</span>
            </div>
          </div>
        </div>
      </a>
    </motion.div>
  );
} 