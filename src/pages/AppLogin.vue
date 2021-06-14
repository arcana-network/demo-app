<template>
  <div class="bg-white absolute login-container p-10 text-center">
    <img
      src="@/assets/vertical-light.svg"
      style="height: 120px; display: inline"
    />
    <div class="inline-block mt-12">
      By clicking on signin with google, you agree to Arcana Network's
      <a href="/" style="color: #058aff; textdecoration: none"> Privacy </a>
      &
      <a href="/" style="color: #058aff; textdecoration: none"> Terms </a>
    </div>
    <div id="google-signin-button" class="font-ubuntu"></div>
  </div>
</template>

<style scoped>
#google-signin-button {
  position: relative;
  margin: 0 auto;
  margin-top: 2rem;
  width: 240px;
}
.login-container {
  width: 400px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
      store.dispatch("showLoader", "Fetching keys...");
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
          walletAddress: privateKey.address,
          privateKey: privateKey.privateKey,
          publicKey: actualPublicKey,
        })
        .then(() => {
          store.dispatch("hideLoader");
          router.push({ name: "My Files" });
        });
    }
  },
};
</script>
