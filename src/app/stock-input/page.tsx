'use client';

import { Card, Dropdown, Label, Radio, TextInput } from "flowbite-react";
import { useState } from "react";

export default function StockInput() {
  const [itemType, setItemType] = useState('');

  const handleSkuChange = (value: string) => {
    console.log(value);
  }

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
          <div className="form max-w-sm">
            <div className="mb-2 block">
              <Label htmlFor="location" value="Localização:" />
            </div>
            <Dropdown label="Selecione a Localização" dismissOnClick={true}>
              <Dropdown.Item>Estoque 1</Dropdown.Item>
              <Dropdown.Item>Estoque 2</Dropdown.Item>
            </Dropdown>
          </div>

          <div className="my-6 max-w-sm">
            <div className="mb-2 block">
              <Label htmlFor="sku" value="SKU:" />
            </div>
            <TextInput id="sky" type="text" placeholder="Informe o SKU do Produto" required onChange={(e) => handleSkuChange(e.target.value)} />
          </div>

        
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
                <Dropdown label="Selecione a Categoria" dismissOnClick={true}>
                  <Dropdown.Item>Categoria 1</Dropdown.Item>
                  <Dropdown.Item>Categoria 2</Dropdown.Item>
                </Dropdown>
              </div>
            </>
          )}

          { itemType === 'medicine' && (
            <>
              <div className="my-6 max-w-sm">
                <div className="mb-2 block">
                  <Label htmlFor="principle" value="Princípio do Ativo:" />
                </div>
                <TextInput id="principle" type="text" placeholder="Informe o principio Ativo do Medicamento" required />
              </div>

              <div className="my-6 max-w-sm">
                <div className="mb-2 block">
                  <Label htmlFor="medicineCategory" value="Categoria:" />
                </div>
                <Dropdown label="Selecione a Categoria" dismissOnClick={true}>
                  <Dropdown.Item>Categoria 1</Dropdown.Item>
                  <Dropdown.Item>Categoria 2</Dropdown.Item>
                </Dropdown>
              </div>

              <div className="my-6 max-w-sm">
                <div className="mb-2 block">
                  <Label htmlFor="medicineDosage" value="Dosagem:" />
                </div>
                <TextInput id="medicineDosage" type="text" placeholder="Informe a Dosagem" required />
              </div>
            </>
          )}

        </form>
      </Card>
    </div>
  )
}