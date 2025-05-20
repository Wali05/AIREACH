"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

interface DropdownItem {
  name: string;
  link: string;
}

interface NavItem {
  name: string;
  link: string;
  icon?: React.ReactNode;
  isDropdown?: boolean;
  dropdownItems?: DropdownItem[];
}

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const [visible, setVisible] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Handle navbar visibility on scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 50) {
        setVisible(true);
      } else {
        if (currentScrollY < lastScrollY) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
      
      lastScrollY = currentScrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle dropdown toggling
  const toggleDropdown = (name: string) => {
    if (openDropdown === name) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(name);
    }
  };

  return (
    <div
      className={cn(
        "flex max-w-7xl w-full fixed top-5 inset-x-0 mx-auto border border-transparent dark:border-white/[0.1] rounded-full backdrop-blur-xl bg-black/70 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-8 py-4 items-center justify-between",
        className,
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      )}
      style={{
        transition: "transform 0.3s ease, opacity 0.3s ease"
      }}
    >
      {/* Logo area */}
      <div className="flex items-center gap-3">
        <div className="lines flex flex-col gap-[3px]">
          <div className="logo-line line w-10 h-1" 
            style={{ 
              background: 'linear-gradient(to right, rgb(192,132,252), rgb(79,209,197))'
            }}
          ></div>
          <div className="logo-line line w-6 h-1" 
            style={{ 
              background: 'linear-gradient(to right, rgb(96,165,250), rgb(168,85,247))'
            }}
          ></div>
          <div className="logo-line line w-3 h-1" 
            style={{ 
              background: 'linear-gradient(to right, rgb(79,209,197), rgb(96,165,250))'
            }}
          ></div>
        </div>
        <span 
          className="text-2xl font-bold"
          style={{ 
            fontFamily: 'var(--font-orbitron), system-ui, sans-serif', 
            background: 'linear-gradient(to right, rgb(192,132,252), rgb(79,209,197))', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent'
          }}
        >
          AIREACH
        </span>
      </div>

      {/* Nav items */}
      <div className="hidden md:flex items-center space-x-1">
        {navItems.map((navItem: NavItem, idx: number) => (
          <div key={`nav-item-${idx}`} className="relative">
            {navItem.isDropdown ? (
              <button
                onClick={() => toggleDropdown(navItem.name)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-purple-400 transition-all duration-300"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="text-sm" style={{ fontFamily: 'var(--font-orbitron), system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  {navItem.name}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform ${openDropdown === navItem.name ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <a
                href={navItem.link}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-white hover:text-purple-400 transition-all duration-300"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="text-sm" style={{ fontFamily: 'var(--font-orbitron), system-ui, sans-serif', letterSpacing: '0.5px' }}>
                  {navItem.name}
                </span>
              </a>
            )}

            {/* Dropdown menu */}
            {navItem.isDropdown && openDropdown === navItem.name && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-black/90 backdrop-blur-xl border border-white/10 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="py-1">
                  {navItem.dropdownItems?.map((item: DropdownItem, itemIdx: number) => (
                    <a
                      key={`dropdown-item-${itemIdx}`}
                      href={item.link}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-purple-500/10 hover:text-purple-400"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm font-medium text-white px-4 py-2 rounded-full hover:text-purple-300 transition-all duration-300 border border-white/10 hover:border-purple-500/30">
              Log In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="text-sm font-medium bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-full transition duration-300">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          <UserButton 
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "h-10 w-10 border-2 border-purple-500/30"
              }
            }}
          />
        </SignedIn>
        
        {/* Mobile menu button */}
        <button className="md:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}; 