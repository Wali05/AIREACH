'use client';

import AnimatedIntro from '@/components/AnimatedIntro';
import { Navbar } from '@/components/Navbar.tsx';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <AnimatedIntro />
    </div>
  );
}