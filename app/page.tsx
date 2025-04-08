"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <PageHeader>
        <h2 className="font-semibold text-xl">Situación General</h2>
      </PageHeader>
    </main>
  );
}
