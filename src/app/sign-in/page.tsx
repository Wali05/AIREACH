import React from 'react';
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

const SignInPage = () => {
  return (
    <div className="p-6">
      <Link href="/" className="text-blue-500 hover:underline">
        ← Back to Home
      </Link>
      <h1 className="text-2xl font-bold mt-4">Sign In</h1>
      <SignIn />
    </div>
  );
};

export default SignInPage; 