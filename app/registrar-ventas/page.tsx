"use client"

import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/page-header";
import { fireStore } from "@/lib/firebase";
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
import { getVentas } from "@/services/ventas-service";
import { get } from "http";

type ColmadoKey = "o7" | "o9" | "parqueo";

export default function Home() {
  const [colmado, setColmado] = useState<ColmadoKey>("o7");
  const [ventas, setVentas] = useState<{ id: string; [key: string]: any }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newVenta, setNewVenta] = useState({
    fecha: new Date(),
    monto: 0,
  });
  
  useEffect(() => {
    if (colmado) {
      loadVentas();
    }
  }, [colmado]);
  
  const loadVentas = async () => {
    setIsLoading(true);
    try {
      const ventasData = await getVentas(colmado, 31);
      setVentas(ventasData.map((venta) => ({ ...venta, id: venta.id || "" })));
  
      if (ventasData.length > 0) {
        const mostRecent = ventasData[0];
        const nextDate = new Date(mostRecent.date);
        nextDate.setDate(nextDate.getDate() + 1);
        setNewVenta((pv) => ({ ...pv, fecha: nextDate }));
      }
  
      console.log("Ventas: ", ventasData);
    } catch (error) {
      console.error("Error loading ventas: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <PageHeader>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl">Registrar ventas</h2>
          <div className="hidden md:block">
            <SelectColmado selected={colmado} setSelected={(value: ColmadoKey) => setColmado(value)} />
          </div>
        </div>
      </PageHeader>
      <section className="p-3">
        <div className="block w-full mb-2 md:hidden">
            <SelectColmado selected={colmado} setSelected={(value: ColmadoKey) => setColmado(value)} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Ventas del día</CardTitle>
            <CardDescription>Selecciona la fecha e introduce el monto</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-2">
                <DatePicker 
                  value={newVenta.fecha} 
                  onChange={(value) => setNewVenta((pv) => ({...pv, fecha: value || new Date()}))}
                />
                <CustomNumberInput id="venta" value={newVenta.monto}/>
                <Button className="w-full">Agregar</Button>
            </form>
          </CardContent>
        </Card>

      </section>
    </>
  );
}

type SelectColmadoProps = {
  selected: ColmadoKey;
  setSelected: (value: ColmadoKey) => void;
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
          <SelectItem value="o7">Colmado O7</SelectItem>
          <SelectItem value="o9">Colmado O9</SelectItem>
          <SelectItem value="parqueo">ParqueO 10</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}