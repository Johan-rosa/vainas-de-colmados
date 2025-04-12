'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { PageHeader } from '@/components/page-header'
import SelectColmado from "@/components/select-colmado"
import { getColmadosDetails } from "@/services/ventas-service"
import { Button } from "@/components/ui/button"
import {ArrowLeft } from "lucide-react"

import { ColmadoKey } from '@/types'
import { getBalances } from '@/services/balances-service'
import type { Balance } from '@/types'

export default function RegisterBalance() {
  const [colmados, setColmados] = useState<{ key: string; name: string; balanceDate: number }[]>([])
  const [colmado, setColmado] = useState<ColmadoKey>("o7")
  const [balances, setBalances] = useState<Balance[]>()

  useEffect(() => {
    const loadBalances = async () => {
      try {
        const balances = await getBalances(colmado, 36)
        setBalances(balances)
      } catch (e) {
        if (e instanceof Error) {
          console.error(e.message)
        } else {
          console.error("An unknown error occurred")
        }
      }
    }

    loadBalances()
  }, [colmado])

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
    <>
      <PageHeader>
      <div className="flex w-full items-center justify-between">
        <h2 className="text-xl">Registrar balances</h2>
        <div className="hidden md:block">
          <SelectColmado 
            selected={colmado} 
            setSelected={(value: ColmadoKey) => setColmado(value)}
          />
        </div>
      </div>
      </PageHeader>
      <Link href="/balances">
        <Button variant="ghost" className='w-full flex justify-start'>
          <ArrowLeft />
          Lista de balances
        </Button>
      </Link>
    </> 
  )
}
