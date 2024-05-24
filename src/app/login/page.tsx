'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/directus-cms/login';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import Image from 'next/image';

const Login: React.FC = () => {
  const [user, setUser] = useLocalStorageState('user', null);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userData = await login(token);
      router.push('/');
    } catch (err) {
      setError('Token inválido');
    }
  };

  useEffect(() => {
    if (user && user.token) {
      (async () => {
        const userData = await login(user.token);
        router.push('/stock-input');
      })();
    }
  }, [user]);

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-clouds">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-xs">
          <h1 className="text-xl font-bold mb-4">logRS</h1>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2 text-center" htmlFor="accessToken">
              Token de Acesso
            </label>
            <input
              type="text"
              id="accessToken"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Digite seu token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
          </div>
          <div className="flex flex-col items-center justify-between">
            <button
              type="submit"
              onClick={handleLogin}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
            >
              Entrar
            </button>
            {error && <p className=' text-red-500 pt-5'>{error}</p>}
          </div>
        </div>
      </div>
      <LogoCarousel />
    </>
  );
};


export default Login;

const logos = [
  '/next.svg',
  '/next.svg',
  '/next.svg',
  '/next.svg',
  '/next.svg',
  '/next.svg',
  '/next.svg',
  '/next.svg',
];

const LogoCarousel = () => {
  return (
    <>
      <div className="carousel-container">
        <div className="carousel">
          {logos.map((logo, index) => (
            <Image key={index} src={logo} alt={`Logo ${index + 1}`} width={200} height={50} className="carousel-logo" />
          ))}
          {logos.map((logo, index) => (
            <Image key={index + logos.length} src={logo} alt={`Logo ${index + 1}`} width={200} height={50} className="carousel-logo" />
          ))}
        </div>
      </div>
    </>
  );
};

