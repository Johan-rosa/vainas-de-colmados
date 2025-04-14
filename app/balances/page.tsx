"use client"

import Link from "next/link"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ArrowRight } from "lucide-react";
import { getBalances } from "@/services/balances-service";
import SelectColmado from "@/components/select-colmado";
import { Balance } from "@/types";
import { BalancesTableCard } from "@/components/balances-table-card";
import { getBalancesExample } from "@/lib/mock-blance";

export default function Balances() {
  const [colmado, setColmado] = useState("colmado_o7");
  const [balances, setBalances] = useState<Balance[]>([])

  useEffect(() => {
    const loadBlances = async (colmadoId: string) => {
      const fetchedBalances = await getBalances(colmadoId, 24);
      setBalances(fetchedBalances)
    }

    // loadBlances(colmado)
    // TODO: remove mock data
    const mockBalances = getBalancesExample()
    setBalances(mockBalances)
    console.log(mockBalances)
  }, [colmado])

  return (
    <main>
      <PageHeader>
        <h2 className="font-semibold text-xl">Situación y balances</h2>
      </PageHeader>
      <Link href="/registrar-balance">
        <Button variant="ghost" className="flex w-full justify-end">
          Registrar balance
          <ArrowRight />
        </Button>
        <section className="p-2">
          <SelectColmado selected={colmado} setSelected={(value: string) => setColmado(value)} />
          <BalancesTableCard balances={balances}></BalancesTableCard>
        </section>
      </Link>
    </main>
  );
}