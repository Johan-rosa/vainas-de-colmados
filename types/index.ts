import { Timestamp } from "firebase/firestore";

export type ColmadoKey = "o7" | "o9" | "parqueo";
export interface Venta {
  id?: string;
  venta: number;
  fecha: string;
  date: Date
}

export interface Balance {
  date: Date
  fecha: string
  capital_de_trabajo: number
  pasivos: number
  total_activos: number
  beneficio_neto: number
  gastos: number
  beneficio_bruto: number
  ventas: number
  margen_bruto: number
  margen_neto: number
}