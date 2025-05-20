'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'remixicon/fonts/remixicon.css';
import Link from 'next/link';
import Image from 'next/image';
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const AnimatedIntro = () => {
  const [showContent, setShowContent] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const mainRef = useRef(null);
  
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  
  // Generate particles for background - Simplified for better performance
  useEffect(() => {
    if (!showContent) return;
    
    // Create particles for the background
    const particlesContainer = document.querySelector('.particles-container');
    if (!particlesContainer) return;
    
    // Clear existing particles
    particlesContainer.innerHTML = '';
    
    // Create fewer particles for better performance
    for (let i = 0; i < 15; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      
      // Random size
      const size = Math.random() * 3 + 1;
      
      // Random colors
      const colors = [
        'rgba(192, 132, 252, 0.2)',
        'rgba(79, 209, 197, 0.2)',
        'rgba(96, 165, 250, 0.2)',
        'rgba(168, 85, 247, 0.2)'
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Apply styles
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = color;
      
      particlesContainer.appendChild(particle);
    }
  }, [showContent]);
  
  useGSAP(() => {
    const tl = gsap.timeline();

    // Animation goes straight now, no rotation or movement
    tl.to(".vi-mask-group", {
      scale: 10,
      duration: 2,
      ease: "Expo.easeInOut",
      transformOrigin: "50% 50%",
      opacity: 0,
      onUpdate: function () {
        if (this.progress() >= 0.9) {
          const svgElement = document.querySelector(".svg");
          if (svgElement) svgElement.remove();
          setShowContent(true);
          this.kill();
        }
      },
    });
  });

  return (
    <>
      <div className="svg flex items-center justify-center fixed top-0 left-0 z-[100] w-full h-screen overflow-hidden bg-background">
        <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <mask id="viMask">
              <rect width="100%" height="100%" fill="black" />
              <g className="vi-mask-group">
                <text
                  x="50%"
                  y="50%"
                  fontSize="100"
                  textAnchor="middle"
                  fill="white"
                  dominantBaseline="middle"
                  fontFamily="var(--font-orbitron), system-ui, sans-serif"
                  letterSpacing="5"
                  fontWeight="bold"
                >
                  AIREACH
                </text>
              </g>
            </mask>
          </defs>
          <image
            href="/bg.png"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid slice"
            mask="url(#viMask)"
          />
        </svg>
      </div>
      
      {showContent && (
        <div ref={mainRef} className="main relative w-full overflow-hidden">
          {/* Spacing for navbar */}
          <div className="mt-24 pt-12"></div>
          
          {/* Hero Section - More professional and cleaner */}
          <div className="relative w-full min-h-screen flex items-center">
            {/* Enhanced background */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/80 to-black/50">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(138,75,255,0.12),transparent_70%)]"></div>
              <img src="/bg.png" alt="Background" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
              
              {/* Add subtle grid pattern for a more professional look */}
              <div className="absolute inset-0 opacity-8" 
                style={{ 
                  backgroundImage: 'linear-gradient(to right, transparent 10%, rgba(138,75,255,0.03) 12%, rgba(79,209,197,0.03) 15%, transparent 20%), linear-gradient(to bottom, transparent 10%, rgba(138,75,255,0.03) 12%, rgba(79,209,197,0.03) 15%, transparent 20%)',
                  backgroundSize: '60px 60px',
                }}
              ></div>
              
              {/* Add subtle particle effects */}
              <div className="particles-container absolute inset-0 z-0 opacity-30"></div>
            </div>
            
            {/* Content: Text and Crystal */}
            <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-5">
              <div className="flex-1 flex flex-col justify-center space-y-4 pb-20 lg:pb-0">
                <h1 
                  className="hero-heading text-6xl sm:text-7xl lg:text-[7rem] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400" 
                  style={{ 
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                    fontWeight: '800',
                    letterSpacing: '-2px',
                  }}
                >
                  webinar
                </h1>
                <h1 
                  className="hero-heading text-6xl sm:text-7xl lg:text-[7rem] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400" 
                  style={{ 
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                    fontWeight: '800',
                    letterSpacing: '-2px',
                  }}
                >
                  platform
                </h1>
                <h1 
                  className="hero-heading text-6xl sm:text-7xl lg:text-[7rem] leading-tight bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400"
                  style={{ 
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                    fontWeight: '800',
                    letterSpacing: '-2px',
                  }}
                >
                  solutions
                </h1>
                
                {/* Professional tagline */}
                <p className="max-w-xl text-lg text-gray-300 mt-4 hero-heading" style={{ 
                  fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                  lineHeight: '1.8'
                }}>
                  Enterprise-grade webinar platform with AI-powered features for maximum engagement and conversion.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <SignedIn>
                    <Link href="/dashboard">
                      <button 
                        className="hero-cta px-8 py-4 text-xl font-semibold text-white rounded-md relative overflow-hidden group"
                        style={{ fontFamily: 'var(--font-orbitron), system-ui, sans-serif', letterSpacing: '1px' }}
                      >
                        <span className="relative z-10">Dashboard</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-600 transition-opacity duration-300 ease-in-out"></span>
                      </button>
                    </Link>
                  </SignedIn>
                  <SignedOut>
                    <SignUpButton mode="modal">
                      <button 
                        className="hero-cta px-8 py-4 text-xl font-semibold text-white rounded-md relative overflow-hidden group"
                        style={{ fontFamily: 'var(--font-orbitron), system-ui, sans-serif', letterSpacing: '1px' }}
                      >
                        <span className="relative z-10">GET STARTED</span>
                        <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-teal-600 transition-opacity duration-300 ease-in-out"></span>
                      </button>
                    </SignUpButton>
                  </SignedOut>
                  <Link href="/features">
                    <button 
                      className="hero-cta px-8 py-4 text-xl font-semibold rounded-md relative border border-purple-500/30 bg-black/30 text-gray-300 hover:text-white transition-all duration-300 group"
                      style={{ fontFamily: 'var(--font-orbitron), system-ui, sans-serif', letterSpacing: '1px' }}
                    >
                      <span className="relative z-10">LEARN MORE</span>
                    </button>
                  </Link>
                </div>
              </div>
              <div className="flex-1 flex justify-center items-center">
                {/* Crystal Object with simpler, more professional styling */}
                <div className="relative" style={{ perspective: 1000 }}>
                  <img
                    src="/sky.png"
                    alt="AI Crystal"
                    className="w-full max-w-md object-contain"
                    style={{ 
                      boxShadow: '0 0 30px rgba(79, 209, 197, 0.2)',
                    }}
                  />
                  
                  {/* Professional feature indicators */}
                  <div className="absolute top-0 left-0 transform -translate-x-1/2 -translate-y-1/2 px-3 py-1 bg-purple-500/20 backdrop-blur-sm rounded-sm text-xs text-white">
                    AI Analytics
                  </div>
                  <div className="absolute top-1/4 right-0 transform translate-x-1/2 px-3 py-1 bg-blue-500/20 backdrop-blur-sm rounded-sm text-xs text-white">
                    Real-time Insights
                  </div>
                  <div className="absolute bottom-1/4 left-0 transform -translate-x-1/2 px-3 py-1 bg-teal-500/20 backdrop-blur-sm rounded-sm text-xs text-white">
                    Smart Automation
                  </div>
                  <div className="absolute bottom-0 right-0 transform translate-x-1/3 translate-y-1/3 px-3 py-1 bg-indigo-500/20 backdrop-blur-sm rounded-sm text-xs text-white">
                    Engagement Tools
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section - More professional */}
          <div className="relative bg-black px-4 py-16">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="p-8 text-center border border-purple-500/10 bg-black/50 rounded-lg">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400 mb-2">98%</div>
                  <p className="text-gray-300 text-lg">Audience Satisfaction</p>
                  <div className="mt-4 h-1 w-1/3 mx-auto bg-gradient-to-r from-purple-400 to-teal-400"></div>
                </div>
                
                <div className="p-8 text-center border border-blue-500/10 bg-black/50 rounded-lg">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">10x</div>
                  <p className="text-gray-300 text-lg">Engagement Rate</p>
                  <div className="mt-4 h-1 w-1/3 mx-auto bg-gradient-to-r from-blue-400 to-purple-400"></div>
                </div>
                
                <div className="p-8 text-center border border-teal-500/10 bg-black/50 rounded-lg">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-400 mb-2">35%</div>
                  <p className="text-gray-300 text-lg">Conversion Increase</p>
                  <div className="mt-4 h-1 w-1/3 mx-auto bg-gradient-to-r from-teal-400 to-blue-400"></div>
                </div>
                
                <div className="p-8 text-center border border-indigo-500/10 bg-black/50 rounded-lg">
                  <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400 mb-2">5K+</div>
                  <p className="text-gray-300 text-lg">Global Customers</p>
                  <div className="mt-4 h-1 w-1/3 mx-auto bg-gradient-to-r from-indigo-400 to-violet-400"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section - More professional */}
          <div className="features-section relative bg-black py-24 px-4">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 
                  className="text-4xl md:text-5xl font-bold mb-8" 
                  style={{ 
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif', 
                    background: 'linear-gradient(to right, rgb(192,132,252), rgb(79,209,197))', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Enterprise Features
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">Our platform integrates cutting-edge AI technology with enterprise-grade security and scalability.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                <div className="p-8 border border-purple-500/10 bg-black/50 rounded-lg">
                  <div className="text-purple-400 text-3xl mb-5">
                    <i className="ri-live-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">Live AI Assistance</h3>
                  <p className="text-gray-300">Real-time AI-powered assistance to answer attendee questions and provide insights during your webinar.</p>
                </div>
                
                <div className="p-8 border border-blue-500/10 bg-black/50 rounded-lg">
                  <div className="text-blue-400 text-3xl mb-5">
                    <i className="ri-bar-chart-grouped-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">Advanced Analytics</h3>
                  <p className="text-gray-300">Comprehensive analytics dashboard with engagement metrics, attendee behavior, and conversion tracking.</p>
                </div>
                
                <div className="p-8 border border-teal-500/10 bg-black/50 rounded-lg">
                  <div className="text-teal-400 text-3xl mb-5">
                    <i className="ri-customer-service-2-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">Interactive Engagement</h3>
                  <p className="text-gray-300">Polls, Q&A sessions, breakout rooms, and interactive elements to keep your audience engaged.</p>
                </div>
                
                <div className="p-8 border border-indigo-500/10 bg-black/50 rounded-lg">
                  <div className="text-indigo-400 text-3xl mb-5">
                    <i className="ri-global-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">Global Reach</h3>
                  <p className="text-gray-300">Host webinars for audiences anywhere in the world with localization support and auto-translation.</p>
                </div>
                
                <div className="p-8 border border-pink-500/10 bg-black/50 rounded-lg">
                  <div className="text-pink-400 text-3xl mb-5">
                    <i className="ri-file-list-3-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">Automated Follow-ups</h3>
                  <p className="text-gray-300">Intelligent follow-up system that sends personalized content based on attendee engagement.</p>
                </div>
                
                <div className="p-8 border border-amber-500/10 bg-black/50 rounded-lg">
                  <div className="text-amber-400 text-3xl mb-5">
                    <i className="ri-slideshow-3-line"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white">White-label Solution</h3>
                  <p className="text-gray-300">Full white-label solution with custom branding options to match your company's identity.</p>
                </div>
              </div>
              
              <div className="text-center mt-16">
                <Link href="/features">
                  <button className="px-8 py-4 text-lg font-semibold text-white rounded-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                    Explore All Features
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* AI-Powered Section - More professional */}
          <div className="flex items-center justify-center min-h-screen bg-black px-8">
            <div className="rounded-xl flex flex-col md:flex-row items-center w-full max-w-7xl p-8 md:p-12 gap-8">
              <div className="md:w-1/2 px-4 relative">
                <div className="absolute top-0 left-0 w-32 h-32 -translate-x-16 -translate-y-16 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-40 h-40 translate-x-8 translate-y-8 bg-gradient-to-r from-teal-500/10 to-transparent rounded-full blur-2xl"></div>
                <img src="/imag.png" alt="AI Character" className="object-contain w-full h-auto relative z-10" />
              </div>
              <div className="md:w-1/2 px-4 text-white">
                <h2 
                  style={{ 
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif', 
                    letterSpacing: '1px' 
                  }} 
                  className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-teal-400"
                >
                  AI-Powered Enterprise Solution
                </h2>
                <p className="mb-6 text-lg text-gray-300 leading-relaxed">Our enterprise platform integrates advanced AI technology to enhance every aspect of your webinar experience, from preparation to follow-up.</p>
                <p className="mb-6 text-lg text-gray-300 leading-relaxed">With enterprise-grade security, scalability, and dedicated support, our platform is trusted by leading organizations worldwide.</p>
                
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <SignUpButton mode="modal">
                    <button className="px-8 py-4 text-lg font-semibold text-white rounded-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                      Start Enterprise Trial
                    </button>
                  </SignUpButton>
                  <Link href="/contact">
                    <button className="px-8 py-4 text-lg font-semibold rounded-md text-gray-300 border border-gray-700 hover:border-purple-500/50 hover:text-white transition-all duration-300">
                      Request Demo
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Testimonials Section - More professional */}
          <div className="relative bg-black px-4 py-24">
            <div className="max-w-7xl mx-auto">
              {/* Section heading */}
              <div className="text-center mb-16 relative z-10">
                <h2 
                  className="text-4xl font-bold mb-8" 
                  style={{ 
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif', 
                    background: 'linear-gradient(to right, rgb(96,165,250), rgb(168,85,247))', 
                    WebkitBackgroundClip: 'text', 
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Client Testimonials
                </h2>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                  Trusted by leading organizations worldwide
                </p>
              </div>
              
              {/* Testimonials grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                <div className="p-8 border border-purple-500/10 bg-black/50 rounded-lg relative">
                  <div className="mb-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="ri-star-fill text-yellow-400"></i>
                      ))}
                    </div>
                    <p className="text-gray-300">
                      "The AI-powered features have revolutionized our webinar strategy. We've seen a 40% increase in attendee engagement."
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold">
                      JD
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">Jessica Donovan</div>
                      <div className="text-sm text-gray-400">Marketing Director, TechGrowth</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 border border-blue-500/10 bg-black/50 rounded-lg relative">
                  <div className="mb-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="ri-star-fill text-yellow-400"></i>
                      ))}
                    </div>
                    <p className="text-gray-300">
                      "As an educational institution, we needed a reliable and scalable solution. This platform has exceeded our expectations."
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-teal-600 flex items-center justify-center text-white font-bold">
                      RM
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">Robert Martinez</div>
                      <div className="text-sm text-gray-400">Director of E-Learning, Edu Global</div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 border border-teal-500/10 bg-black/50 rounded-lg relative">
                  <div className="mb-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i key={star} className="ri-star-fill text-yellow-400"></i>
                      ))}
                    </div>
                    <p className="text-gray-300">
                      "The analytics capabilities are incredible. Being able to see real-time engagement metrics has transformed our sales process."
                    </p>
                  </div>
                  
                  <div className="flex items-center mt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                      AK
                    </div>
                    <div className="ml-3">
                      <div className="font-semibold text-white">Alexandra Kim</div>
                      <div className="text-sm text-gray-400">VP of Sales, Innovate Solutions</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Link href="/testimonials">
                  <button className="text-purple-400 hover:text-purple-300 transition-all duration-300 flex items-center gap-2 mx-auto">
                    <span>View more testimonials</span>
                    <i className="ri-arrow-right-line"></i>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* CTA Section - More professional */}
          <div className="relative bg-black px-4 py-24">
            <div className="max-w-5xl mx-auto relative">
              <div className="p-12 md:p-16 rounded-lg border border-purple-500/20 bg-black/50 relative">
                <div className="text-center relative z-10">
                  <h2 
                    className="text-3xl sm:text-4xl font-bold mb-6" 
                    style={{ 
                      fontFamily: 'var(--font-orbitron), system-ui, sans-serif', 
                      background: 'linear-gradient(to right, rgb(192,132,252), rgb(79,209,197))', 
                      WebkitBackgroundClip: 'text', 
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Ready to Transform Your Webinars?
                  </h2>
                  <p className="text-gray-300 text-lg max-w-3xl mx-auto mb-10">
                    Join thousands of businesses that have revolutionized their online events with our enterprise webinar platform.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <SignUpButton mode="modal">
                      <button className="px-10 py-4 text-lg font-semibold text-white rounded-md bg-gradient-to-r from-purple-600/80 to-blue-600/80 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
                        Start Free Trial
                      </button>
                    </SignUpButton>
                    
                    <Link href="/pricing">
                      <button className="px-10 py-4 text-lg font-semibold rounded-md border border-purple-500/30 text-purple-300 hover:text-white hover:border-purple-500/60 transition-all duration-300">
                        View Enterprise Plans
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer - More professional */}
          <div className="w-full bg-black text-white border-t border-gray-800 py-16">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                <div>
                  <Link href="/" className="flex items-center">
                    <div className="flex gap-3 items-center">
                      <div className="lines flex flex-col gap-[3px]">
                        <div className="line w-10 h-1" style={{ background: 'linear-gradient(to right, rgb(192, 132, 252), rgb(79, 209, 197))' }}></div>
                        <div className="line w-6 h-1" style={{ background: 'linear-gradient(to right, rgb(96, 165, 250), rgb(168, 85, 247))' }}></div>
                        <div className="line w-3 h-1" style={{ background: 'linear-gradient(to right, rgb(79, 209, 197), rgb(96, 165, 250))' }}></div>
                      </div>
                      <span 
                        className="text-3xl font-bold"
                        style={{ 
                          fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                          background: 'linear-gradient(to right, rgb(192, 132, 252), rgb(79, 209, 197))',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        AIREACH
                      </span>
                    </div>
                  </Link>
                  <p 
                    className="mt-6 text-gray-400"
                    style={{ 
                      fontFamily: 'var(--font-space-grotesk), system-ui, sans-serif',
                    }}
                  >
                    Enterprise webinar platform with AI-powered tools for maximum conversion.
                  </p>
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                    }}
                  >
                    Platform
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="/features" className="text-gray-400 hover:text-purple-400 transition-all">
                        Features
                      </Link>
                    </li>
                    <li>
                      <Link href="/pricing" className="text-gray-400 hover:text-purple-400 transition-all">
                        Pricing
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Integrations
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Enterprise
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                    }}
                  >
                    Resources
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Documentation
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Guides
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Support
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 
                    className="text-xl font-bold mb-6"
                    style={{ 
                      fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                    }}
                  >
                    Company
                  </h3>
                  <ul className="space-y-4">
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        About
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Careers
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Privacy
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-400 hover:text-purple-400 transition-all">
                        Terms
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500">
                  © {new Date().getFullYear()} 
                  <span style={{ 
                    background: 'linear-gradient(to right, rgb(192, 132, 252), rgb(79, 209, 197))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: 'var(--font-orbitron), system-ui, sans-serif',
                  }}>
                    {' '}AIREACH
                  </span>. All rights reserved.
                </p>
                <div className="flex space-x-6 mt-6 md:mt-0">
                  <Link href="#" className="text-gray-500 hover:text-purple-400 transition-all duration-300">
                    <i className="ri-facebook-fill text-xl"></i>
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-purple-400 transition-all duration-300">
                    <i className="ri-twitter-fill text-xl"></i>
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-purple-400 transition-all duration-300">
                    <i className="ri-instagram-fill text-xl"></i>
                  </Link>
                  <Link href="#" className="text-gray-500 hover:text-purple-400 transition-all duration-300">
                    <i className="ri-github-fill text-xl"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnimatedIntro;