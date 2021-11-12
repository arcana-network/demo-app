import { AuthProvider } from "@arcana/auth";
import { Arcana as ArcanaSDK } from "@arcana/storage/dist/standalone/storage.umd";
import store from "../store";

// Use this until Login SDK is polyfilled
// const { AuthProvider } = window.arcana_login;
// const ArcanaSDK = window.arcana.Arcana;

console.log({ ArcanaSDK });

const address = import.meta.env.VITE_ARCANA_APP_ADDRESS;
const appId = import.meta.env.VITE_ARCANA_APP_ID;

const arcanaAuth = new AuthProvider({
  appID: address,
  oauthCreds: [
    {
      type: "google",
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    },
  ],
  redirectUri: import.meta.env.VITE_REDIRECT_URL,
});

export function getArcanaAuthProvider() {
  return AuthProvider;
}

export function getArcanaAuth() {
  return arcanaAuth;
}

export function getArcanaStorage() {
  const Arcana = new ArcanaSDK({
    gateway: "https://gateway02.arcana.network/",
    appId,
    privateKey: store.getters.privateKey,
    email: store.getters.email,
  });
  return Arcana;
}

export function logout() {
  arcanaAuth.logout();
  sessionStorage.clear();
}
