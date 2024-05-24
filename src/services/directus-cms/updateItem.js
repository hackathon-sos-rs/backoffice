import { updateItem } from '@directus/sdk';
import directus from './directus';

async function upadateItemDirectus(collection, data) {
  const result = await directus.request(updateItem(collection, data));
  return result;
}

export default upadateItemDirectus;