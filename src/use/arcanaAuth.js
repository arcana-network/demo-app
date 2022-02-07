// import { AuthProvider, SocialLoginType } from "@arcana/auth";
import { Wallet } from "ethers";

import padPublicKey from "../utils/padPublicKey";

const { AuthProvider, SocialLoginType } = window.arcana.auth;

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

async function useArcanaAuth(store) {
  const authInstance = await AuthProvider.init({
    appId: ARCANA_APP_ID,
    network: "test",
    flow: "popup",
    redirectUri: `${window.location.origin}/auth/redirect`,
  });

  function isLoggedIn() {
    console.log({ AUTH: { isLoggedIn: authInstance.isLoggedIn() } });
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
    // const userInfo = {
    //   email: "xyz",
    //   profileImage: "xyz",
    //   givenName: "xyz",
    // };
    store.dispatch("addBasicDetails", {
      email: userInfo.id,
      profileImage: userInfo.picture,
      givenName: userInfo.name,
    });

    // const privateKey =
    //   "0x8624ea65e207e82c32fbe8353569b8400cc07d5381de11a3df656c0fb9d4364c";
    // const actualPublicKey =
    //   "0x041500191df30d305c3c809590f22f53b1834ed6edc40998307fd0fe3b30051b7895c87d4aaf80293f1f0ea60c3750c19d735a263d545f4eb9f30890008b3491f7";

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

// export { authInstance };

export default useArcanaAuth;
