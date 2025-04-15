"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronDown, ChevronUp, Download, Eye, TrendingDown, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

// Component for balance actions (dropdown menu)
interface BalanceActionsProps {
  align?: "center" | "end" | "start"
}

function BalanceActions({ align = "end" }: BalanceActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6">
          <span className="sr-only">Abrir menú</span>
          <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
          >
            <path
              d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        <DropdownMenuItem className="cursor-pointer">
          <Eye className="mr-2 h-4 w-4" />
          <span>Ver detalles</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" />
          <span>Descargar</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// Component for displaying a metric with label and value
interface MetricDisplayProps {
  label: string
  value: string | number
  formatter?: (value: number) => string
  icon?: React.ReactNode
  className?: string
}

function MetricDisplay({ label, value, formatter, icon, className }: MetricDisplayProps) {
  const formattedValue = typeof value === "number" && formatter ? formatter(value) : value

  return (
    <div className={className}>
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <div className="flex items-center">
        <p className="text-xs font-medium">{formattedValue}</p>
        {icon}
      </div>
    </div>
  )
}

// Component for the card header with month/year and actions
interface CardHeaderComponentProps {
  monthYear: string
  fullDate?: string
  isPositiveProfit: boolean
  onToggleExpand: () => void
  isExpanded: boolean
}

function CardHeaderComponent({
  monthYear,
  fullDate,
  isPositiveProfit,
  onToggleExpand,
  isExpanded,
}: CardHeaderComponentProps) {
  return isExpanded ? (
    <CardHeader className="p-3 pb-0">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-base font-medium capitalize">{monthYear}</CardTitle>
          {fullDate && <CardDescription className="text-xs mt-0.5">{fullDate}</CardDescription>}
        </div>
      </div>
    </CardHeader>
  ) : (
    <div className="flex items-center mb-1.5">
      <div className={cn("w-1 h-8 rounded-full mr-2.5", isPositiveProfit ? "bg-green-500" : "bg-red-500")} />
      <h3 className="text-sm font-medium capitalize">{monthYear}</h3>
      <div className="ml-auto flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={onToggleExpand} className="h-6 w-6 p-0">
          <ChevronDown className="h-3.5 w-3.5" />
          <span className="sr-only">Expandir</span>
        </Button>
        <BalanceActions />
      </div>
    </div>
  )
}

// Component for the collapsed view content
interface CollapsedViewProps {
  balance: Balance
}

function CollapsedView({ balance }: CollapsedViewProps) {
  return (
    <div className="grid grid-cols-3 gap-x-3 pl-3.5">
      <MetricDisplay label="Ventas" value={balance.sales} formatter={formatCurrency} />
      <MetricDisplay label="Beneficio Neto" value={balance.netProfit ?? 0} formatter={formatCurrency} />
      <MetricDisplay label="Margen Bruto" value={balance.grossMargin ?? 0} formatter={formatPercentage} />
    </div>
  )
}

// Component for the expanded view content
interface ExpandedViewProps {
  balance: Balance
  onToggleExpand: () => void
}

function ExpandedView({ balance, onToggleExpand }: ExpandedViewProps) {
  const isPositiveProfit = (balance.netProfit ?? 0) > 0

  return (
    <CardContent className="p-3 pt-2">
      <div className="grid grid-cols-2 gap-x-6 gap-y-2">
        <MetricDisplay label="Ventas" value={balance.sales} formatter={formatCurrency} />
        <MetricDisplay label="Gastos" value={balance.expenses} formatter={formatCurrency} />
        <MetricDisplay
          label="Beneficio Neto"
          value={balance.netProfit ?? 0}
          formatter={formatCurrency}
          icon={
            isPositiveProfit ? (
              <TrendingUp className="h-3.5 w-3.5 ml-1 text-green-500" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 ml-1 text-red-500" />
            )
          }
        />
        <MetricDisplay label="Margen Neto" value={balance.netMargin ?? 0} formatter={formatPercentage} />
        <MetricDisplay label="Beneficio Bruto" value={balance.grossProfit ?? 0} formatter={formatCurrency} />
        <MetricDisplay label="Margen Bruto" value={balance.grossMargin ?? 0} formatter={formatPercentage} />
        <MetricDisplay label="Activos Totales" value={balance.totalAssets} formatter={formatCurrency} />
        <MetricDisplay label="Pasivos" value={balance.liabilities} formatter={formatCurrency} />
        <MetricDisplay
          label="Capital de Trabajo"
          value={balance.workingCapital}
          formatter={formatCurrency}
          className="col-span-2 mt-1"
        />
      </div>

      <div className="flex justify-between items-center mt-3 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleExpand}
          className="h-6 px-2 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronUp className="h-3 w-3 mr-1" /> Colapsar
        </Button>
        <BalanceActions />
      </div>
    </CardContent>
  )
}

// Component for mobile card view
interface BalanceMobileCardProps {
  balance: Balance
  isExpanded: boolean
  onToggleExpand: () => void
}

function BalanceMobileCard({ balance, isExpanded, onToggleExpand }: BalanceMobileCardProps) {
  // Format the date once
  const monthYear = format(balance.date, "MMM yyyy", { locale: es })
  const fullDate = format(balance.date, "d 'de' MMMM yyyy", { locale: es })

  // Determine if profit is positive
  const isPositiveProfit = (balance.netProfit ?? 0) > 0

  return (
    <Card
      key={balance.id}
      className={cn("overflow-hidden border-0 shadow-sm transition-all", isExpanded ? "bg-white" : "bg-gray-50/50")}
    >
      {isExpanded ? (
        // Expanded view
        <>
          <CardHeaderComponent
            monthYear={monthYear}
            fullDate={fullDate}
            isPositiveProfit={isPositiveProfit}
            onToggleExpand={onToggleExpand}
            isExpanded={isExpanded}
          />
          <ExpandedView balance={balance} onToggleExpand={onToggleExpand} />
        </>
      ) : (
        // Collapsed view
        <div className="p-3">
          <CardHeaderComponent
            monthYear={monthYear}
            isPositiveProfit={isPositiveProfit}
            onToggleExpand={onToggleExpand}
            isExpanded={isExpanded}
          />
          <CollapsedView balance={balance} />
        </div>
      )}
    </Card>
  )
}

// Component for table row
interface BalanceTableRowProps {
  balance: Balance
}

function BalanceTableRow({ balance }: BalanceTableRowProps) {
  return (
    <TableRow key={balance.id}>
      <TableCell>
        <div className="font-medium">{format(balance.date, "MMMM yyyy", { locale: es })}</div>
        <div className="text-sm text-muted-foreground">{format(balance.date, "d 'de' MMMM", { locale: es })}</div>
      </TableCell>
      <TableCell className="text-right font-medium">{formatCurrency(balance.sales)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.expenses)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.netProfit ?? 0)}</TableCell>
      <TableCell className="text-right">{formatPercentage(balance.netMargin ?? 0)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.totalAssets)}</TableCell>
      <TableCell className="text-right">{formatCurrency(balance.liabilities)}</TableCell>
      <TableCell>
        <div className="float-right">
          <BalanceActions />
        </div>
      </TableCell>
    </TableRow>
  )
}

// Component for desktop table
interface BalanceTableProps {
  balances: Balance[]
}

function BalanceTable({ balances }: BalanceTableProps) {
  return (
    <Card>
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
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balances.map((balance) => (
              <BalanceTableRow key={balance.id} balance={balance} />
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
      {balances.map((balance) => (
        <BalanceMobileCard
          key={balance.id}
          balance={balance}
          isExpanded={expandedCard === balance.id}
          onToggleExpand={() => balance.id && onToggleExpand(balance.id)}
        />
      ))}
    </div>
  )
}

// Main component
interface RecentBalancesProps {
  balances: Balance[]
}

export default function BalancesTableCard({ balances }: RecentBalancesProps) {
  console.log(balances)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)

  const toggleCardExpansion = (id: string) => {
    console.log("Hello, Expanded clicked")
    setExpandedCard(expandedCard === id ? null : id)
  }

  return (
    <div className="space-y-4 mt-3">

      {/* Mobile view */}
      <div className="md:hidden">
        <BalanceMobileCards balances={balances} expandedCard={expandedCard} onToggleExpand={toggleCardExpansion} />
      </div>

      {/* Desktop view */}
      <div className="hidden md:block">
        <BalanceTable balances={balances} />
      </div>
    </div>
  )
}
