// import { AuthProvider, SocialLoginType } from "@arcana/auth";
import { Wallet } from "ethers";
import { useStore } from "vuex";

import padPublicKey from "../utils/padPublicKey";

const { AuthProvider, SocialLoginType } = window.arcana.auth;

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

async function useArcanaAuth() {
  const store = useStore();

  const authInstance = await AuthProvider.init({
    appId: ARCANA_APP_ID,
    network: "test",
    flow: "popup",
    redirectUri: `${window.location.origin}/auth/redirect`,
  });

  function isLoggedIn() {
    return authInstance.isLoggedIn();
  }

  async function login() {
    if (!isLoggedIn()) {
      await authInstance.loginWithSocial(SocialLoginType.google);
    }
  }

  async function fetchUserDetails() {
    store.dispatch(
      "showLoader",
      "Fetching keys and generating wallet address..."
    );

    const { userInfo, privateKey } = authInstance.getUserInfo();
    store.dispatch("addBasicDetails", {
      email: userInfo.id,
      profileImage: userInfo.picture,
      givenName: userInfo.name,
    });

    const publicKey = await authInstance.getPublicKey({
      verifier: "google",
      id: userInfo.id,
    });
    const actualPublicKey = padPublicKey(publicKey);
    const wallet = new Wallet(privateKey);
    store.dispatch("addCryptoDetails", {
      walletAddress: wallet.address,
      privateKey: privateKey,
      publicKey: actualPublicKey,
    });

    store.dispatch("hideLoader");
  }

  function handleRedirect() {
    AuthProvider.handleRedirectPage(window.location);
  }

  async function logout() {
    await authInstance.logout();
    store.dispatch("clearStore");
  }

  async function getPublicKey(email) {
    return await authInstance.getPublicKey({
      verifier: "google",
      id: email,
    });
  }

  return {
    handleRedirect,
    isLoggedIn,
    login,
    logout,
    fetchUserDetails,
    getPublicKey,
  };
}

export default useArcanaAuth;
