'use client';

import { useEffect, useState } from "react";
import { Card, Datepicker, Checkbox, Label, Radio, TextInput, Button } from "flowbite-react";
import Select from 'react-select'
import { CreateSelectOptions } from "../../utils/createSelectOptions";
import getFields from '@/services/directus-cms/getFields';
import searchItem from '@/services/directus-cms/searchItem';



export default function StockInput() {
  const [itemType, setItemType] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);

  const [location, setLocation] = useState() as any;
  const [locationOptions, setLocationOptions] = useState();

  const [itemCategoryOptions, setItemCategoryOptions] = useState();
  const [itemCategory, setItemCategory] = useState() as any;

  const [concentrationUnitOptions, setConcentrationUnitOptions] = useState() as any;
  const [concentrationUnit, setConcentrationUnit] = useState() as any;

  const [medicineFormOptions, setMedicineFormOptions] = useState() as any;
  const [medicineForm, setMedicineForm] = useState() as any;

  const [medicineTherapeuticClassOptions, setMedicineTherapeuticClassOptions] = useState() as any;
  const [medicineTherapeuticClass, setMedicineTherapeuticClass] = useState() as any;

  const [currentProduct, setCurrentProduct] = useState() as any;
  const [alreadySearched, setAlreadySearched] = useState(false);


  useEffect(() => {
    const getLocationsItems = async () => {
      const locations = await CreateSelectOptions('stock_location', 'id', 'name') as any;
      setLocationOptions(locations);
    }

    getLocationsItems();
  }, []);

  useEffect(() => {
    const getItemCategoryOptions = async () => {
      const categories = await CreateSelectOptions('category', 'id', 'name') as any;
      setItemCategoryOptions(categories);
    }

    getItemCategoryOptions();
  }, []);

  useEffect(() => {
    const getConcentrationUnitOptions = async () => {
      const concentrationUnits = await getFields({ fieldName: 'concentration_unit', collection: 'medication'});
      setConcentrationUnitOptions(concentrationUnits.choices.map((choice: any) => ({ value: choice.value, label: choice.text })));
    }

    getConcentrationUnitOptions();
  }, []);

  useEffect(() => {
    const getMedicineFormOptions = async () => {
      const formOptions = await CreateSelectOptions('pharma_form', 'id', 'form') as any;
      setMedicineFormOptions(formOptions);
    }

    getMedicineFormOptions();
  }, []);

  useEffect(() => {
    const getTherapeuticClassOptions = async () => {
      const therapeuticClasses = await CreateSelectOptions('pharma_therapeutic_classes', 'id', 'name') as any;
      setMedicineTherapeuticClassOptions(therapeuticClasses);
    }

    getTherapeuticClassOptions();
  }, []);

  const searchItemBySku = async (sku: string) => {
    const [item] = await searchItem(sku) as any;
    if (item) {
      setCurrentProduct(item)
    } else {
      setCurrentProduct()
    }

    setAlreadySearched(true)
  }

  const handleSkuChange = (value: string) => {
    if (value.length >=  4) {
      searchItemBySku(value);
    }
  }

  const measureOptions = [
    { value: 'un', label: 'Unidade (UN)' },
    { value: 'kg', label: 'Quilo (KG)' },
    { value: 'fardo', label: 'Fardo' },
    { value: 'pacote', label: 'Pacote' },
    { value: 'par', label: 'Par' },
    { value: 'caixa', label: 'Caixa' },
    { value: 'litro', label: 'Litro (L)' },
  ];

  const handleChangeLocation = (value: any) => {
    if (!location) {
      setLocation(value);
    }
  }

  // create a ref for each field to pass on enter

  return (
     <div>

      <Card className="min-w-full">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Demo - Inclusão de Estoque
        </h5>
        <p className="font-normal text-gray-700 dark:text-gray-400">
          Insira cuidadosamente os itens no estoque para que eles tenham um controle eficiente.
        </p>

        <form>
          <div className="mb-2 block">
            <Label htmlFor="location" value="Localização:" />
          </div>
          <div className="flex flex-row gap-4">
            <Select 
              options={locationOptions}
              placeholder="Selecione a localização do estoque" 
              onChange={(e) => handleChangeLocation(e)}
              isDisabled={!!location}
              instanceId="location"
            />

            {location && (
              <Button onClick={() => setLocation('')}>Unlock</Button>
            )}
          </div>

          <div className="my-6 max-w-sm">
            <div className="mb-2 block">
              <Label htmlFor="sku" value="SKU:" />
            </div>
            <TextInput id="sky" type="text" placeholder="Informe o SKU do Produto" required onChange={(e) => handleSkuChange(e.target.value)} />
          </div>

          {currentProduct && (
            <div className="my-6 max-w-sm">
              <div className="mb-2 block">
                <Label htmlFor="productName" value={`${currentProduct.active_principle ? 'Medicamento:' : 'Produto:'}`} />
                </div>
                <TextInput id="productName" type="text" placeholder="Nome do Produto" value={currentProduct.name || currentProduct.active_principle} disabled />
            </div>
          )}

          {(!currentProduct && alreadySearched) && (
            <>
              <fieldset className="flex max-w-md flex-col gap-4">
                  <legend className="mb-4">Selecione o tipo do Item:</legend>
                  <div className="flex items-center gap-2">
                    <Radio id="geralItem" name="itemType" value="geralItem" onChange={(e) => setItemType('geralItem')} />
                    <Label htmlFor="geralItem">Item Geral</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Radio id="medicine" name="itemType" value="medicine" onChange={(e) => setItemType('medicine')} />
                    <Label htmlFor="medicine">Medicamento</Label>
                  </div>
              </fieldset>
              { itemType === 'geralItem' && (
                <>
                  <div className="my-6 max-w-sm">
                    <div className="mb-2 block">
                      <Label htmlFor="itemName" value="Nome do Item:" />
                    </div>
                    <TextInput id="itemName" type="text" placeholder="Informe o nome do Item" required />
                  </div>

                  <div className="my-6 max-w-sm">
                    <div className="mb-2 block">
                      <Label htmlFor="itemCategory" value="Categoria:" />
                    </div>
                    <Select 
                      options={itemCategoryOptions} 
                      placeholder="Selecione a categoria do Item" 
                      instanceId="itemCategory" 
                      onChange={(e) => setItemCategory(e)}
                    />
                  </div>

                  <div className="my-6 max-w-sm">
                    <div className="mb-2 block">
                      <Label htmlFor="itemMeasure" value="Unidade de Medida:" />
                    </div>
                    <Select options={measureOptions} placeholder="Selecione a unidade de Medida do Item" instanceId="itemMeasure"  />
                  </div>
                </>
              )}

              {itemType === 'medicine' && (
                  <>
                    <div className="my-6 max-w-sm">
                      <div className="mb-2 block">
                        <Label htmlFor="principle" value="Princípio do Ativo:" />
                      </div>
                      <TextInput id="principle" type="text" placeholder="Informe o principio Ativo do Medicamento" required />
                    </div>

                    <div className="my-6 max-w-sm">
                      <div className="mb-2 block">
                        <Label htmlFor="medicineConcentration" value="Concentração:" />
                      </div>
                      <TextInput id="medicineConcentration" type="number" placeholder="Concentração" required />
                    </div>

                    <div className="my-6 max-w-sm">
                      <div className="mb-2 block">
                        <Label htmlFor="medicineConcentrationUnit" value="Unidade da Concentração:" />
                      </div>
                      <Select 
                        options={concentrationUnitOptions} 
                        placeholder="Selecione a unidade de concentração" 
                        instanceId="medicineConcentrationUnit" 
                        onChange={(e) => setConcentrationUnit(e)}
                      />
                    </div>

                    <div className="my-6 max-w-sm">
                      <div className="mb-2 block">
                        <Label htmlFor="medicineForm" value="Forma:" />
                      </div>
                      <Select 
                        options={medicineFormOptions}
                        placeholder="Selecione a forma" 
                        instanceId="medicineForm"
                        onChange={(e) => setMedicineForm(e)}
                      />
                    </div>

                    <div className="my-6 max-w-sm">
                      <div className="mb-2 block">
                        <Label htmlFor="medicineVolume" value="Volume:" />
                      </div>
                      <TextInput id="medicineVolume" type="number" placeholder="Volume" required />
                    </div>

                    <div className="my-6 max-w-sm">
                      <div className="mb-2 block">
                        <Label htmlFor="medicineTherapeuticClass" value="Classe Terapêutica:" />
                      </div>
                      <Select 
                        options={medicineTherapeuticClassOptions}
                        placeholder="Selecione a classe"
                        instanceId="medicineTherapeuticClass"
                        onChange={(e) => setMedicineTherapeuticClass(e)}
                      />
                    </div>

                  </>
                )}
            </>
          )}

            <div className="my-6 max-w-sm">
               <div className="mb-2 block">
                  <Label htmlFor="amount" value="Quantidade:" />
                </div>
                <TextInput id="amount" type="number" placeholder="Informe a Quantidade do item" required />
            </div>


            {!(itemType === 'medicine') && (
              <div className="flex items-center gap-2">
                <Checkbox id="dueDate" onChange={(e) => setHasDueDate(e.target.checked)} checked={hasDueDate} />
                <Label htmlFor="dueDate" className="flex">
                  Possui data de Vencimento
                </Label>
              </div>
            )}

            {(hasDueDate || itemType === 'medicine') && (
              <div className="my-6 max-w-sm">
              <div className="mb-2 block">
                 <Label htmlFor="expireDate" value="Validade:" />
               </div>
               <Datepicker language="pt-BR" labelTodayButton="Hoje" labelClearButton="Limpar" minDate={new Date()} />
            </div>
            )}
            
            <div className="my-8">
              <Button color="success">Salvar</Button>
            </div>
        </form>
      </Card>
    </div>
  )
}