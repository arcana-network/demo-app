const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_WALLET_URL = import.meta.env.VITE_ARCANA_WALLET_URL;

const { WalletProvider } = window.arcana.wallet;

function createWalletService() {
  const wallet = new WalletProvider({
    appId: ARCANA_APP_ID,
    iframeUrl: ARCANA_WALLET_URL,
    network: ARCANA_AUTH_NETWORK,
    inpageProvider: true,
  });

  async function init() {
    await wallet.init()
  }

  async function isLoggedIn() {
    return await wallet.isLoggedIn();
  }

  async function logout() {
    await wallet.logout();
  }

  async function requestSocialLogin(type) {
    await wallet.requestSocialLogin(type);
  }

  async function requestUserInfo() {
    return await wallet.requestUserInfo();
  }

  async function requestWalletInfo() {
    const provider = wallet.getProvider();
    return await provider.request({ method: "eth_accounts" });
  }

  function setHook(event, handler) {
    const provider = wallet.getProvider();
    provider.on(event, handler);
  }

  return {
    init,
    isLoggedIn,
    logout,
    requestSocialLogin,
    requestUserInfo,
    requestWalletInfo,
    setHook,
  }
}

const WalletService = Object.freeze(createWalletService())

export default WalletService
