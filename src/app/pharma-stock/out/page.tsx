'use client';

import { useEffect, useRef, useState } from "react";
import { Datepicker, Checkbox, Label, Radio, TextInput, Button } from "flowbite-react";
import Select from 'react-select'
import { CreateSelectOptions } from "../../../utils/createSelectOptions";
import getFields from '@/services/directus-cms/getFields';
import searchItem from '@/services/directus-cms/searchItem';
import useLocalStorageState from "@/hooks/useLocalStorageState";
import { debounce } from "@/utils/input";
import User from "@/components/User";
import { StockInputType, StockInput, saveStock } from "@/services/directus-cms/stock";
import useFlash from "@/hooks/useFlash";
import Link from "next/link";


export default function PharmaStockPage() {

  const [sku, setSku] = useState('');

  const _setSku = debounce((value: string) => {
    setSku(value);
  }, 250);

  const formRef = useRef<HTMLFormElement>(null)

  const [user, setUser] = useLocalStorageState('user', null);

  const [error, setError] = useFlash(null, 1000);
  const [success, setSuccess] = useFlash(null, 1000);

  const [itemType, setItemType] = useState('');
  const [hasDueDate, setHasDueDate] = useState(false);
  const [batch, setBatch] = useState('');

  const [location, setLocation] = useLocalStorageState('location', {}) as any;
  const [locationOptions, setLocationOptions] = useState();

  const [itemCategoryOptions, setItemCategoryOptions] = useState();
  const [itemCategory, setItemCategory] = useState() as any;

  const [concentrationUnitOptions, setConcentrationUnitOptions] = useState() as any;
  const [concentrationUnit, setConcentrationUnit] = useState() as any;
  const [concentration, setConcentration] = useState<number>(0) as any;

  const [medicineFormOptions, setMedicineFormOptions] = useState() as any;
  const [medicineForm, setMedicineForm] = useState() as any;

  const [medicineTherapeuticClassOptions, setMedicineTherapeuticClassOptions] = useState() as any;
  const [medicineTherapeuticClass, setMedicineTherapeuticClass] = useState() as any;

  const [medicationManufacturerOptions, setMedicationManufacturerOptions] = useState() as any;
  const [medicationManufacturer, setMedicationManufacturer] = useState() as any;

  const [currentProduct, setCurrentProduct] = useState() as any;
  const [alreadySearched, setAlreadySearched] = useState(false);

  const [amount, setAmount] = useState(0);
  const [itemName, setItemName] = useState('');
  const [principle, setPrinciple] = useState('');
  const [medicineVolume, setMedicineVolume] = useState(0);
  const [validUntil, setValidUntil] = useState(new Date()) as any;
  const [loading, setLoading] = useState(false);

  const [isVolumeEnabled, setIsVolumeEnabled] = useState(true);

  useEffect(() => {
    
    if (
      medicineForm &&
      ['Comprimido', 'Cápsula', 'Drágea', 'Pílula', 'Supositório', 'pastilha'].includes(medicineForm.label)
    ) {
      setIsVolumeEnabled(false); 
    } else {
      setIsVolumeEnabled(true); 
    }
  }, [medicineForm]);

  useEffect(() => {
    const getMedicationManufacturer = async () => {
      const values = await CreateSelectOptions('medication_manufacturer', 'id', 'name') as any;
      setMedicationManufacturerOptions(values);
    }

    getMedicationManufacturer();
  }, []);

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
      const concentrationUnits = await getFields({ fieldName: 'concentration_unit', collection: 'medication' });
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

      if (item.active_principle) {
        setItemType('medicine')
      } else {
        setItemType('generalItem')
      }

    } else {
      setCurrentProduct()
    }

    setAlreadySearched(true)
  }

  const handleSkuChange = (value: string) => setSku(value);

  useEffect(() => {
    if (sku.length) {
      searchItemBySku(sku);
    } else {
      setCurrentProduct()
      setAlreadySearched(false)
    }
  }, [sku]);

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
    setLocation(value);
  }

  const reset = () => {
    setSku((prev: any) => '');
    setItemType((prev: any) => '');
    setHasDueDate((prev: any) => false);
    setBatch((prev: any) => '');
    setItemCategory((prev: any) => null);
    setConcentrationUnit((prev: any) => null);
    setConcentration((prev: any) => 0);
    setMedicineForm((prev: any) => null);
    setMedicineTherapeuticClass((prev: any) => null);
    setMedicationManufacturer((prev: any) => null);
    setCurrentProduct((prev: any) => null);
    setAlreadySearched((prev: any) => false);
    setAmount((prev: any) => 0);
    setItemName((prev: any) => '');
    setPrinciple((prev: any) => '');
    setMedicineVolume((prev: any) => 0);
    setValidUntil((prev: any) => new Date());

    formRef.current?.reset();
    formRef.current?.querySelector('input')?.focus()
  }

  const createItem = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const isMedicine = itemType === 'medicine';
    const isGeneralItem = itemType === 'generalItem';
    const isFresh = !currentProduct;

    let generalItem = undefined;
    let medicineItem = undefined;

    if (isGeneralItem && isFresh) {
      generalItem = {
        name: itemName,
        category: itemCategory.value,
        unit: 'un',
      }
    }

    if (isMedicine && isFresh) {
      medicineItem = {
        activePrinciple: principle,
        concentration: concentration,
        concentrationUnit: concentrationUnit.value,
        form: medicineForm.value,
        therapeuticClass: medicineTherapeuticClass.value,
        volume: medicineVolume,
      }
    }
  
  

    const input: StockInput = {
      sku,
      itemId: currentProduct?.id,
      inputType: isMedicine ? StockInputType.MEDICINE : StockInputType.GENERAL,
      location: location.value,
      validUntil,
      quantity: amount,
      batch: batch,
      manufacturer: (medicationManufacturer && medicationManufacturer.value) || undefined,
      medicine: medicineItem,
      general: generalItem,
    }

    try {
      const output = await saveStock(input);
      reset()
      setSuccess('Item salvo com sucesso');
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }



  return (
    <div className="w-2/4 m-auto">

      <div className="fixed w-screen top-0 right-0 z-10">
        { error && (
          <div className="w-full p-4 bg-red-500 text-white">
            <p>{ error }</p>
          </div>
        )}
        { success && (
          <div className="w-full p-4 bg-green-500 text-white">
            <p> { success } </p>
          </div>
        )}
      </div>

      <div>
        <User />
      </div>
      
      <div className="mb-2">
        <Link href={'/pharma-stock'} className="text-blue-500 underline ">Ver estoque</Link>
      </div>

      <div className="flex flex-row gap-4">
        <Select
          options={locationOptions}
          value={location}
          className="w-full"
          placeholder="Localização do estoque"
          onChange={(e) => handleChangeLocation(e)}
          isDisabled={!!location || user.stock_location}
          instanceId="location"
        />
        {location && (
          <Button size={'sm'} onClick={() => setLocation(null)} disabled={user.userData.stock_location}>
            Desbloquear
          </Button>
        )}
      </div>

      <form ref={formRef} onSubmit={createItem} className="m-auto">

        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-8">
          Controle de Estoque
        </h5>


        <div className="my-6">
          <div className="mb-2 block">
            <Label htmlFor="sku" value="Código do Item ou Medicamento:" />
          </div>
          <TextInput id="sku" type="text" placeholder="Informe o Código do Item ou Medicamento" required onChange={(e) => _setSku(e.target.value)} />
        </div>

        {currentProduct && (
          <div className="my-6">
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
                <Radio id="generalItem" name="itemType" value="generalItem" onChange={(e) => setItemType('generalItem')} />
                <Label htmlFor="generalItem">Item Geral</Label>
              </div>
              <div className="flex items-center gap-2">
                <Radio id="medicine" name="itemType" value="medicine" onChange={(e) => setItemType('medicine')} />
                <Label htmlFor="medicine">Medicamento</Label>
              </div>
            </fieldset>
            {itemType === 'generalItem' && (
              <>
                <div className="my-6">
                  <div className="mb-2 block">
                    <Label htmlFor="itemName" value="Nome do Item:" />
                  </div>
                  <TextInput id="itemName" type="text" placeholder="Informe o nome do Item" required onChange={(e) => setItemName(e.target.value)} />
                </div>

                <div className="my-6">
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

                <div className="my-6">
                  <div className="mb-2 block">
                    <Label htmlFor="itemMeasure" value="Unidade de Medida:" />
                  </div>
                  <Select options={measureOptions} placeholder="Selecione a unidade de Medida do Item" instanceId="itemMeasure" />
                </div>
              </>
            )}

            {itemType === 'medicine' && (
              <>
                <div className="my-6">
                  <div className="mb-2 block">
                    <Label htmlFor="principle" value="Princípio do Ativo:" />
                  </div>
                  <TextInput id="principle" type="text" placeholder="Informe o principio Ativo do Medicamento" required onChange={(e) => setPrinciple(e.target.value)} />
                </div>

                <div className="my-6">
                  <div className="mb-2 block">
                    <Label htmlFor="medicineForm" value="Forma Farmacêutica:" />
                  </div>
                  <Select
                    options={medicineFormOptions}
                    placeholder="Selecione a forma"
                    instanceId="medicineForm"
                    onChange={(e) => setMedicineForm(e)}
                  />
                </div>
                
                <div className="my-6">
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

                <div className="my-6">
                  <div className="mb-2 block">
                    <Label htmlFor="medicineConcentration" value="Concentração:" />
                  </div>
                  <TextInput id="medicineConcentration" type="number" value={concentration} min={0} placeholder="Concentração" required onChange={(e) => setConcentration(e.target.value)} />
                </div>

               

                
                
                <div className="my-6">
                  <div className="mb-2 block">
                    <Label htmlFor="medicineVolume" value="Volume:" />
                  </div>
                  <TextInput id="medicineVolume" type="number" placeholder="Volume" required onChange={(e) => setMedicineVolume(+e.target.value)} disabled={!isVolumeEnabled} />
                </div>

                <div className="my-6">
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

        <div className="my-6">
          <div className="mb-2 block">
            <Label htmlFor="amount" value="Quantidade:" />
          </div>
          <TextInput id="amount" type="number" placeholder="Informe a Quantidade do item" required onChange={(e) => setAmount(-1 * +e.target.value)} />
        </div>

        {(itemType === 'medicine') && (
          <>
            <div className="my-6">
              <div className="mb-2 block">
                <Label htmlFor="batch" value="Lote:" />
              </div>
              <TextInput id="batch" type="text" placeholder="Informe o Lote" required onChange={(e) => setBatch(e.target.value)} />
            </div>
            <div className="my-6">
              <div className="mb-2 block">
                <Label htmlFor="manufacture" value="Fabricante:" />
              </div>
              <Select
                options={medicationManufacturerOptions}
                placeholder="Selecione o fabricante"
                instanceId="manufacture"
                onChange={(e) => setMedicationManufacturer(e)}
              />
            </div>
          </>
        )}


        {!(itemType === 'medicine') && (
          <>
            <div className="flex items-center gap-2">
              <Checkbox id="dueDate" onChange={(e) => setHasDueDate(e.target.checked)} checked={hasDueDate} />
              <Label htmlFor="dueDate" className="flex">
                Possui data de Vencimento
              </Label>
            </div>
          </>
        )}

        {(hasDueDate || itemType === 'medicine') && (
          <div className="my-6">
            <div className="mb-2 block">
              <Label htmlFor="expireDate" value="Validade:" />
            </div>
            <Datepicker language="pt-BR" labelTodayButton="Hoje" labelClearButton="Limpar" minDate={new Date()} onChange={(e) => setValidUntil(e.target.value)} />
          </div>
        )}

        <div className="my-8">
          <Button color="success" type="submit">Salvar</Button>
        </div>
      </form>

    </div>
  )
}