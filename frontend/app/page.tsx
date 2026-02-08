'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import '../styles/globals.css';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = auth.getToken();
    if (token) {
      router.push('/feed');
    } else {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="container">
      <div className="card">
        <h1>Welcome to Social Media App</h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
}
