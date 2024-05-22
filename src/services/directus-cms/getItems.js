import { readItems } from '@directus/sdk';
import directus from './directus';

async function getItems({ searchField, searchValue, fields, collection }) {
  const filter = {};

  if (searchField) {
    filter[searchField] = {
      _eq: searchValue
    };
  }

  return directus.request(readItems(collection, {
    filter,
    fields: fields || '*',
  }));
}

export default getItems;