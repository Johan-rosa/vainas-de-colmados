"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="p-4">
      <h1>Hello App</h1>
      <Button onClick={() => setCount(count + 1)}>{`Clics (${count})`}</Button>
    </div>
  );
}
