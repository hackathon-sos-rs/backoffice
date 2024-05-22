import { readField } from '@directus/sdk';
import directus from './directus';

async function getFields({ fieldName, collection }) {
  const result = await directus.request(readField(collection, fieldName));
  return result.meta.options;
}

export default getFields;