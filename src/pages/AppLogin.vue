<template>
  <div class="bg-white absolute login-container p-10 text-center">
    <img
      src="@/assets/vertical-light.svg"
      style="height: 120px; display: inline"
    />
    <div class="inline-block mt-12">
      By clicking on signin with google, you agree to Arcana Network's
      <a href="/" style="color: #058aff; text-decoration: none"> Privacy </a>
      &
      <a href="/" style="color: #058aff; text-decoration: none"> Terms </a>
    </div>
    <div
      id="google-signin-button"
      @click.stop="overrideClick"
      class="font-ubuntu"
    ></div>
    <a class="google-button" @click.stop="onSignInClick">Sign In with Google</a>
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
  min-width: 320px;
  max-width: 480px;
  width: 50%;
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

.google-button {
  padding: 0.8em 1.2em;
  border: 1px solid rgb(5, 138, 255);
  background-color: rgb(5, 138, 255);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  margin: 1em 0;
  white-space: nowrap;
  font-weight: 800;
  font-size: 1.2em;
}
</style>

<script>
import { onBeforeMount, onMounted, inject } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import bytes from "bytes";
import { getArcanaAuth, getArcanaStorage } from "../utils/arcana-sdk";
import { Wallet } from "ethers";
// import { Arcana as ArcanaSDK } from "@arcana_tech/storage-sdk";
import { useFileMixin } from "../mixins/file.mixin";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let arcanaAuth;
    const toast = inject("$toast");
    const fileMixin = useFileMixin(toast);

    onBeforeMount(() => {
      document.title = "Login | Arcana Demo";
      arcanaAuth = getArcanaAuth();
      if (arcanaAuth.isLoggedIn("google")) {
        onSignInClick();
      }
    });

    async function onSignInClick() {
      try {
        store.dispatch("showLoader", "Fetching keys and wallet address...");
        const pk = await arcanaAuth.signIn("google");
        const userInfo = await arcanaAuth.getUserInfo("google");
        const publicKey = await arcanaAuth.getPublicKey({
          verifier: "google",
          id: userInfo.id,
        });
        const actualPublicKey =
          publicKey.X.padStart(64, "0") + publicKey.Y.padStart(64, "0");
        const wallet = new Wallet(pk.privateKey);
        store.dispatch("addBasicDetails", {
          email: userInfo.id,
          profileImage: userInfo.picture,
          givenName: userInfo.name,
        });
        store
          .dispatch("addCryptoDetails", {
            walletAddress: wallet.address,
            privateKey: pk.privateKey,
            publicKey: actualPublicKey,
          })
          .then(async () => {
            let user = {
              address: actualPublicKey,
              myFiles: [],
              sharedWithMe: [],
              trash: [],
            };
            await fileMixin.updateLimits();
            const arcanaStorage = getArcanaStorage();
            let myfiles = await arcanaStorage.myFiles();
            myfiles = myfiles ? myfiles : [];
            let sharedFiles = await arcanaStorage.sharedFiles();
            sharedFiles = sharedFiles ? sharedFiles : [];
            user.myFiles = myfiles.map((d) => {
              d["fileId"] = d["did"];
              return d;
            });
            user.sharedWithMe = sharedFiles.map((d) => {
              d["fileId"] = d["did"];
              return d;
            });
            store.dispatch("updateFiles", user);
            router
              .replace({ name: "My Files" })
              .then(() => store.dispatch("hideLoader"));
          });
      } catch (e) {
        console.error("error", e);
        store.dispatch("hideLoader");
      }
    }

    return {
      onSignInClick,
    };
  },
};
</script>
