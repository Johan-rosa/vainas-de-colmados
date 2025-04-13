"use client"

import Link from "next/link"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { ArrowRight } from "lucide-react";

export default function Balances() {
  const [count, setCount] = useState(0);

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
      </Link>
    </main>
  );
}