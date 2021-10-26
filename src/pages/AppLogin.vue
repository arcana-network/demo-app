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
    <a class="google-button" @click.stop="overrideClick">Sign In with Google</a>
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
import { onMounted } from "@vue/runtime-core";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import bytes from "bytes";
import { getArcanaAuth } from "../utils/arcana-login";
import { Wallet } from "ethers";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let arcanaAuth;

    onMounted(() => {
      document.title = "Login | Arcana Demo";
      arcanaAuth = getArcanaAuth();
      if (arcanaAuth.isLoggedIn("google")) {
        overrideClick();
      }
    });

    async function overrideClick() {
      try {
        store.dispatch("showLoader", "Fetching keys and wallet address...");
        console.log(arcanaAuth);
        const pk = await arcanaAuth.signIn("google");
        console.log({ pk });
        const userInfo = await arcanaAuth.getUserInfo("google");
        console.log({ userInfo });
        const publicKey = await arcanaAuth.getPublicKey({
          verifier: "google",
          id: userInfo.id,
        });
        console.log({ publicKey });
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
              totalStorage: bytes("25GB"),
              storageUsed: 0,
              address: actualPublicKey,
              myFiles: [],
              sharedWithMe: [],
              trash: [],
            };
            store.dispatch("updateStorage", {
              totalStorage: user.totalStorage,
              storageUsed: user.storageUsed,
            });
            const address = "0x73A15a259d1bB5ACC23319CCE876a976a278bE82";
            const Arcana = new arcana.Arcana(
              address,
              store.getters.privateKey,
              store.getters.email
            );
            let myfiles = await Arcana.myFiles();
            myfiles = myfiles ? myfiles : [];
            let sharedFiles = await Arcana.sharedFiles();
            console.log("shared", actualPublicKey, sharedFiles);
            sharedFiles = sharedFiles ? sharedFiles : [];
            user.myFiles = myfiles.map((d) => {
              d["fileId"] = d["did"];
              delete d["did"];
              return d;
            });
            user.sharedWithMe = sharedFiles.map((d) => {
              d["fileId"] = d["did"];
              return d;
            });
            console.log("shared After", user);
            store.dispatch("updateFiles", user);
            // if (store.getters.redirectTo.name) {
            //   const redirectTo = store.getters.redirectTo;
            //   store.dispatch("removeRedirect");
            //   router
            //     .replace(redirectTo)
            //     .then(() => store.dispatch("hideLoader"));
            // } else
            router
              .replace({ name: "My Files" })
              .then(() => store.dispatch("hideLoader"));
          });
      } catch (e) {
        console.log("error", e);
        store.dispatch("hideLoader");
      }
    }

    return {
      overrideClick,
    };
  },
};
</script>
