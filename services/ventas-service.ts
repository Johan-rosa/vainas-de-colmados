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

import type { Venta, ColmadoKey } from '@/types';
import { dateAsKey } from '@/utils';


const ventasRef = (colmadokey: ColmadoKey) => {
  return collection(fireStore, `colmados/colmado_${colmadokey}/ventas`);
}

const prepareVentaForFirestore = (venta: Venta) => {
  return {
    ...venta,
    fecha: dateAsKey(venta.date),
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

// TODO: add more field to the colmados collection
// TODO: Create the proper types for the colmados collection
// TODO: Make field in the database the same as the types
export const getColmadosDetails = async (): Promise<{ key: string, name: string; balanceDate: number }[]> => {
  const colmadosCollection = collection(fireStore, 'colmados');
  const snapshot = await getDocs(colmadosCollection);
  return snapshot.docs.map(doc => ({
    key: doc.data().key,
    name: doc.data().name,
    balanceDate: doc.data().balance_day,
  }));
};

export const getVentas = async (colmadokey: ColmadoKey, limitCount: number, startAfterDate?: Date) => {
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

  return ventas
  //return ventas.sort((a, b) => a.date.getTime() - b.date.getTime());
}

// TODO: Add createdAt and created By to this, it's important for logging and control
export const setVentaToFirestore = async (colmadokey: ColmadoKey, venta: Venta) => {
  const ventaData = prepareVentaForFirestore(venta);
  const docRef = doc(fireStore, `colmados/colmado_${colmadokey}/ventas/${ventaData.fecha}`);
  await setDoc(docRef, ventaData); 
  return { ...ventaData, id: ventaData.fecha };
};
