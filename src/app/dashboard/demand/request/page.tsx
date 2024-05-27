'use client'

import { useEffect, useState } from 'react'
import { Card, Label, Radio, TextInput, Button } from 'flowbite-react'
import Select from 'react-select'
import {
  CreateSelectOptions,
  ItemOption,
} from '../../../utils/createSelectOptions'
import { Priority } from '@/enums/priority'
import { Controller, useForm } from 'react-hook-form'
import User from '@/components/User'
import { useRouter } from 'next/navigation'
import createItemDirectus from '@/services/directus-cms/createItem'

interface DemandRequest {}

export default function DemandRequest() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm()

  const priorityOptions = Object.entries(Priority).map(([key, value]) => ({
    value: key,
    label: value,
  }))

  const [distributionCenterOptions, setDistributionCenterOptions] = useState<
    ItemOption[]
  >([])
  const [deliveryPointOptions, setDeliveryPointOptions] = useState<
    ItemOption[]
  >([])
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([])
  const [medicationOptions, setMedicationOptions] = useState<ItemOption[]>([])
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const [selectedOption, setSelectedOption] = useState<string>('item')

  const handleOptionChange = (option: string) => {
    setSelectedOption(option)
  }

  const fetchData = async (
    entityType: string,
    idField: string,
    nameField: string,
    setterFunction: Function
  ) => {
    const data = await CreateSelectOptions(entityType, idField, nameField)
    setterFunction(data)
  }

  useEffect(() => {
    fetchData('cd', 'id', 'name', setDistributionCenterOptions)
  }, [])

  useEffect(() => {
    fetchData('delivery_point', 'id', 'address', setDeliveryPointOptions)
  }, [])

  useEffect(() => {
    fetchData('item', 'id', 'name', setItemOptions)
  }, [])

  useEffect(() => {
    fetchData('medication', 'id', 'active_principle', setMedicationOptions)
  }, [])

  const onSubmit = (data: any) => {
    setIsProcessing(true)
    createItemDirectus('demand', data)
      .then(() => router.push('/demand'))
      .catch((err) => console.error(err))
      .finally(() => setIsProcessing(false))
  }

  return (
    <div className='flex flex-col justify-center items-center p-2 w-2/4 m-auto'>
      <div className='w-full'>
        <User />
      </div>

      <Card className='w-full'>
        <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Pedido de Demanda
        </h5>
        <p className='font-normal text-gray-700 dark:text-gray-400'>
          Solicite uma nova demanda de acordo com a necessidade dos abrigos
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='flex gap-2'>
            <div className='w-[70%]'>
              <div className='mb-2 block'>
                <Label
                  htmlFor='distributionCenter'
                  value='Centro de distribuição:'
                />
              </div>
              <div className='flex flex-row gap-4'>
                <Controller
                  name='cd'
                  control={control}
                  render={({ field }) => (
                    <Select
                      required
                      className='w-full'
                      {...field}
                      options={distributionCenterOptions}
                      placeholder='Selecione um centro de distribuição'
                      value={distributionCenterOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                    />
                  )}
                />
              </div>
            </div>
            <div className='flex-grow'>
              <div className='mb-2 block'>
                <Label htmlFor='distributionCenter' value='Prioridade:' />
              </div>
              <div className='flex flex-row gap-4'>
                <Controller
                  name='priority'
                  control={control}
                  render={({ field }) => (
                    <Select
                      required
                      className='w-full'
                      {...field}
                      options={priorityOptions}
                      placeholder='Prioridade'
                      value={priorityOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className='mb-2 block'>
            <Label htmlFor='deliveryPoint' value='Ponto de Entrega:' />
          </div>
          <div className='flex flex-row gap-4'>
            <Controller
              name='delivery_point'
              control={control}
              render={({ field }) => (
                <Select
                  required
                  className='w-full'
                  {...field}
                  options={deliveryPointOptions}
                  placeholder='Selecione um ponto de entrega'
                  value={deliveryPointOptions.find(
                    (option) => option.value === field.value
                  )}
                  onChange={(selectedOption) =>
                    field.onChange(selectedOption?.value)
                  }
                />
              )}
            />
          </div>

          <div className='mt-4 block'>
            <Label
              htmlFor='distributionCenter'
              value='Selecione o tipo de demanda que deseja solicitar:'
            />
          </div>
          <div className='flex gap-2 my-3'>
            <div className='flex items-center'>
              <Radio
                id='itemOption'
                name='selectedOption'
                value='item'
                checked={selectedOption === 'item'}
                onChange={() => handleOptionChange('item')}
                className='mr-2'
              />
              <Label htmlFor='itemOption'>Item</Label>
            </div>
            <div className='flex items-center'>
              <Radio
                id='medicationOption'
                name='selectedOption'
                value='medication'
                checked={selectedOption === 'medication'}
                onChange={() => handleOptionChange('medication')}
                className='mr-2'
              />
              <Label htmlFor='medicationOption'>Medicamento</Label>
            </div>
          </div>

          {selectedOption === 'item' && (
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='distri‰butionCenter' value='Item:' />
              </div>
              <div className='flex flex-row gap-4'>
                <Controller
                  name='item'
                  control={control}
                  render={({ field }) => (
                    <Select
                      className='w-full'
                      {...field}
                      options={itemOptions}
                      placeholder='Selecione um item'
                      value={itemOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                    />
                  )}
                />
              </div>
            </div>
          )}

          {selectedOption === 'medication' && (
            <div>
              <div className='mb-2 block'>
                <Label htmlFor='distributionCenter' value='Medicamento:' />
              </div>
              <div className='flex flex-row gap-4'>
                <Controller
                  name='medication'
                  control={control}
                  render={({ field }) => (
                    <Select
                      className='w-full'
                      {...field}
                      options={medicationOptions}
                      placeholder='Selecione um medicamento'
                      value={medicationOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption?.value)
                      }
                    />
                  )}
                />
              </div>
            </div>
          )}

          <div className='my-6 max-w-'>
            <div className='mb-2 block'>
              <Label htmlFor='quantity' value='Quantidade:' />
            </div>
            <TextInput
              id='quantity'
              type='number'
              placeholder='Informe a quantidade que deseja'
              required
              {...register('quantity', { required: true })}
            />
            {errors.quantity && (
              <span className='text-red-500'>Este campo é obrigatório</span>
            )}
          </div>

          <div className='my-8 flex w-full justify-between'>
            <Button onClick={() => router.push('/demand')} color='warning'>
              Voltar
            </Button>
            <Button isProcessing={isProcessing} type='submit' color='success'>
              Salvar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
