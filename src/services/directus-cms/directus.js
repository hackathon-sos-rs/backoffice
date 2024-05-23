import { createDirectus, staticToken, rest } from '@directus/sdk';

const token = JSON.parse(localStorage.getItem('user')).token;

const directus = createDirectus(process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(staticToken(token))
  .with(rest({ cache: 'no-store' }));

export default directus;