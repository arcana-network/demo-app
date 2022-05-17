import { useStore } from "vuex";
import { useRouter } from 'vue-router';

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const ARCANA_AUTH_NETWORK = import.meta.env.VITE_ARCANA_AUTH_NETWORK;
const ARCANA_WALLET_URL = import.meta.env.VITE_ARCANA_WALLET_URL;

const { WalletProvider } = window.arcana.wallet;

let wallet = new WalletProvider({
  appId: ARCANA_APP_ID,
  iframeUrl: ARCANA_WALLET_URL,
  network: ARCANA_AUTH_NETWORK,
  inpageProvider: true,
});

function useArcanaWallet() {
  const store = useStore();
  const router = useRouter();

  async function initWallet() {
    store.dispatch("showLoader", "Initialising Arcana wallet...");

    await wallet.init();

    const provider = wallet.getProvider();
    provider.on("disconnect", async () => {
      await logout();
      router.push("/login");
    });

    store.dispatch("hideLoader");
  }

  async function isLoggedIn() {
    store.dispatch("showLoader", "Checking login status...");
    const loginStatus = await wallet.isLoggedIn();
    store.dispatch("hideLoader");
    return loginStatus;
  }

  async function requestSocialLogin(type) {
    await wallet.requestSocialLogin(type);
  }

  async function fetchUserDetails() {
    store.dispatch("showLoader", "Fetching account details...");

    const userInfo = await wallet.requestUserInfo();
    store.dispatch("addUserInfo", JSON.parse(userInfo));

    const provider = wallet.getProvider();
    const [walletAddress] = await provider.request({ method: "eth_accounts" });
    store.dispatch("addWalletInfo", { address: walletAddress });

    store.dispatch("hideLoader");
  }

  async function logout() {
    await wallet.logout();
    store.dispatch("clearStore");
  }

  return { initWallet, isLoggedIn, requestSocialLogin, fetchUserDetails, logout };
}

export default useArcanaWallet;
