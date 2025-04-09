"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import DatePicker from "@/components/date-picker"
import CustomNumberInput from "@/components/custon-number-input"
import { Button } from "@/components/ui/button"
import { getVentas } from "@/services/ventas-service"
import { Table, TableBody, TableCell, TableHeader, TableRow, TableHead } from "@/components/ui/table"
import { es } from "date-fns/locale"
import { formatUTC } from "@/utils"
import type { ColmadoKey } from "@/types"
import SelectColmado from "@/components/select-colmado"
import { getDaysDifference } from "@/utils"

export default function Home() {
  const [colmado, setColmado] = useState<ColmadoKey>("o7")
  const [ventas, setVentas] = useState<{ id: string; [key: string]: any }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [range, setRange] = useState({ start: new Date(), end: new Date() })
  const [newVenta, setNewVenta] = useState({
    fecha: new Date(),
    monto: 0,
  })

  const rangeDays = getDaysDifference(range.start, range.end)

  // This effect runs when colmado or range changes
  useEffect(() => {
    if (colmado) {
      loadVentas()
    }
  }, [colmado, range]) // Added range as a dependency

  const loadVentas = async () => {
    setIsLoading(true)
    try {
      const ventasData = await getVentas(colmado, rangeDays === 0 ? 31 : rangeDays, range.start)
      setVentas(ventasData.map((venta) => ({ ...venta, id: venta.id || "" })))

      if (ventasData.length > 0) {
        const mostRecent = ventasData[0]
        const nextDate = new Date(mostRecent.date)
        nextDate.setDate(nextDate.getDate() + 1)

        // Update only the newVenta date, not the range
        setNewVenta((pv) => ({ ...pv, fecha: nextDate }))
      }

      console.log("Ventas: ", ventasData)
    } catch (error) {
      console.error("Error loading ventas: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle range changes separately
  const handleRangeChange = (key: "start" | "end", value: Date | null) => {
    if (value) {
      setRange((prev) => ({ ...prev, [key]: value }))
    }
  }

  const sortedVentas = ventas.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
        <Card className="mb-2">
          <CardHeader>
            <CardTitle>Ventas del día</CardTitle>
            <CardDescription>Selecciona la fecha e introduce el monto</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-2">
              <DatePicker
                value={newVenta.fecha}
                onChange={(value) => setNewVenta((pv) => ({ ...pv, fecha: value || new Date() }))}
              />
              <CustomNumberInput id="venta" value={newVenta.monto} />
              <Button className="w-full">Agregar</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ventas registradas</CardTitle>
            <CardDescription className="mt-2 flex gap-2 items-center justify-between">
              <span className="text-muted-foreground">Desde</span>
              <DatePicker value={range.start} onChange={(value) => handleRangeChange("start", value || null)} />
              <span className="text-muted-foreground">Hasta</span>
              <DatePicker value={range.end} onChange={(value) => handleRangeChange("end", value || null)} />
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
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead className="w-[100px]">Día</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead className="text-right">Monto (RD$)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedVentas.map((venta, index) => (
                      <TableRow key={venta.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{formatUTC(new Date(venta.date), "EEEE", { locale: es })}</TableCell>
                        <TableCell>{formatUTC(venta.date, "PP", { locale: es })}</TableCell>
                        <TableCell className="text-right">{venta.venta.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
