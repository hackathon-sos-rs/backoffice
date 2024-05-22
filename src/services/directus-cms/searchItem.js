import getItems from './getItems';

async function searchItem(sku) {
  if (!sku.length) { return []; }
  const searchItemsReq = getItems({ searchField: 'ref_id', searchValue: sku, collection: 'item' });
  const searchMedicinesReq = getItems({ searchField: 'sku', searchValue: sku, collection: 'medication' });

  const [searchItems, searchMedicines] = await Promise.all([searchItemsReq, searchMedicinesReq]);

  if (searchItems.length) {
    return searchItems;
  }

  if (searchMedicines.length) {
    return searchMedicines;
  }

  return [];
}

export default searchItem;