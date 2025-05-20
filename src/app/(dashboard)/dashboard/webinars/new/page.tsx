'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import WebinarForm from '@/components/WebinarForm';

export default function NewWebinarPage() {
  const router = useRouter();

  // Handle form submission to create a new webinar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleWebinarCreate = async (data: any) => {
    try {
      const res = await fetch('/api/webinars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to create webinar');
      const webinar = await res.json();
      router.push(`/dashboard/webinars/${webinar.id}`);
    } catch (error) {
      console.error(error);
      alert('Error creating webinar, please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Create New Webinar</h1>
      <WebinarForm onSubmit={handleWebinarCreate} />
    </div>
  );
}