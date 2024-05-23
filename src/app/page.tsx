'use client';

import { Alert, Button, Card } from "flowbite-react";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Home: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return null;
};

export default Home;
