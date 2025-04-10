"use client"

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <h2 className="font-semibold text-xl">Resumen de las ventas</h2>
          <Link className="hidden md:block" href={"/registrar-ventas"}>
            <Button>Registrar ventas</Button>
          </Link>

        </div>
      </PageHeader>
      <Link className="flex w-full justify-end md:hidden" href={"/registrar-ventas"}>
        <Button className="" variant="ghost">
          Registrar ventas
          <ArrowRight className="mr-2 h-4 w-4" />
        </Button>
      </Link>
    </main>
  );
}