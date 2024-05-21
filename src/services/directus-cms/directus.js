import { createDirectus, staticToken, rest } from '@directus/sdk';

const directus = createDirectus(process.env.DIRECTUS_URL || process.env.NEXT_PUBLIC_DIRECTUS_URL)
  .with(staticToken(process.env.DIRECTUS_TOKEN || process.env.NEXT_PUBLIC_DIRECTUS_TOKEN))
  .with(rest({ cache: 'no-store' }));

export default directus;