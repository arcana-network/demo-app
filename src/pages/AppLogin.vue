<template>
  <div class="bg-white absolute login-container p-10 text-center">
    <img
      src="@/assets/rocket-science.png"
      style="height: 120px; display: inline"
    />
    <div class="inline-block mt-12">
      By clicking on Login, you agree to Arcana Network's
      <a href="/" style="color: #058aff; text-decoration: none"> Privacy </a>
      &
      <a href="/" style="color: #058aff; text-decoration: none"> Terms </a>
    </div>
    <a class="google-button" @click.stop="onLogin">Login</a>
  </div>
</template>

<style scoped>
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

@media screen and (max-width: 1024px) {
  .files-container {
    width: calc(100% - 1.5rem);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}

.google-button {
  display: inline-flex;
  border: 1px solid rgb(5, 138, 255);
  background-color: rgb(5, 138, 255);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 2rem;
  white-space: nowrap;
  font-weight: 800;
  font-size: 1.2em;
  width: 8rem;
  height: 3rem;
  justify-content: center;
  align-items: center;
}
</style>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import useArcanaWallet from "../use/arcanaWallet";
import useToast from "../use/toast";

export default {
  setup() {
    const router = useRouter();
    const { toastSuccess, toastError } = useToast();
    const { requestAuthPopup, fetchUserDetails, setHook } = useArcanaWallet();

    onMounted(async () => {
      document.title = "Login | Arcana Demo";
      setHook("connect", () => {
        router.push("/my-files");
      });
    });

    async function onLogin() {
      try {
        await requestAuthPopup();
        await fetchUserDetails();
        await router.push("/my-files");
        toastSuccess("Login Success");
      } catch (e) {
        console.error("error", e);
        if (e.message !== "User closed the connect modal") {
          toastError("Something went wrong. Try again");
        }
      }
    }

    return {
      onLogin,
    };
  },
};
</script>
