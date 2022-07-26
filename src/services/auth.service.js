import { AuthProvider, computeAddress } from "@arcana/auth";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_WALLET_APP_MODE = import.meta.env.VITE_ARCANA_WALLET_APP_MODE;

function createAuthService() {
  const auth = new AuthProvider(ARCANA_APP_ID, {
    network: ARCANA_AUTH_NETWORK,
    inpageProvider: true,
    debug: true,
  });

  async function init() {
    await auth.init({
      appMode: Number(ARCANA_WALLET_APP_MODE),
      position: "right",
    });
  }

  async function isLoggedIn() {
    return await auth.isLoggedIn();
  }

  async function logout() {
    await auth.logout();
  }

  async function requestPublicKey(email) {
    return await auth.getPublicKey(email);
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
    computeAddress,
    init,
    isLoggedIn,
    logout,
    requestPublicKey,
    requestSocialLogin,
    requestUserInfo,
    requestWalletInfo,
    setHook,
  };
}

const AuthService = Object.freeze(createAuthService());

export default AuthService;
