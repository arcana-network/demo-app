// import { AuthProvider } from "@arcana_tech/arcana-login";
import store from "../store";

const { AuthProvider } = window.arcana_login;
const ArcanaSDK = window.arcana.Arcana;

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

export function getArcanaAuthProvider() {
  return AuthProvider;
}

export function getArcanaAuth() {
  return arcanaAuth;
}

export function getArcanaStorage() {
  const address = import.meta.env.VITE_ARCANA_APP_ID;
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
