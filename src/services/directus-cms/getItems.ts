import { readItems } from '@directus/sdk';
import directus from './directus';

async function getItems({ searchField, searchValue, fields = ["*"], collection, filterRules = undefined }: { searchField?: string, searchValue?: string, fields: string[], collection: string, filterRules?: any }) {
  let filter: any = {};

  if ((typeof searchField === 'string')) {
    filter[searchField] = {
      _eq: searchValue
    };
  }

  if (filterRules) {
    filter = { ...filterRules }
  }

  return directus.request(readItems(collection, {
    filter,
    fields: fields
  }));
}

export default getItems;