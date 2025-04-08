"use client"

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/page-header";
import { ref, onValue, set } from "firebase/database";
import { realTimeDb } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DatePicker from "@/components/date-picker"
import CustomNumberInput from "@/components/custon-number-input"
import { Button } from "@/components/ui/button";

export default function Home() {
  const [colmado, setColmado] = useState("O7");
  const [ventas, setVentas] = useState<{ id: string; [key: string]: any }[]>([]);
  const strRefColmado = `ventas${colmado}`;
  
  useEffect(() => {
    const refColmado = ref(realTimeDb, strRefColmado);
    const unsubscribe = onValue(refColmado, (snapshot) => {
      const data = snapshot.val();
      const ventasArray = Object.entries(data).map(([key, value]) => ({
        id: key,
        ...(typeof value === "object" && value !== null ? value : {}),
      }));

      setVentas(ventasArray);
    });

    return () => unsubscribe();
  }, [strRefColmado]);

  const mostRecent = ventas.reduce((latest, current) => {
    const pattern = /^[0-9]{4}/
    if (!pattern.test(current.id)) {
      console.log(latest)
      return latest;
    }
    return new Date(current.id) > new Date(latest.id) ? current : latest;
  }, {id: "0"});

  
  
  const [ventaEntry, setVentaEntry] = useState({
    fecha: new Date(mostRecent.id),
    monto: 0,
  });
  
  console.log("Most Recent", mostRecent.id);
  console.log("Most Recent", new Date(mostRecent.id));
  console.log("Most Recent", ventaEntry.fecha);

  return (
    <>
      <PageHeader>
        <div className="flex w-full items-center justify-between">
          <h1 className="text-2xl font-bold">Registrar ventas</h1>
          <div className="hidden">
            <SelectColmado selected={colmado} setSelected={(value) => setColmado(value)} />
          </div>
        </div>
      </PageHeader>
      <section className="p-3">
        <div className="block w-full mb-2">
            <SelectColmado selected={colmado} setSelected={(value) => setColmado(value)} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ventas del día</CardTitle>
            <CardDescription>Selecciona la fecha e introduce el monto</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-2">
                <DatePicker 
                  value={ventaEntry.fecha} 
                  onChange={(value) => setVentaEntry((pv) => ({...pv, fecha: value || new Date()}))}
                />
                <CustomNumberInput id="venta" value={ventaEntry.monto}/>
                <Button className="w-full">Agregar</Button>
            </form>
          </CardContent>
        </Card>

      </section>
    </>
  );
}

type SelectColmadoProps = {
  selected: string;
  setSelected: (value: string) => void;
}

export function SelectColmado({selected, setSelected}: SelectColmadoProps) {
  return (
    <Select value={selected} onValueChange={setSelected}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Colmados</SelectLabel>
          <SelectItem value="O7">Colmado O7</SelectItem>
          <SelectItem value="O9">Colmado O9</SelectItem>
          <SelectItem value="ParqueO10">ParqueO 10</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}