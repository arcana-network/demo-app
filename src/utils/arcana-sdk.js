// import { AuthProvider } from "arcana-login";
import { Arcana as ArcanaSDK } from "@arcana/storage/dist/standalone/storage.umd";
import store from "../store";

// Use this until Login SDK is polyfilled
const { AuthProvider } = window.arcana_login;
// const ArcanaSDK = window.arcana.Arcana;

console.log({ ArcanaSDK });

const arcanaAuth = new AuthProvider({
  appID: import.meta.env.VITE_ARCANA_APP_ID,
  oauthCreds: [
    {
      type: "google",
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirectUri: import.meta.env.VITE_REDIRECT_URL,
    },
  ],
});

const address = import.meta.env.VITE_ARCANA_APP_ID;

export function getArcanaAuthProvider() {
  return AuthProvider;
}

export function getArcanaAuth() {
  return arcanaAuth;
}

export function getArcanaStorage() {
  const Arcana = new ArcanaSDK({
    gateway: "https://gateway02.arcana.network",
    address,
    privateKey: store.getters.privateKey,
    email: store.getters.email,
  });
  return Arcana;
}

export function logout() {
  arcanaAuth.clearSession();
  sessionStorage.clear();
}
