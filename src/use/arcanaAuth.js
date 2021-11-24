import { AuthProvider } from "@arcana/auth";
import { useStore } from "vuex";
import { Wallet } from "ethers";
import { ref, onBeforeMount } from "vue";

import padPublicKey from "../utils/padPublicKey";

const ARCANA_APP_ID = import.meta.env.VITE_ARCANA_APP_ID;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function useArcanaAuth() {
  const store = useStore();
  const authInstanceRef = ref(null);

  onBeforeMount(() => {
    if (!authInstanceRef.value) {
      authInstanceRef.value = new AuthProvider({
        appID: ARCANA_APP_ID,
        network: "testnet",
        oauthCreds: [
          {
            type: "google",
            clientId: GOOGLE_CLIENT_ID,
          },
        ],
        redirectUri: `${window.location.origin}/auth/redirect`,
      });
    }
  });

  function isLoggedIn() {
    return authInstanceRef.value.isLoggedIn();
  }

  async function login() {
    if (!isLoggedIn()) {
      store.dispatch("showLoader", "Logging in...");
      await authInstanceRef.value.loginWithSocial("google");
    }

    store.dispatch(
      "showLoader",
      "Fetching keys and generating wallet address..."
    );

    const { userInfo, privateKey } = await authInstanceRef.value.getUserInfo();
    store.dispatch("addBasicDetails", {
      email: userInfo.id,
      profileImage: userInfo.picture,
      givenName: userInfo.name,
    });

    const publicKey = await authInstanceRef.value.getPublicKey({
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
    await authInstanceRef.value.logout();
    store.dispatch("clearStore");
  }

  return {
    handleRedirect,
    isLoggedIn,
    login,
    logout,
  };
}

export default useArcanaAuth;
