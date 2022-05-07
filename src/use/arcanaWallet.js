const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_WALLET_URL = import.meta.env.VITE_ARCANA_WALLET_URL;

const { WalletProvider } = window.arcana.wallet;

let wallet = null;

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
  theme: "light",
};

function useArcanaWallet() {
  async function init() {
    wallet = new WalletProvider({
      appId: ARCANA_APP_ID,
      iframeUrl: ARCANA_WALLET_URL,
      network: ARCANA_AUTH_NETWORK,
    });
    await wallet.init(themeConfig);
  }

  return { init };
}

export default useArcanaWallet;
