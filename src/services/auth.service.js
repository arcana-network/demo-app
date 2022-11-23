import { AuthProvider } from "@arcana/auth";

const ARCANA_APP_ADDRESS = import.meta.env.VITE_ARCANA_APP_ADDRESS;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_HAS_WIDGET_MODE = import.meta.env.VITE_ARCANA_HAS_WIDGET_MODE;
const ARCANA_WALLET_POSITION = import.meta.env.VITE_ARCANA_WALLET_POSITION;
const ARCANA_WALLET_THEME = import.meta.env.VITE_ARCANA_WALLET_THEME;

function createAuthService() {
  const auth = new AuthProvider(ARCANA_APP_ADDRESS, {
    network: ARCANA_AUTH_NETWORK,
    debug: true,
    alwaysVisible: ARCANA_HAS_WIDGET_MODE === "true" ? false : true,
    position: ARCANA_WALLET_POSITION,
    theme: ARCANA_WALLET_THEME,
  });

  async function init() {
    await auth.init();
  }

  async function connect() {
    await auth.connect();
  }

  async function isLoggedIn() {
    return await auth.isLoggedIn();
  }

  async function logout() {
    await auth.logout();
  }

  async function requestPublicKey(email) {
    const publicKey = await auth.getPublicKey(email);
    if (!publicKey.startsWith("0x")) {
      return `0x${publicKey}`;
    }
    return publicKey;
  }

  async function requestSocialLogin(type) {
    await auth.loginWithSocial(type);
  }

  async function requestUserInfo() {
    return await auth.getUser();
  }

  async function requestWalletInfo() {
    const provider = auth.provider;
    return await provider.request({ method: "eth_accounts" });
  }

  function setHook(event, handler) {
    const provider = auth.provider;
    provider.on(event, handler);
  }

  return {
    init,
    isLoggedIn,
    logout,
    requestPublicKey,
    requestSocialLogin,
    requestUserInfo,
    requestWalletInfo,
    setHook,
    connect,
  };
}

const AuthService = Object.freeze(createAuthService());

export default AuthService;
