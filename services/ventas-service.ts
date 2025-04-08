import { fireStore } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
  FieldValue
} from 'firebase/firestore';
import type { Venta } from '@/types';

type colmadokey = "o7"| "o9" | "parqueo";

const ventasRef = (colmadokey: colmadokey) => {
  return collection(fireStore, `ventas/ventas_${colmadokey}/diarias`);
}

const prepareVentaForFirestore = (venta: Venta) => {
  return {
    ...venta,
    date: Timestamp.fromDate(venta.date),
  };
}

const prepareVentaFromFirestore = (venta: DocumentData) => {
  return {
    ...venta,
    date: venta.date.toDate(),
    venta: venta.venta || null,
    fecha: venta.fecha || null,
  };
}

export const getVentas = async (colmadokey: colmadokey, limitCount: number, startAfterDate?: Date) => {
  const ventasCollection = ventasRef(colmadokey);
  const q = query(
    ventasCollection,
    orderBy("date", "desc"),
    limit(limitCount),
    ...(startAfterDate ? [startAfter(Timestamp.fromDate(startAfterDate))] : [])
  );

  const querySnapshot = await getDocs(q);
  const ventas: Venta[] = [];

  querySnapshot.forEach((doc) => {
    const ventaData = prepareVentaFromFirestore(doc.data());
    ventas.push({ ...ventaData, id: doc.id });
  });

  console.log("Ventas: ", ventas);
  return ventas;
}
