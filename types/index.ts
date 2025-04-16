import { Timestamp } from "firebase/firestore";

export type Colmado = {
  id?: string,
  name: string,
  balanceDay: number,
  owners?: string[],
}
export interface Venta {
  id?: string;
  date: Date
  sales: number;
}

export interface Balance {
  id: string
  date: Date
  workingCapital: number
  liabilities: number
  totalAssets: number
  expenses: number
  sales: number
  netProfit: number
  grossProfit: number
  grossMargin: number
  netMargin: number
}