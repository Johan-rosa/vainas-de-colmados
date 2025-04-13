'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import { PageHeader } from '@/components/page-header'
import SelectColmado from "@/components/select-colmado"
import { getColmadosDetails } from "@/services/ventas-service"
import { Button } from "@/components/ui/button"
import {ArrowLeft } from "lucide-react"

import { getBalances } from '@/services/balances-service'
import type { Balance, Colmado } from '@/types'

import RegistrarBalanceForm from '@/components/register-balance-form'

export default function RegisterBalance() {
  const [colmados, setColmados] = useState<Colmado[]>([])
  const [colmado, setColmado] = useState("colmado_o7")
  const [balances, setBalances] = useState<Balance[]>()

  const appendBalance = (balance: Balance) => {
    const balanceExist = balances?.find(b => b.id === balance.id)
    if (balanceExist) {
      // Overwrite the previous balance
      setBalances(prv => prv?.map(b => b.id === balance.id ? balance : b))
    } else {
      setBalances((prev) => (prev ? [...prev, balance] : [balance]))
    }
  }

  useEffect(() => {
    const loadBalances = async () => {
      try {
        const balances = await getBalances(colmado, 36)
        console.log(balances)
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
            setSelected={(value: string) => setColmado(value)}
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
      <div className="max-w-2xl mx-auto p-3">
        <RegistrarBalanceForm appendBalance={appendBalance} colmadoId={colmado} />
      </div>
    </> 
  )
}
