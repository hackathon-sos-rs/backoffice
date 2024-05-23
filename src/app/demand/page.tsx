'use client'

import { useEffect, useState } from 'react'
import { Card, Label, Button, Table, Badge } from 'flowbite-react'
import Select from 'react-select'
import {
  CreateSelectOptions,
  ItemOption,
} from '../../utils/createSelectOptions'
import { Priority, getPriorityColor } from '@/enums/priority'
import { Controller, useForm } from 'react-hook-form'
import getItens from '@/services/directus-cms/getItems'
import User from '@/components/User'
import { formatDateTime } from '@/utils/dateUtils'
import { findItemById } from '@/utils/itemsUtils'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()

  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm()

  const [distributionCenterOptions, setDistributionCenterOptions] = useState<
    ItemOption[]
  >([])
  const [deliveryPointOptions, setDeliveryPointOptions] = useState<
    ItemOption[]
  >([])
  const [itemOptions, setItemOptions] = useState<ItemOption[]>([])
  const [medicationOptions, setMedicationOptions] = useState<ItemOption[]>([])
  const [demands, setDemands] = useState<DemandItem[]>([])
  const selectedCD = watch('cd')

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

  const findAllDemand = async (collection?: string, searchValue?: string) => {
    const data = (await getItens({
      searchField: collection && searchValue ? collection : null,
      searchValue: collection && searchValue ? searchValue : null,
      collection: 'demand',
      fields: '*',
    })) as []
    setDemands(data)
  }

  useEffect(() => {
    findAllDemand()
  }, [])

  const onSearch = (data: any) => {
    findAllDemand('cd', data?.cd?.value)
  }

  const handleReset = () => {
    reset({ cd: null })
    findAllDemand()
  }

  return (
    <div className='flex flex-col justify-center items-center p-2'>
      <div className='w-full'>
        <User />
      </div>

      <Card className='w-full'>
        <div className='flex w-full justify-between'>
          <h5 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Demo - Demandas Solicitadas
          </h5>
          <Button onClick={() => router.push('demand/request')} color='success'>
            Solicitar
          </Button>
        </div>
        <p className='font-normal text-gray-700 dark:text-gray-400'>
          Aqui você está vendo as demandas mais recentes
        </p>

        <div>
          <h3 className='font-bold tracking-tight text-gray-900 dark:text-white'>
            Filtros
          </h3>
          <form onSubmit={handleSubmit(onSearch)}>
            <div className='flex gap-2 my-1 items-center'>
              <div className='sm:w-1/2 w-2/3'>
                <div className='mb-2 block'>
                  <Label htmlFor='cd' value='Centro de distribuição:' />
                </div>
                <div className='flex flex-row gap-4'>
                  <Controller
                    name='cd'
                    control={control}
                    render={({ field }) => (
                      <Select
                        className='w-full'
                        {...field}
                        options={distributionCenterOptions}
                        placeholder='CD'
                      />
                    )}
                  />
                </div>
              </div>

              <div className='flex gap-1 sm:gap-2 sm:flex-grow sm:1/2 pt-8'>
                <Button type='submit' color='info'>
                  Filtrar
                </Button>
                <Button onClick={handleReset} color='warning'>
                  Resetar
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <Table.Head>
              <Table.HeadCell>Data de criação</Table.HeadCell>
              <Table.HeadCell>Centro de Distribuição</Table.HeadCell>
              <Table.HeadCell>Ponto de Entrega</Table.HeadCell>
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
                    {demand.cd
                      ? findItemById(
                          'label',
                          'value',
                          demand.cd,
                          distributionCenterOptions
                        )
                      : '-'}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                    {demand.delivery_point
                      ? findItemById(
                          'label',
                          'value',
                          demand.delivery_point,
                          deliveryPointOptions
                        )
                      : '-'}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                    {demand.priority ? (
                      <Badge
                        color={getPriorityColor(Priority[demand.priority])}
                      >
                        {Priority[demand.priority]}
                      </Badge>
                    ) : (
                      ' - '
                    )}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                    {demand.item
                      ? 'Item: ' +
                        findItemById('label', 'value', demand.item, itemOptions)
                      : demand.medication
                      ? 'Medicamento: ' +
                        findItemById(
                          'label',
                          'value',
                          demand.medication,
                          medicationOptions
                        )
                      : '-'}
                  </Table.Cell>
                  <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
                    {demand?.quantity}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </Card>
    </div>
  )
}
