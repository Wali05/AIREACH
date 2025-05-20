'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import { Home, Users, Sparkles, Settings, User, Plus } from 'lucide-react';
import { LogoSVG } from '@/components/LogoSVG';
import { CreateWebinarModal } from '@/components/CreateWebinarModal';
import { motion } from 'framer-motion';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ui/theme-toggle';

// Import better fonts if needed
const fontStyles = {
  heading: 'font-sans font-bold tracking-tight',
  body: 'font-sans text-base',
  accent: 'font-sans font-medium tracking-wide'
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const links = [
    { icon: <Home className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, label: 'Dashboard', href: '/dashboard' },
    { icon: <Users className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, label: 'Webinars', href: '/dashboard/webinars' },
    { icon: <Sparkles className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, label: 'AI Agents', href: '/dashboard/ai-agents' },
    { icon: <User className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, label: 'Leads', href: '/dashboard/customers' },
    { icon: <Settings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, label: 'Settings', href: '/dashboard/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-[#0c0a10] dark:to-[#131217]">
      <div className="relative z-10 flex w-full">
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink key={idx} link={{
                    ...link,
                    icon: (
                      <div className={`${pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href)) 
                        ? "text-violet-600 dark:text-violet-400" 
                        : "text-neutral-700 dark:text-neutral-300"}`}>
                        {link.icon}
                      </div>
                    )
                  }} />
                ))}
              </div>
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main content with animated gradient background */}
        <main className="relative flex-1 min-h-screen overflow-x-hidden">
          {/* Header with theme toggle and profile button */}
          <header className="absolute top-0 right-0 flex items-center gap-4 p-4 z-20">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: 'w-6 h-6' } }} />
          </header>
          <div className="absolute inset-0 bg-grid-pattern dark:bg-grid-pattern-dark opacity-10"></div>
          <div className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-violet-400/20 to-cyan-400/20 blur-3xl animate-blob"></div>
          <div className="absolute -bottom-[30%] -right-[20%] w-[70%] h-[70%] rounded-full bg-gradient-to-bl from-fuchsia-400/20 to-blue-400/20 blur-3xl animate-blob animation-delay-2000"></div>
          
          <div className="relative z-10 p-6">
            {children}
          </div>
          
          {/* Floating Action Button for Create Webinar */}
          <motion.button
            whileHover={{ scale: 1.12, boxShadow: '0 0 32px 8px #8b5cf6, 0 0 64px 16px #22d3ee' }}
            whileTap={{ scale: 0.97 }}
            className="fixed bottom-8 right-8 z-40 bg-gradient-to-r from-violet-600 to-cyan-500 text-white rounded-full shadow-xl p-5 focus:outline-none focus:ring-4 focus:ring-cyan-400/40 animate-fab-glow border-2 border-cyan-400"
            onClick={() => setModalOpen(true)}
            aria-label="Create Webinar"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
          
          <CreateWebinarModal open={modalOpen} onOpenChange={setModalOpen} />
        </main>
      </div>
      <style jsx global>{`
        .animate-blob {
          animation: blob 10s infinite alternate;
        }
        @keyframes blob {
          0% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(5%, 5%) scale(1.1);
          }
          66% {
            transform: translate(-5%, 10%) scale(0.9);
          }
          100% {
            transform: translate(0%, -5%) scale(1.05);
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fab-glow {
          box-shadow: 0 0 32px 8px rgba(139,92,246,0.3), 0 0 64px 16px rgba(34,211,238,0.15);
        }
        .bg-grid-pattern {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23334155'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
        .bg-grid-pattern-dark {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='%23334155'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
        }
      `}</style>
    </div>
  );
}

// Custom Logo component using a smaller AR logo
export const Logo = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center space-x-3 py-1 text-sm font-normal"
    >
      <LogoSVG className="scale-90" />
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="/dashboard"
      className="relative z-20 flex items-center justify-center py-1 text-sm font-normal"
    >
      <LogoSVG className="scale-90" />
    </a>
  );
}; 