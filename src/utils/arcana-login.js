const { AuthProvider } = window.arcana_login;
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

export function getArcanaAuth() {
  return arcanaAuth;
}

export function logout() {
  arcanaAuth.clearSession();
  sessionStorage.clear();
}
