'use client'

import { useEffect, useState } from 'react'
import { Card, Label, Radio, TextInput, Button, Table } from 'flowbite-react'
import Select from 'react-select'
import { CreateSelectOptions } from '../../../utils/createSelectOptions'
import { Priority } from '@/enums/priority'
import { Controller, useForm } from 'react-hook-form'
import getItens from '@/services/directus-cms/getItems'

interface DemandItem {
  id: number
  created_at: Date
  delivery_point: number | null
  cd: number | null
  item: number | null
  medication: number | null
  priority: keyof typeof Priority | null
  quantity: string | null
  updated_at: Date | null
}

export default function DemandInbox() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm()

  const priorityOptions = Object.entries(Priority).map(([key, value]) => ({
    value: key,
    label: value,
  }))

  const [distributionCenterOptions, setDistributionCenterOptions] = useState([])
  const [deliveryPointOptions, setDeliveryPointOptions] = useState()
  const [itemOptions, setItemOptions] = useState()
  const [medicationOptions, setMedicationOptions] = useState()
  const [demands, setDemands] = useState<DemandItem[]>([])
  const [moreFilters, setMoreFilters] = useState<boolean>(false)

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
    const findAllDemand = async () => {
      const data = (await getItens({
        searchField: 'priority',
        searchValue: 'urgente',
        collection: 'demand',
        fields: '*',
      })) as []
      setDemands(data)
    }

    findAllDemand()
  }, [])

  const onSearch = (data: any) => {
    console.log(data)
  }

  const handleMoreFilters = () => {
    setMoreFilters(!moreFilters)
  }

  const formatDateTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }
    console.log(date)
    return (
      date?.toLocaleDateString('pt-BR', options) +
      ' ' +
      date?.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    )
  }

  return (
    <div className='flex justify-center items-end'>
      <Card className='min-w-sm'>
        <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Demo - Demandas Solicitadas
        </h5>
        <p className='font-normal text-gray-700 dark:text-gray-400'>
          Aqui você está vendo as demandas mais recentes
        </p>

        <div>
          <h3 className='font-bold tracking-tight text-gray-900 dark:text-white'>
            Filtros
          </h3>
          <form onSubmit={handleSubmit(onSearch)}>
            <div className='flex gap-2 my-1 items-center'>
              <div className='w-[50%]'>
                <div className='mb-2 block'>
                  <Label
                    htmlFor='distributionCenter'
                    value='Centro de distribuição:'
                  />
                </div>
                <div className='flex flex-row gap-4'>
                  <Controller
                    name='distributionCenter'
                    control={control}
                    render={({ field }) => (
                      <Select
                        className='w-full'
                        {...field}
                        options={distributionCenterOptions}
                        placeholder='Centro de distribuição'
                      />
                    )}
                  />
                </div>
              </div>
              <div className='w-[30%]'>
                <div className='mb-2 block'>
                  <Label htmlFor='distributionCenter' value='Prioridade:' />
                </div>
                <div className='flex flex-row gap-4'>
                  <Controller
                    name='priority'
                    control={control}
                    render={({ field }) => (
                      <Select
                        className='w-full'
                        {...field}
                        options={priorityOptions}
                        placeholder='Prioridade'
                      />
                    )}
                  />
                </div>
              </div>

              <div className='flex justify-end gap-2 w-[22%] pt-8'>
                <Button type='submit' color='success'>
                  Filtrar
                </Button>
                <Button color='blue' onClick={handleMoreFilters}>
                  {moreFilters ? '-' : '+'} Filtros
                </Button>
              </div>
            </div>

            {moreFilters && (
              <div>
                <div className='flex gap-2 items-center my-1'>
                  <div className='w-1/3'>
                    <div className='mb-2 block'>
                      <Label
                        htmlFor='deliveryPoint'
                        value='Ponto de Entrega:'
                      />
                    </div>
                    <div className='flex flex-row gap-4'>
                      <Controller
                        name='deliveryPoint'
                        control={control}
                        render={({ field }) => (
                          <Select
                            className='w-full'
                            {...field}
                            options={deliveryPointOptions}
                            placeholder='Ponto de entrega'
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='w-1/3'>
                    <div className='mb-2 block'>
                      <Label htmlFor='distributionCenter' value='Item:' />
                    </div>
                    <div className='flex-row'>
                      <Controller
                        name='item'
                        control={control}
                        render={({ field }) => (
                          <Select
                            className='w-full'
                            {...field}
                            options={itemOptions}
                            placeholder='Selecione um item'
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className='w-1/3'>
                    <div className='mb-2 block'>
                      <Label
                        htmlFor='distributionCenter'
                        value='Medicamento:'
                      />
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
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className='w-1/3'>
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
                      <span className='text-red-500'>
                        Este campo é obrigatório
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>

        <Table>
          <Table.Head>
            <Table.HeadCell>Data de criação</Table.HeadCell>
            <Table.HeadCell>Centro de Distribuição</Table.HeadCell>
            <Table.HeadCell>Prioridade</Table.HeadCell>
            <Table.HeadCell>Item/Medicamento</Table.HeadCell>
            <Table.HeadCell>Quantidade</Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y'>
            {demands?.map((demand: DemandItem) => (
              <Table.Row key={demand.id}>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {formatDateTime(new Date(demand.created_at))}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {demand?.cd}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {demand.priority ? Priority[demand.priority] : ' - '}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {demand?.item || demand?.medication}
                </Table.Cell>
                <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                  {demand?.quantity}
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Card>
    </div>
  )
}
