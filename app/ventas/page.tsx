"use client"

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <PageHeader>
        <div className="flex items-center justify-between w-full">
          <h2 className="font-semibold text-xl">Resumen de las ventas</h2>
          <Link href={"/registrar-ventas"}>
            <Button>Registrar ventas</Button>
          </Link>

        </div>
      </PageHeader>
    </main>
  );
}