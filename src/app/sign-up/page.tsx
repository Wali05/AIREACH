import React from 'react';
import { SignUp } from '@clerk/nextjs';
import Link from 'next/link';

const SignUpPage = () => {
  return (
    <div className="p-6">
      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to Home
      </Link>
      <h1 className="text-2xl font-bold mt-4">Sign Up</h1>
      <SignUp />
    </div>
  );
};

export default SignUpPage; 