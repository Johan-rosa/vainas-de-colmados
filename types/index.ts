import { Timestamp } from "firebase/firestore";

export type ColmadoKey = "o7" | "o9" | "parqueo";
export interface Venta {
  id?: string;
  venta: number;
  fecha: string;
  date: Date
}


