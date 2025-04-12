"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import DatePicker from "@/components/date-picker"
import CustomNumberInput from "@/components/custon-number-input"

const numberInputSchema = (name: string) => {
  return (
    z.coerce
      .number({
        required_error: `El campo ${name} es requerido`,
        invalid_type_error: `El campo ${name} debe ser númerico`
      })
      .min(0, `El campo ${name} no puede ser negativo`)
  )
}

const formSchema = z.object({
  date: z.date({
    required_error: "La fecha del balance es requerida"
  }),
  capital: numberInputSchema("Capital"),
  pasivos: numberInputSchema("Pasivos"),
  activos: numberInputSchema("Activos"),
  gastos: numberInputSchema("Gastos"),
  ventas: numberInputSchema("Ventas"),
})

type formValues = z.infer<typeof formSchema>

export default function RegisterBalanceForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        date: new Date(),
        capital: 0,
        pasivos: 0,
        activos: 0,
        gastos: 0,
        ventas: 0,
      },
    })

    function onSubmit(data: formValues) {
      setIsSubmitting(true)
      console.log("Hello Johan")
      console.log(data)
      setIsSubmitting(false)
    }
  
  return (
      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  return (
                    <DatePicker
                      label="Fecha"
                      value={field.value} 
                      onChange={field.onChange} 
                      dateFormat="PP" >
                    </DatePicker>)
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="capital" render={({ field }) => {
                  return (
                    <CustomNumberInput label="Capital" value={field.value} onChange={field.onChange}/>
                  )
                }}/>
                <FormField control={form.control} name="pasivos" render={({ field }) => {
                  return (
                    <CustomNumberInput label="Pasivos" value={field.value} onChange={field.onChange}/>
                  )
                }}/>
                <FormField control={form.control} name="activos" render={({ field }) => {
                  return (
                    <CustomNumberInput label="Activos" value={field.value} onChange={field.onChange}/>
                  )
                }}/>
                <FormField control={form.control} name="gastos" render={({ field }) => {
                  return (
                    <CustomNumberInput label="Gastos" value={field.value} onChange={field.onChange}/>
                  )
                }}/>
                <FormField control={form.control} name="ventas" render={({ field }) => {
                  return (
                    <CustomNumberInput label="Pasivos" value={field.value} onChange={field.onChange}/>
                  )
                }}/>
              </div>

              <Button type="submit" className="w-full">
                {isSubmitting ? "Registrando..." : "Registrar Balance"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
  )
}
