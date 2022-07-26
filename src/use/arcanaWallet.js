import { useStore } from "vuex";
import { useRouter } from "vue-router";

import AuthService from "../services/auth.service";

function useArcanaWallet() {
  const store = useStore();
  const router = useRouter();

  async function initWallet() {
    store.dispatch("showFullScreenLoader", "Initialising Arcana wallet...");

    await AuthService.init();

    AuthService.setHook("disconnect", async () => {
      store.dispatch("clearStore");
      router.push("/login");
      router.go();
    });

    store.dispatch("hideFullScreenLoader");
  }

  async function isLoggedIn() {
    store.dispatch("showFullScreenLoader", "Checking login status...");
    const loginStatus = await AuthService.isLoggedIn();
    store.dispatch("hideFullScreenLoader");
    return loginStatus;
  }

  async function requestSocialLogin(type) {
    await AuthService.requestSocialLogin(type);
  }

  async function fetchUserDetails() {
    store.dispatch("showFullScreenLoader", "Fetching account details...");

    const userInfo = await AuthService.requestUserInfo();
    store.dispatch("addUserInfo", JSON.parse(userInfo));

    const [walletAddress] = await AuthService.requestWalletInfo();
    store.dispatch("addWalletInfo", { address: walletAddress });

    store.dispatch("hideFullScreenLoader");
  }

  async function logout() {
    await AuthService.logout();
  }

  async function requestPublicKey(email) {
    return await AuthService.requestPublicKey(email);
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
