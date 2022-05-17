import { useStore } from "vuex";
import { useRouter } from 'vue-router';

import WalletService from "../services/wallet.service";

function useArcanaWallet() {
  const store = useStore();
  const router = useRouter();

  async function initWallet() {
    store.dispatch("showLoader", "Initialising Arcana wallet...");

    await WalletService.init();

    WalletService.setHook("disconnect", async () => {
      await logout();
      router.push("/login");
    });

    store.dispatch("hideLoader");
  }

  async function isLoggedIn() {
    store.dispatch("showLoader", "Checking login status...");
    const loginStatus = await WalletService.isLoggedIn();
    store.dispatch("hideLoader");
    return loginStatus;
  }

  async function requestSocialLogin(type) {
    await WalletService.requestSocialLogin(type);
  }

  async function fetchUserDetails() {
    store.dispatch("showLoader", "Fetching account details...");

    const userInfo = await WalletService.requestUserInfo();
    store.dispatch("addUserInfo", JSON.parse(userInfo));

    const [walletAddress] = await WalletService.requestWalletInfo();
    store.dispatch("addWalletInfo", { address: walletAddress });

    store.dispatch("hideLoader");
  }

  async function logout() {
    await WalletService.logout();
    store.dispatch("clearStore");
  }

  return { initWallet, isLoggedIn, requestSocialLogin, fetchUserDetails, logout };
}

export default useArcanaWallet;
