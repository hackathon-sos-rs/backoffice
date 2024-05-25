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
import { StockInputType, StockInput, saveStock, findStock, PharmStockModifier, bumpPharmStock } from "@/services/directus-cms/stock";
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
  const [currentProductStock, setCurrentProductStock] = useState() as any;
  const [alreadySearched, setAlreadySearched] = useState(false);

  const [amount, setAmount] = useState(0);
  const [itemName, setItemName] = useState('');
  const [principle, setPrinciple] = useState('');
  const [medicineVolume, setMedicineVolume] = useState(0);
  const [validUntil, setValidUntil] = useState(new Date()) as any;
  const [loading, setLoading] = useState(false);

  const [isVolumeEnabled, setIsVolumeEnabled] = useState(true);
  const [amountBreakdown, setAmountBreakdown] = useState<Record<string, number>>({});
  const [totalAmount, setTotalAmount] = useState(0);

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

  useEffect(() => {
    if (currentProduct) {
      (async () => {
        const stock = await findStock(currentProduct.id);
        setCurrentProductStock(stock);
      })();
    }
  }, [currentProduct])

  useEffect(() => {
    setTotalAmount(Object.values(amountBreakdown).reduce((acc, curr) => acc + curr, 0));
  }, [amountBreakdown])

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

  const pushAmount = (batch: string, amount: number) => {
    setAmountBreakdown((prev: any) => {
      return {
        ...prev,
        [batch]: amount
      }
    });
  }

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
    setCurrentProductStock((prev: any) => null);
    setTotalAmount((prev: any) => 0);
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

  const saveStock = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    const input: PharmStockModifier = {
      medicationId: currentProduct.id,
      location: location.value,
      batchBreakdown: Object.entries(amountBreakdown).map(([batch, amount]) => ({ batch, amount })),
      operation: 'out'
    }

    try {
      const output = await bumpPharmStock(input);
      reset();
      setSuccess('Baixa de estoque realizada com sucesso!');
    } catch (err: any) {
      setError(err.message);
    }

    setLoading(false);
  }

  return (
    <div className="w-2/4 m-auto">

      <div className="fixed w-screen top-0 right-0 z-10">
        {error && (
          <div className="w-full p-4 bg-red-500 text-white">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="w-full p-4 bg-green-500 text-white">
            <p> {success} </p>
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

      <form ref={formRef} onSubmit={saveStock} className="m-auto">

        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mt-8">
          Saída de Estoque
        </h5>

        <div className="my-6">
          <div className="mb-2 block">
            <Label htmlFor="sku" value="Código do Medicamento:" />
          </div>
          <TextInput id="sku" type="text" placeholder="Informe o Código do Medicamento" required onChange={(e) => _setSku(e.target.value)} />
        </div>

        {currentProduct && (
          <div className="my-6">
            <div className="mb-2 block">
              <Label htmlFor="productName" value={`${currentProduct.active_principle ? 'Medicamento:' : 'Produto:'}`} />
            </div>
            <TextInput id="productName" type="text" placeholder="Nome do Produto" value={`${currentProduct.active_principle} ${currentProduct.concentration}${currentProduct.concentration_unit} - ${currentProduct.manufacturer.name}`} disabled />
          </div>
        )}

        {currentProductStock && currentProductStock.batchs && currentProductStock.batchs.length > 1 && (
          <>
            <div className="my-6 flex gap-5">
              {currentProductStock.batchs.filter((batch: any) => batch.amount > 0).map((batch: any, index: number) => (
                <BatchInput batch={batch} key={index} onAmountChange={(amount) => pushAmount(batch.batch, amount)} />
              ))}
            </div>
          </>
        )}
        
        <p>
          Total de medicamentos: {totalAmount}
        </p>

        <div className="my-8">
          <Button color="success" type="submit" disabled={totalAmount === 0}>Salvar</Button>
        </div>
      </form>

    </div>
  )
}

const BatchInput = ({ onAmountChange, batch }: { batch: { index: number, batch: string, amount: number, validUntil: string }, onAmountChange?: (amount: number) => void }) => {
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (amount && amount > batch.amount) {
      setAmount(batch.amount);
      return;
    }
    if (amount && amount < 0) {
      setAmount(1);
      return;
    }
    onAmountChange?.(amount || 0)
  }, [amount])

  return (
    <div className="w-2/5" key={batch.index}>
      <div className="mb-2 block">
        <Label htmlFor="batch" value={`Lote ${batch.batch}`} />
      </div>
      <TextInput id={"batch" + batch.batch} value={amount} type="number" min={0} max={batch.amount} placeholder="Informe a quantidade" required={!!amount} onChange={(e) => setAmount(parseInt(e.target.value) || 0)} />
      <small className=" text-sm italic ">Saldo: {batch.amount - amount} validade: {(batch.validUntil && formatDate(new Date(batch.validUntil))) || 'N/A'}</small>
    </div>
  )
}


function formatDate(date: Date) {
  return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
}