import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { WaitingListEntry } from "../types";

const WAITING_LIST_COLLECTION = "waitingList";

export const addWaitingListEntry = async (
  entry: Omit<WaitingListEntry, "id">
): Promise<WaitingListEntry> => {
  const docRef = await addDoc(collection(db, WAITING_LIST_COLLECTION), entry);
  return { id: docRef.id, ...entry };
};

export const removeWaitingListEntry = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, WAITING_LIST_COLLECTION, id));
};

export const getWaitingListEntries = async (): Promise<WaitingListEntry[]> => {
  const q = query(
    collection(db, WAITING_LIST_COLLECTION),
    orderBy("entryDate", "asc")
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WaitingListEntry[];
};
