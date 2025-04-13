import { fireStore } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc,
  setDoc, 
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
import { dateAsKey } from '@/utils';


const ventasRef = (colmadoId: string) => {
  return collection(fireStore, `colmados/${colmadoId}/ventas`);
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
    sales: venta.sales || 0,
  };
}

// TODO: add more field to the colmados collection
// TODO: Create the proper types for the colmados collection
// TODO: Make field in the database the same as the types
export const getColmadosDetails = async (): Promise<{ id: string, name: string; balanceDay: number }[]> => {
  const colmadosCollection = collection(fireStore, 'colmados');
  const snapshot = await getDocs(colmadosCollection);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    name: doc.data().name,
    balanceDay: doc.data().balanceDay,
  }));
};

export const getVentas = async (colmadoId: string, limitCount: number, startAfterDate?: Date) => {
  const ventasCollection = ventasRef(colmadoId);
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
    ventas.push({ ...ventaData, id: doc.id, sales: ventaData.sales });
  });

  return ventas
}

// TODO: Add createdAt and created By to this, it's important for logging and control
export const setVentaToFirestore = async (colmadoId: string, venta: Venta) => {
  const ventaData = prepareVentaForFirestore(venta);
  const docId = dateAsKey(venta.date);
  const docRef = doc(fireStore, `colmados/${colmadoId}/ventas/${docId}`);
  await setDoc(docRef, ventaData); 
  return { ...ventaData, id: docId };
};
