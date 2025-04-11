'use client'

import { useState, useEffect } from 'react'

import { PageHeader } from '@/components/page-header'
import SelectColmado from "@/components/select-colmado"
import { getColmadosDetails } from "@/services/ventas-service"

import { ColmadoKey } from '@/types'

export default function RegisterBalance() {
  const [colmados, setColmados] = useState<{ key: string; name: string; balanceDate: number }[]>([])
  const [colmado, setColmado] = useState<ColmadoKey>("o7")

  useEffect(() => {
    const loadColmados = async () => {
      try {
        const colmados = await getColmadosDetails()
        setColmados(colmados)
      } catch (error) {
        console.error("Error loading colmados: ", error)
      }
    }
  })
  
  return (
    <PageHeader>
    <div className="flex w-full items-center justify-between">
      <h2 className="text-xl">Registrar ventas</h2>
      <div className="hidden md:block">
        <SelectColmado selected={colmado} setSelected={(value: ColmadoKey) => setColmado(value)} />
      </div>
    </div>
  </PageHeader>

  
  )
}
