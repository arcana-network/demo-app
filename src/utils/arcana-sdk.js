import { AuthProvider } from "arcana-login";
import { Arcana as ArcanaSDK } from "@arcana_tech/storage-sdk";
import store from "../store";

// const { AuthProvider } = window.arcana_login;
// const ArcanaSDK = window.arcana.Arcana;

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
  const Arcana = new ArcanaSDK(
    address,
    store.getters.privateKey,
    store.getters.email
  );
  return Arcana;
}

export function logout() {
  arcanaAuth.clearSession();
  sessionStorage.clear();
}
