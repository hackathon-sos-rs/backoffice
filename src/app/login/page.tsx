'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { createDirectus, rest, createItem } from '@directus/sdk';

const Login: React.FC = () => {
  const [token, setToken] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const client = 'https://sos-rs-stock-qa.star-ai.app/server/specs/graphql';
  const handleLogin = async () => {
    try {
      const response = await axios.get(client, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        localStorage.setItem('accessToken', token);
        router.push('/logado');
      } else {
        setError('Token inválido');
      }
    } catch (err) {
      setError('Token inválido');
    }
  };

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
      </form>
    </div>
  );
};

export default Login;
