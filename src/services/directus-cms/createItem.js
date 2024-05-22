import { createItem } from '@directus/sdk';
import directus from './directus';

async function createItemDirectus(collection, data) {
  const result = await directus.request(createItem(collection, data));
  return result;
}

export default createItemDirectus;