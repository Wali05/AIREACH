"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ 
        scale: 1.1, 
        rotate: 5,
        boxShadow: theme === 'dark' 
          ? '0 0 15px 3px rgba(255,255,255,0.3)' 
          : '0 0 15px 3px rgba(0,0,0,0.2)'
      }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="group relative h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-400 p-0.5 shadow-lg transition-shadow duration-200 hover:shadow-xl"
      aria-label="Toggle theme"
    >
      <span className="absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-0 rounded-full bg-[radial-gradient(var(--sky-500)_40%,transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      </span>
      <span className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white transition-colors dark:bg-gray-900">
        <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-sky-300" />
      </span>
    </motion.button>
  );
} 