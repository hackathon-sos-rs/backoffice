import getItens from './getItems';

async function searchItem(sku) {
  const searchItemsReq = getItens({ searchField: 'ref_id', searchValue: sku, collection: 'item' });
  const searchMedicinesReq = getItens({searchField: 'sku', searchValue: sku, collection: 'medication' });
  
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