import { useStore } from "vuex";
import { useRouter } from "vue-router";

import WalletService from "../services/wallet.service";

function useArcanaWallet() {
  const store = useStore();
  const router = useRouter();

  async function initWallet() {
    store.dispatch("showFullScreenLoader", "Initialising Arcana wallet...");

    await WalletService.init();

    WalletService.setHook("disconnect", async () => {
      store.dispatch("clearStore");
      router.push("/login");
      router.go();
    });

    store.dispatch("hideFullScreenLoader");
  }

  async function isLoggedIn() {
    store.dispatch("showFullScreenLoader", "Checking login status...");
    const loginStatus = await WalletService.isLoggedIn();
    store.dispatch("hideFullScreenLoader");
    return loginStatus;
  }

  async function requestSocialLogin(type) {
    await WalletService.requestSocialLogin(type);
  }

  async function fetchUserDetails() {
    store.dispatch("showFullScreenLoader", "Fetching account details...");

    const userInfo = await WalletService.requestUserInfo();
    store.dispatch("addUserInfo", JSON.parse(userInfo));

    const [walletAddress] = await WalletService.requestWalletInfo();
    store.dispatch("addWalletInfo", { address: walletAddress });

    store.dispatch("hideFullScreenLoader");
  }

  async function logout() {
    await WalletService.logout();
  }

  async function requestPublicKey(email) {
    return await WalletService.requestPublicKey(email);
  }

  return {
    fetchUserDetails,
    initWallet,
    isLoggedIn,
    logout,
    requestPublicKey,
    requestSocialLogin,
  };
}

export default useArcanaWallet;