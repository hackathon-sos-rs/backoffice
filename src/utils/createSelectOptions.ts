import getItems from '@/services/directus-cms/getItems';

export async function CreateSelectOptions(collection: string, key: string, label: string) {
  const items = await getItems({ collection, key: '', fields: ['*'] });
  const options = items.map((item: any) => ({ value: item[key], label: item[label] }));
  return options;
}