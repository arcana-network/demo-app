<template>
  <div class="bg-white login-container mx-auto right-3 top-4">
    <div id="google-signin-button"></div>
  </div>
</template>

<style scoped>
.login-container {
  height: 480px;
  width: 400px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
}

.upload-fab {
  background-color: #058aff;
  color: white;
  font-weight: 500;
  box-shadow: 0px 3px 20px #058aff66;
}

.ripple {
  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%)
    center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}

@media screen and (max-width: 1024px) {
  .files-container {
    width: calc(100% - 1.5rem);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}
</style>

<script>
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    onMounted(() => {
      document.title = "Login | Arcana Demo";
      const gapi = window.gapi;
      gapi.signin2.render("google-signin-button", {
        scope: "profile email",
        width: 240,
        height: 50,
        longtitle: true,
        theme: "dark",
        onsuccess: onSignIn,
      });
    });
    async function onSignIn(googleUser) {
      const { getPublicKey, getPrivateKey } = window.arcana_dkg.default;
      const profile = googleUser.getBasicProfile();
      const email = profile.getEmail();
      const verifier = "google";
      const idToken = googleUser.getAuthResponse().id_token;
      store.dispatch("addBasicDetails", {
        email,
        profileImage: profile.getImageUrl(),
        givenName: profile.getGivenName(),
      });
      const publicKey = await getPublicKey(verifier, email);
      const privateKey = await getPrivateKey({
        id: email,
        verifier,
        idToken,
      });
      const actualPublicKey =
        publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
      store
        .dispatch("addCryptoDetails", {
          address: privateKey.address,
          privateKey: privateKey.privateKey,
          publicKey: actualPublicKey,
        })
        .then(() => {
          router.push({ name: "My Files" });
        });
    }
  },
};
</script>
