const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_WALLET_URL = import.meta.env.VITE_ARCANA_WALLET_URL;

const { WalletProvider } = window.arcana.wallet;

let wallet = new WalletProvider({
  appId: ARCANA_APP_ID,
  iframeUrl: ARCANA_WALLET_URL,
  network: ARCANA_AUTH_NETWORK,
});

const themeConfig = {
  assets: {
    logo: {
      dark: {
        horizontal: "./logo-horizontal-dark.png",
        vertical: "./logo-vertical-dark.png",
      },
      light: {
        horizontal: "./logo-horizontal-light.png",
        vertical: "./logo-vertical-light.png",
      },
    },
  },
  theme: "dark",
};

function useArcanaWallet() {
  async function init() {
    await wallet.init(themeConfig);
  }

  async function isLoggedIn() {
    return await wallet.isLoggedIn();
  }

  async function requestSocialLogin(type) {
    await wallet.requestSocialLogin(type);
  }

  async function fetchUserDetails() {
    const provider = wallet.getProvider();
    const accounts = await provider.request({ method: "eth_accounts" });
    console.log("accounts", accounts);
  }

  return { init, isLoggedIn, requestSocialLogin, fetchUserDetails };
}

export default useArcanaWallet;
