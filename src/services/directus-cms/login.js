'use client';

import { createDirectus, staticToken, rest, readMe } from '@directus/sdk';

export async function login(token) {

   const directus = createDirectus(process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL)
      .with(staticToken(token))
      .with(rest({ cache: 'no-store' }));

   try {
      const userData = await directus.request(readMe());
      localStorage.setItem('user', JSON.stringify({ token, userData }));
      return userData;
   } catch (err) {
      console.log(err);
      throw new Error('Invalid token', err);
   }

   return null;
}