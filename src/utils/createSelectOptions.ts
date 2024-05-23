import getItems from '@/services/directus-cms/getItems';

export interface ItemOption {
  value: string
  label: string
}

export async function CreateSelectOptions(collection: string, key: string, label: string): Promise<ItemOption[]> {
  const items = await getItems({ collection, key: '', fields: ['*'] });
  const options = items.map((item: any) => ({ value: item[key], label: item[label] }));
  return options;
}