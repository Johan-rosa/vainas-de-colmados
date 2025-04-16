import { fireStore } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  DocumentData,
  Timestamp,
  startAfter,
  doc,
  setDoc
} from "firebase/firestore"

import { dateAsKey } from "@/utils"
import type { Balance } from "@/types"

const balanceRef = (colmadoId: string) => {
  return collection(fireStore, `colmados/${colmadoId}/balances`)
}

export const prepareBalanceForFirestore = (balance: Balance) => {
  return {
    ...balance,
    date: Timestamp.fromDate(balance.date)
  }
}

export const prepareBalanceFromFirestore = (balance: DocumentData): Balance => {
  return {
    ...balance,
    date: balance.date.toDate(),
  } as Balance;
}

export const getBalances = async (
  colmadoId: string,
  limitCount: number,
  startAfterDate?: Date,
) => {
  const balancesCollection = balanceRef(colmadoId)
  const q = query(
    balancesCollection,
    orderBy("date", "desc"),
    limit(limitCount || 36),
    ...(startAfterDate ? [startAfter(Timestamp.fromDate(startAfterDate))] : [])
  )

  const querySnapshot = await getDocs(q);
  const balances: Balance[] = [];

  querySnapshot.forEach((doc) => {
    const balanceData = prepareBalanceFromFirestore(doc.data());
    balances.push({...balanceData, id: doc.id});
  });

  return balances
}

export const setBalanceToFirestore = async (colmadoId: string, balance: Balance) => {
  const balanceData = prepareBalanceForFirestore(balance)
  const docId = dateAsKey(balance.date)
  const docRef = doc(fireStore, `colmados/${colmadoId}/balances/${docId}`)
  await setDoc(docRef, balanceData)
  return {...balanceData, id: docId}
}