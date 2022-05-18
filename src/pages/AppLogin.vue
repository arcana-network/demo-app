<template>
  <div class="bg-white absolute login-container p-10 text-center">
    <img
      src="@/assets/rocket-science.png"
      style="height: 120px; display: inline"
    />
    <div class="inline-block mt-12">
      By clicking on signin with google, you agree to Arcana Network's
      <a href="/" style="color: #058aff; text-decoration: none"> Privacy </a>
      &
      <a href="/" style="color: #058aff; text-decoration: none"> Terms </a>
    </div>
    <a class="google-button" @click.stop="onSignInClick">Sign In with Google</a>
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
  display: inline-block;
  padding: 0.8em 1.2em;
  border: 1px solid rgb(5, 138, 255);
  background-color: rgb(5, 138, 255);
  color: white;
  border-radius: 10px;
  cursor: pointer;
  margin-top: 2rem;
  white-space: nowrap;
  font-weight: 800;
  font-size: 1.2em;
}
</style>

<script>
import { onMounted } from "vue";

import useArcanaWallet from "../use/arcanaWallet";
import useToast from "../use/toast";

export default {
  setup() {
    const { toastError } = useToast();
    const { requestSocialLogin } = useArcanaWallet();

    onMounted(async () => {
      document.title = "Login | Arcana Demo";
    });

    async function onSignInClick() {
      try {
        await requestSocialLogin("google");
      } catch (e) {
        console.error("error", e);
        toastError("Something went wrong. Try again");
      }
    }

    return {
      onSignInClick,
    };
  },
};
</script>
