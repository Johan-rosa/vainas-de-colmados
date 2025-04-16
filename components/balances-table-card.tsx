"use client"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDown, ChevronUp, TrendingDown, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { Balance } from "@/types"

// Utility functions
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(value)
}

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("es-DO", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

// Function to determine profit status color
const getProfitStatusColor = (currentProfit: number, previousProfit: number | undefined) => {
  if (currentProfit < 0) return "bg-red-500" // Negative profit
  if (!previousProfit) return "bg-green-500" // No previous data to compare

  if (currentProfit > previousProfit) {
    return "bg-green-500" // Higher than previous month
  } else {
    return "bg-yellow-500" // Lower than previous month but still positive
  }
}

// Component for mobile card view
interface BalanceMobileCardProps {
  balance: Balance
  previousBalance?: Balance
  isExpanded: boolean
  onToggleExpand: () => void
}

function BalanceMobileCard({ balance, previousBalance, isExpanded, onToggleExpand }: BalanceMobileCardProps) {
  // Format the date once
  const monthYear = format(balance.date, "MMM yyyy", { locale: es })
  const fullDate = format(balance.date, "d 'de' MMMM yyyy", { locale: es })

  // Determine status color based on profit comparison
  const statusColor = getProfitStatusColor(balance.netProfit, previousBalance?.netProfit)

  // Determine trend icon for the month header
  const trendIcon = previousBalance ? (
    balance.netProfit > previousBalance.netProfit ? (
      <TrendingUp className="h-3.5 w-3.5 text-green-500" />
    ) : balance.netProfit >= 0 ? (
      <TrendingDown className="h-3.5 w-3.5 text-yellow-500" />
    ) : (
      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
    )
  ) : balance.netProfit >= 0 ? (
    <TrendingUp className="h-3.5 w-3.5 text-green-500" />
  ) : (
    <TrendingDown className="h-3.5 w-3.5 text-red-500" />
  )

  // Function to render expanded view
  function renderExpandedView() {
    return (
      <>
        <CardHeader className="p-2 pb-0">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center">
                <CardTitle className="text-base font-medium capitalize">{monthYear}</CardTitle>
                {trendIcon && <span className="ml-1">{trendIcon}</span>}
              </div>
              {fullDate && <CardDescription className="text-[14px] mt-0.5">{fullDate}</CardDescription>}
            </div>
            <Button variant="ghost" size="sm" onClick={onToggleExpand} className="h-6 w-6 p-0">
              <ChevronUp className="h-3.5 w-3.5" />
              <span className="sr-only">Colapsar</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 pt-2">
          <div className="grid grid-cols-3 gap-x-4 gap-y-2">
            <div>
              <p className="text-[10px] text-muted-foreground">Ventas</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.sales)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Gastos</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.expenses)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Beneficio Neto</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.netProfit)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Margen Neto</p>
              <p className="text-[14px] font-medium">{formatPercentage(balance.netMargin)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Beneficio Bruto</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.grossProfit)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Margen Bruto</p>
              <p className="text-[14px] font-medium">{formatPercentage(balance.grossMargin)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Activos Totales</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.totalAssets)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Pasivos</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.liabilities)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Capital de Trabajo</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.workingCapital)}</p>
            </div>
          </div>
        </CardContent>
      </>
    )
  }

  // Function to render collapsed view
  function renderCollapsedView() {
    return (
      <div className="p-2 flex">
        <div className={cn("w-1 self-stretch rounded-full mr-2.5", statusColor)} />
        <div className="flex-1">
          <div className="flex items-center mb-1.5">
            <h3 className="text-sm font-medium capitalize">{monthYear}</h3>
            {trendIcon && <span className="ml-1">{trendIcon}</span>}
            <div className="ml-auto">
              <Button variant="ghost" size="sm" onClick={onToggleExpand} className="h-6 w-6 p-0">
                <ChevronDown className="h-3.5 w-3.5" />
                <span className="sr-only">Expandir</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-x-3">
            <div>
              <p className="text-[10px] text-muted-foreground">Ventas</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.sales)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Beneficio Neto</p>
              <p className="text-[14px] font-medium">{formatCurrency(balance.netProfit)}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">Margen Bruto</p>
              <p className="text-[14px] font-medium">{formatPercentage(balance.grossMargin)}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card
      key={balance.id}
      className={cn(
        "overflow-hidden border border-gray-200 shadow-sm transition-all py-0",
        isExpanded ? "bg-white" : "bg-gray-50/50",
      )}
    >
      {isExpanded ? renderExpandedView() : renderCollapsedView()}
    </Card>
  )
}

// Component for table row
interface BalanceTableRowProps {
  balance: Balance
  previousBalance?: Balance
}

function BalanceTableRow({ balance, previousBalance }: BalanceTableRowProps) {
  // Determine trend icon
  const trendIcon = previousBalance ? (
    balance.netProfit > previousBalance.netProfit ? (
      <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
    ) : balance.netProfit >= 0 ? (
      <TrendingDown className="h-4 w-4 ml-1 text-yellow-500" />
    ) : (
      <TrendingDown className="h-4 w-4 ml-1 text-red-500" />
    )
  ) : balance.netProfit >= 0 ? (
    <TrendingUp className="h-4 w-4 ml-1 text-green-500" />
  ) : (
    <TrendingDown className="h-4 w-4 ml-1 text-red-500" />
  )

  return (
    <TableRow key={balance.id}>
      <TableCell>
        <div className="flex items-center">
          <span className="font-medium">{format(balance.date, "MMMM yyyy", { locale: es })}</span>
          {trendIcon}
        </div>
        <div className="text-sm text-muted-foreground">{format(balance.date, "d 'de' MMMM", { locale: es })}</div>
      </TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(balance.sales)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.expenses)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.netProfit)}</TableCell>
      <TableCell className="text-right">{formatPercentage(balance.netMargin)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.totalAssets)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.liabilities)}</TableCell>
    </TableRow>
  )
}

// Component for desktop table
interface BalanceTableProps {
  balances: Balance[]
}

function BalanceTable({ balances }: BalanceTableProps) {
  return (
    <Card className="border border-gray-200">
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Ventas</TableHead>
              <TableHead className="text-right">Gastos</TableHead>
              <TableHead className="text-right">Beneficio Neto</TableHead>
              <TableHead className="text-right">Margen Neto</TableHead>
              <TableHead className="text-right">Activos</TableHead>
              <TableHead className="text-right">Pasivos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((balance, index) => (
              <BalanceTableRow
                key={balance.id}
                balance={balance}
                previousBalance={index < balances.length - 1 ? balances[index + 1] : undefined}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

// Component for mobile cards list
interface BalanceMobileCardsProps {
  balances: Balance[]
  expandedCard: string | null
  onToggleExpand: (id: string) => void
}

function BalanceMobileCards({ balances, expandedCard, onToggleExpand }: BalanceMobileCardsProps) {
  return (
    <div className="space-y-2">
      {balances.map((balance, index) => (
        <BalanceMobileCard
          key={balance.id}
          balance={balance}
          previousBalance={index < balances.length - 1 ? balances[index + 1] : undefined}
          isExpanded={expandedCard === balance.id}
          onToggleExpand={() => onToggleExpand(balance.id)}
        />
      ))}
    </div>
  )
}

// Main component
interface RecentBalancesProps {
  balances: Balance[]
}

export default function RecentBalances({ balances }: RecentBalancesProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null)


  const toggleCardExpansion = (id: string) => {
    setExpandedCard(expandedCard === id ? null : id)
  }

  return (
    <div className="space-y-4 mt-3">
      <div className="md:hidden">
        <BalanceMobileCards balances={balances} expandedCard={expandedCard} onToggleExpand={toggleCardExpansion} />
      </div>

      <div className="hidden md:block">
        <BalanceTable balances={balances} />
      </div>
    </div>
  )
}
