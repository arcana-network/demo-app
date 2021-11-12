import { AuthProvider } from "@arcana/auth";
import { Arcana as ArcanaSDK } from "@arcana/storage/dist/standalone/storage.umd";
import store from "../store";

const appId = import.meta.env.VITE_ARCANA_APP_ID;
const gateway = import.meta.env.VITE_GATEWAY_URL;
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const redirectUri = import.meta.env.VITE_REDIRECT_URL;

const arcanaAuth = new AuthProvider({
  appID: appId,
  oauthCreds: [
    {
      type: "google",
      clientId: googleClientId,
    },
  ],
  redirectUri,
});

export function getArcanaAuthProvider() {
  return AuthProvider;
}

export function getArcanaAuth() {
  return arcanaAuth;
}

export function getArcanaStorage() {
  const Arcana = new ArcanaSDK({
    gateway,
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
