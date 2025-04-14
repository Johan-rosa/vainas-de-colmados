// Types for balance data
export interface Balance {
  id: string
  date: Date
  expenses: number
  grossMargin: number
  grossProfit: number
  liabilities: number
  netMargin: number
  netProfit: number
  sales: number
  totalAssets: number
  workingCapital: number
}

/**
 * Returns mocked balance data for development purposes
 * @param count Number of balance records to generate (default: 12)
 * @returns Array of Balance objects
 */
export function getBalancesExample(count: number = 12): Balance[] {
  const balances: Balance[] = []
  
  // Start date (one year ago from current date)
  const startDate = new Date()
  startDate.setFullYear(startDate.getFullYear() - 1)
  startDate.setDate(1) // First day of the month
  
  // Generate balances for each month
  for (let i = 0; i < count; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)
    
    // Base values that will be adjusted for each month
    const baseSales = 500000 + Math.random() * 200000
    const baseExpenses = baseSales * (0.65 + Math.random() * 0.15)
    const baseGrossProfit = baseSales * (0.25 + Math.random() * 0.1)
    const baseNetProfit = baseSales * (0.08 + Math.random() * 0.05)
    
    // Create seasonal variations (Q4 higher sales, Q1 lower)
    const month = date.getMonth()
    let seasonalFactor = 1.0
    
    // Q4 (Oct-Dec): Higher sales
    if (month >= 9 && month <= 11) {
      seasonalFactor = 1.2 + Math.random() * 0.1
    } 
    // Q1 (Jan-Mar): Lower sales
    else if (month >= 0 && month <= 2) {
      seasonalFactor = 0.85 + Math.random() * 0.1
    }
    // Summer (Jun-Aug): Slightly higher
    else if (month >= 5 && month <= 7) {
      seasonalFactor = 1.05 + Math.random() * 0.05
    }
    
    // Apply seasonal factor
    const sales = Math.round(baseSales * seasonalFactor)
    const expenses = Math.round(baseExpenses * (seasonalFactor * 0.9)) // Expenses don't grow as fast as sales
    const grossProfit = Math.round(sales * (0.25 + Math.random() * 0.08))
    const netProfit = Math.round(sales * (0.08 + Math.random() * 0.04))
    
    // Calculate margins
    const grossMargin = grossProfit / sales
    const netMargin = netProfit / sales
    
    // Calculate assets and liabilities with some randomness
    const totalAssets = Math.round(sales * (0.8 + Math.random() * 0.2))
    const liabilities = Math.round(totalAssets * (0.1 + Math.random() * 0.15))
    const workingCapital = Math.round(totalAssets - liabilities)
    
    // Determine status (more recent months are more likely to be pending or draft)
    const currentMonth = new Date().getMonth()
    const balanceMonth = date.getMonth()
    
    // If it's the current month or the previous month
    if (
      (balanceMonth === currentMonth && date.getFullYear() === new Date().getFullYear()) || 
      (balanceMonth === (currentMonth - 1 + 12) % 12 && date.getFullYear() >= new Date().getFullYear() - 1)
    ) {
      status = Math.random() > 0.3 ? "pending" : "draft"
    }
    
    balances.push({
      id: `bal_${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`,
      date,
      expenses,
      grossMargin,
      grossProfit,
      liabilities,
      netMargin,
      netProfit,
      sales,
      totalAssets,
      workingCapital,
    })
  }
  
  // Sort by date (most recent first)
  return balances.sort((a, b) => b.date.getTime() - a.date.getTime())
}

/**
 * Returns a single balance example for the current month
 * Useful for form testing
 */
export function getCurrentMonthBalanceExample(): Balance {
  const currentDate = new Date()
  currentDate.setDate(1) // First day of current month
  
  const sales = 618435
  const expenses = 111597
  const grossProfit = 173317.16
  const netProfit = 61720
  
  return {
    id: `bal_${currentDate.getFullYear()}${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`,
    date: currentDate,
    expenses,
    grossMargin: grossProfit / sales,
    grossProfit,
    liabilities: 13195,
    netMargin: netProfit / sales,
    netProfit,
    sales,
    totalAssets: 543827,
    workingCapital: 468912,
  }
}
