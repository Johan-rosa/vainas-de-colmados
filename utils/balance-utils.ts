import type { Balance } from "@/types"

export const calcNetProfit = (balance: Balance ) => {
  return balance.totalAssets - balance.workingCapital - balance.liabilities 
}

export const calcGrossProfit = (balance: Balance) => {
  return calcNetProfit(balance) + balance.expenses 
}

export const calcNetMargin = (balance: Balance) => {
  return calcNetProfit(balance) / balance.sales
}

export const calcGrossMargin = (balance: Balance) => {
  return calcGrossProfit(balance) / balance.sales
}