import { db } from "../utils/firebase";

export async function addTx(txDetails) {
  return db.collection("blockchain-transactions").add(txDetails);
}
