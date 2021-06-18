import { db } from "../utils/firebase";

export async function findUser(address) {
  return db.collection("users").doc(address).get();
}

export async function saveUser(user) {
  return db.collection("users").doc(user.address).set(user);
}
