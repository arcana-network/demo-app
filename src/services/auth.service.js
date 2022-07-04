import { AuthProvider, computeAddress } from "@arcana/auth";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_WALLET_APP_MODE = import.meta.env.VITE_ARCANA_WALLET_APP_MODE;

function createAuthService() {
  const wallet = new AuthProvider(ARCANA_APP_ID, {
    network: ARCANA_AUTH_NETWORK,
    inpageProvider: true,
  });

  async function init() {
    await wallet.init({
      appMode: Number(ARCANA_WALLET_APP_MODE),
      position: "right",
    });
  }

  async function isLoggedIn() {
    return await wallet.isLoggedIn();
  }

  async function logout() {
    await wallet.logout();
  }

  async function requestPublicKey(email) {
    return await wallet.getPublicKey(email);
  }

  async function requestSocialLogin(type) {
    await wallet.loginWithSocial(type);
  }

  async function requestUserInfo() {
    return await wallet.getUser();
  }

  async function requestWalletInfo() {
    const provider = wallet.provider;
    return await provider.request({ method: "eth_accounts" });
  }

  function setHook(event, handler) {
    const provider = wallet.provider;
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
