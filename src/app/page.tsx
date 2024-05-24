'use client';

import { Alert, Button, Card } from "flowbite-react";
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useLocalStorageState from "@/hooks/useLocalStorageState";
import Link from "next/link";

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useLocalStorageState('user', null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [router]);

  return <>
    <div className="main-menu">
      <Link href="/pharma-stock">
        Controle de Estoque de Farmacia
      </Link>
      <Link href="/stock-input">
        Controle de Estoque Geral
      </Link>
    </div>
  </>;
};

export default Home;
