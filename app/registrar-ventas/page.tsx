"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CustomNumberInput from "@/components/custon-number-input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { formatUTC } from "@/utils"
import { PageHeader } from "@/components/page-header"
import DatePicker from "@/components/date-picker"
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

import type { Venta, Colmado } from "@/types"
import SelectColmado from "@/components/select-colmado"
import { getVentas, setVentaToFirestore, getColmadosDetails } from "@/services/ventas-service"
import { findMostRecentDateWithDay, dateAsKey } from "@/utils"

export default function registerVentas() {
  const [colmados, setColmados] = useState<Colmado[]>([])
  const [colmado, setColmado] = useState("colmado_o7")
  const [balanceDay, setBalanceDay] = useState(3)
  const [ventas, setVentas] = useState<Venta[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [range, setRange] = useState({start: new Date(), end: new Date()})
  const [newVenta, setNewVenta] = useState({
    id: dateAsKey(new Date()),
    date: new Date(),
    sales: 0,
  })

  useEffect(() => {
    const loadColmados = async () => {
      try {
        const colmados = await getColmadosDetails()
        setColmados(colmados)
      } catch (error) {
        console.error("Error loading colmados: ", error)
      }
    }

    loadColmados()
  }, [])

  useEffect(() => {
    if (colmado) {
      loadVentas()
    }
  }, [colmado])

  const loadVentas = async () => {
    setIsLoading(true)
    const newBalanceDay = colmados.find((c) => c.id === colmado)?.balanceDay || 3
    setBalanceDay(newBalanceDay)

    try {
      const ventasData = await getVentas(colmado, 120)
      setVentas(ventasData.map((venta) => ({ ...venta, id: venta.id })))

      if (ventasData.length > 0) {
        const mostRecent = ventasData[0]
        const nextDate = new Date(mostRecent.date)
        nextDate.setDate(nextDate.getDate() + 1)
        
        setNewVenta(pv => ({ ...pv, date: nextDate }))
        

        const startDate = findMostRecentDateWithDay(mostRecent.date, newBalanceDay)
        // TODO: fix this logic to never be a negative date
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, startDate.getDate() - 1)
        setRange({ start: startDate, end: endDate })

        const sortedVentas = [...ventasData].sort((a, b) => a.date.getTime() - b.date.getTime());
        setVentas(sortedVentas.map((venta) => ({ ...venta, id: venta.id })));

      }
    } catch (error) {
      console.error("Error loading ventas: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!(newVenta.date && newVenta.sales > 0)) return
  
    try {
      console.log("Submitting new venta: ", newVenta);
      const ventaExists = ventas.find(v => v.id === newVenta.id)

      const savedVenta = await setVentaToFirestore(colmado, newVenta);

      if (ventaExists) {
        setVentas((prevVentas) => prevVentas.map((v) => v.id === newVenta.id ? { ...newVenta, id: v.id } : v))
      } else {
        setVentas((prevVentas) => [
          ...prevVentas,
          {
            ...savedVenta,
            date: savedVenta.date instanceof Date ? savedVenta.date : savedVenta.date.toDate(),
          },
        ])
      }
      
      const savedDate = savedVenta.date.toDate() 
      const nextDate = new Date(savedDate.setDate(savedDate.getDate() + 1))
      console.log(nextDate)
      setNewVenta({ date: nextDate, sales: 0, id: dateAsKey(nextDate)});
    } catch (error) {
      console.error("Error saving venta: ", error);
    }
  };

  const handleNewVentaDate = (value: Date) => {
    setNewVenta((pv) => ({ ...pv, date: value, fecha: dateAsKey(value) }))
  }

  const handleRangeChange = (value: Date | undefined, key: "start" | "end") => {
    if (value) {
      setRange((pv) => ({ ...pv, [key]: value}));
    }
  };

  return (
    <>
      <PageHeader>
        <div className="flex w-full items-center justify-between">
          <h2 className="text-xl">Registrar ventas</h2>
          <div className="hidden md:block">
            <SelectColmado selected={colmado} setSelected={(value: string) => setColmado(value)} />
          </div>
        </div>
      </PageHeader>
      <section className="p-3">
        <div className="block w-full mb-2 md:hidden">
          <SelectColmado selected={colmado} setSelected={(value: string) => setColmado(value)} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-[1fr_2fr]">
          <Card className="">
            <CardHeader>
              <CardTitle>Ventas del día</CardTitle>
              <CardDescription>Selecciona la fecha e introduce el monto</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-2 md:gap-3 lg:gap-5" onSubmit={handleSubmit}>
                <DatePicker
                  label = "Fecha"
                  value={newVenta.date}
                  onChange={(value) => handleNewVentaDate(value || new Date())}
                  />
                <CustomNumberInput 
                  id="venta"
                  label = "Monto"
                  value={newVenta.sales}
                  onChange={(value) => setNewVenta((pv) => ({ ...pv, sales: Number(value)}))}
                />
                <Button className="w-full">Agregar</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ventas registradas</CardTitle>
              <CardDescription className="mt-2 flex gap-2 items-center justify-between">
                <span className="text-muted-foreground">Desde</span>
                <DatePicker 
                  value={range.start} 
                  onChange={(value) => handleRangeChange(value, 'start')}
                  />
                <span className="text-muted-foreground">Hasta</span>
                <DatePicker 
                  value={range.end} 
                  onChange={(value) => handleRangeChange(value, 'end')}
                  />
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p>Cargando...</p>
              ) : (
                <div className="max-h-[500px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead className="text-right">Monto (RD$)</TableHead>
                        <TableHead className="text-right">Total (RD$)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        ventas
                        .filter(venta => venta.date >= range.start && venta.date <= range.end)
                        .map((venta, index, filteredArray) => {
                          const ventaAcumulada = filteredArray
                          .slice(0, index + 1)
                          .reduce((sum, item) => sum + (item.sales || 0), 0);
                          
                          return (
                            <TableRow key={venta.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{format(venta.date, "PP", { locale: es })}</TableCell>
                                <TableCell className="text-right">{venta.sales?.toLocaleString()}</TableCell>
                                <TableCell className="text-right">{ventaAcumulada.toLocaleString()}</TableCell>
                              </TableRow>
                            );
                          })
                        }
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  )
}
