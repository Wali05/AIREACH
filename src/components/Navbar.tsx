'use client';

import React from 'react';
import { FloatingNav } from './ui/floating-navbar';
import { IconHome, IconMessage, IconUser, IconBriefcase, IconTag } from "@tabler/icons-react";
import { useUser } from '@clerk/nextjs';

export function Navbar() {
  const { isSignedIn } = useUser();

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-white" />,
    },
    {
      name: "Features",
      link: "/features",
      icon: <IconBriefcase className="h-4 w-4 text-white" />,
      isDropdown: true,
      dropdownItems: [
        {
          name: "AI-Powered Webinars",
          link: "/features/webinars",
        },
        {
          name: "Advanced Analytics",
          link: "/features/analytics",
        },
        {
          name: "Integrations",
          link: "/features/integrations",
        },
        {
          name: "Automation Tools",
          link: "/features/automation",
        },
      ],
    },
    {
      name: "Solutions",
      link: "/solutions",
      icon: <IconTag className="h-4 w-4 text-white" />,
      isDropdown: true,
      dropdownItems: [
        {
          name: "Marketing Teams",
          link: "/solutions/marketing",
        },
        {
          name: "Sales Teams",
          link: "/solutions/sales",
        },
        {
          name: "Educational Institutions",
          link: "/solutions/education",
        },
        {
          name: "Enterprise Solutions",
          link: "/solutions/enterprise",
        },
      ],
    },
    {
      name: "Pricing",
      link: "/pricing",
      icon: <IconTag className="h-4 w-4 text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: <IconMessage className="h-4 w-4 text-white" />,
    },
  ];

  if (isSignedIn) {
    navItems.unshift({
      name: "Dashboard",
      link: "/dashboard",
      icon: <IconUser className="h-4 w-4 text-white" />,
    });
  }

  return (
    <FloatingNav navItems={navItems} />
  );
} 