import { fireStore } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  DocumentData,
  Timestamp,
  startAfter
} from "firebase/firestore"

import { dateAsKey } from "@/utils"
import type { ColmadoKey, Balance } from "@/types"

const balanceRef = (colmadoKey: ColmadoKey) => {
  return collection(fireStore, `colmados/colmado_${colmadoKey}/balances`)
}

export const prepareBalanceForFirestore = (balance: Balance) => {
  return {
    ...balance,
    fecha: dateAsKey(balance.date),
    date: Timestamp.fromDate(balance.date)
  }
}

export const prepareBalanceFromFirestore = (balance: DocumentData): Balance => {
  return {
    ...balance,
    date: balance.date.toDate(),
    fecha: balance.fecha || "",
    capital_de_trabajo: balance.capital_de_trabajo || 0,
    pasivos: balance.pasivos || 0,
    total_activos: balance.total_activos || 0,
  } as Balance;
}

export const getBalances = async (
  colmadoKey: ColmadoKey,
  limitCount: number,
  startAfterDate?: Date,
) => {
  const balancesCollection = balanceRef(colmadoKey)
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
    balances.push(balanceData);
  });

  return balances
}