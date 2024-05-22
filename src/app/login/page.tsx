'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/services/directus-cms/login';
import useLocalStorageState from '@/hooks/useLocalStorageState';

const Login: React.FC = () => {
  const [user, setUser] = useLocalStorageState('user', null);
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userData = await login(token);
      router.push('/stock-input');
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
    <div>
      <h1>Login</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div>
          <label htmlFor="token">Token de Acesso</label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>
        <button type="button" onClick={handleLogin}>Logar</button>
        { error && <p>{error}</p> }
      </form>
    </div>
  );
};

export default Login;
