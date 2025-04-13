"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormField,
} from "@/components/ui/form"
import {Card, CardContent} from "@/components/ui/card"
import DatePicker from "@/components/date-picker"
import CustomNumberInput from "@/components/custon-number-input"
import { calcNetMargin, calcNetProfit, calcGrossProfit, calcGrossMargin } from "@/utils/balance-utils"
import { setBalanceToFirestore, prepareBalanceForFirestore } from "@/services/balances-service"
import { dateAsKey } from "@/utils"

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
  workingCapital: numberInputSchema("Capital"),
  liabilities: numberInputSchema("Pasivos"),
  totalAssets: numberInputSchema("Activos"),
  expenses: numberInputSchema("Gastos"),
  sales: numberInputSchema("Ventas"),
})

type formValues = z.infer<typeof formSchema>

interface RegisterBalanceFormProps {
  appendBalance: (balance: any) => void;
  colmadoId: string;
}

export default function RegisterBalanceForm({ appendBalance, colmadoId }: RegisterBalanceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
      workingCapital: 0,
      liabilities: 0,
      totalAssets: 0,
      expenses: 0,
      sales: 0,
    },
  });

  async function onSubmit(data: formValues) {
    setIsSubmitting(true);
    const newBalance = {
      ...data,
      id: dateAsKey(data.date),
      netProfit: calcNetProfit(data),
      grossProfit: calcGrossProfit(data),
      netMargin: calcNetMargin(data),
      grossMargin: calcGrossMargin(data),
    };

    // TODO: add toast confirmation on success or error
    try {
      const savedBalance = await setBalanceToFirestore(colmadoId, newBalance)
      appendBalance(newBalance)
    } catch (e) {
      if (e instanceof Error) {
        console.error(e.message);
      } else {
        console.error("An unknown error occurred");
      }
    }

    setIsSubmitting(false);
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
                    dateFormat="PP"
                  ></DatePicker>
                );
              }}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="workingCapital"
                render={({ field }) => {
                  return (
                    <CustomNumberInput
                      id="capital"
                      label="Capital"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
              <FormField
                control={form.control}
                name="liabilities"
                render={({ field }) => {
                  return (
                    <CustomNumberInput
                      id="pasivos"
                      label="Pasivos"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
              <FormField
                control={form.control}
                name="totalAssets"
                render={({ field }) => {
                  return (
                    <CustomNumberInput
                      id="activos"
                      label="Activos"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
              <FormField
                control={form.control}
                name="expenses"
                render={({ field }) => {
                  return (
                    <CustomNumberInput
                      id="gastos"
                      label="Gastos"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
              <FormField
                control={form.control}
                name="sales"
                render={({ field }) => {
                  return (
                    <CustomNumberInput
                      id="ventas"
                      label="Ventas"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  );
                }}
              />
            </div>

            <Button type="submit" className="w-full">
              {isSubmitting ? "Registrando..." : "Registrar Balance"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
