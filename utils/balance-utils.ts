type Balance = {
  date: Date,
  workingCapital: number,
  liabilities: number,
  totalAssets: number,
  expenses: number,
  sales: number,
}

export const calcNetProfit = (balance: Balance ) => {
  return balance.totalAssets - balance.workingCapital - balance.liabilities 
}

export const calcGrossProfit = (balance: Balance) => {
  return calcNetProfit(balance) + balance.expenses 
}

export const calcNetMargin = (balance: Balance) => {
  if (!balance.sales) return 0
  return calcNetProfit(balance) / balance.sales
}

export const calcGrossMargin = (balance: Balance) => {
  if (!balance.sales) return 0
  return calcGrossProfit(balance) / balance.sales
}