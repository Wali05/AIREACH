import React from "react";
import { motion } from "framer-motion";
import { Clock, AlertCircle } from "lucide-react";

interface HostWaitingScreenProps {
  webinarTitle: string;
  scheduledTime?: string;
  hostName?: string;
}

export default function HostWaitingScreen({
  webinarTitle,
  scheduledTime,
  hostName = "The host",
}: HostWaitingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center w-full h-full min-h-[400px] bg-gradient-to-b from-indigo-950 to-black rounded-xl overflow-hidden p-8 text-center"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute w-32 h-32 rounded-full bg-indigo-600/20 blur-3xl -top-16 left-1/4"
        />
        <motion.div
          animate={{
            y: ["0%", "100%"],
            opacity: [0, 0.2, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
            delay: 5,
          }}
          className="absolute w-48 h-48 rounded-full bg-violet-600/20 blur-3xl -top-24 right-1/4"
        />
      </div>
      
      {/* Content */}
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="relative z-10 flex flex-col items-center max-w-lg"
      >
        <div className="w-20 h-20 bg-indigo-900/50 rounded-full flex items-center justify-center mb-6 relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-full border-2 border-indigo-400/30"
          />
          <Clock className="h-8 w-8 text-indigo-300" />
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-4">
          Waiting for the host to start
        </h2>
        
        <p className="text-indigo-200 mb-6">
          {hostName} will begin the webinar "{webinarTitle}" shortly. Please stay on this page.
        </p>
        
        {scheduledTime && (
          <div className="bg-indigo-900/40 px-4 py-2 rounded-lg flex items-center mb-6">
            <AlertCircle className="h-4 w-4 text-indigo-300 mr-2" />
            <p className="text-sm text-indigo-200">
              Scheduled start time: {new Date(scheduledTime).toLocaleTimeString()}
            </p>
          </div>
        )}
        
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 rounded-full border-2 border-indigo-500 border-t-transparent"
          />
          <div className="absolute inset-0 flex items-center justify-center text-indigo-300 text-sm">
            Live
          </div>
        </div>
        
        <p className="text-indigo-400 text-sm mt-8 max-w-sm">
          We'll automatically connect you when the host starts the webinar. There's no need to refresh the page.
        </p>
      </motion.div>
    </motion.div>
  );
}
