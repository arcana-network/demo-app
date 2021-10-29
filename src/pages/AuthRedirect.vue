<template>
  <div class="body-1">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";
import { getArcanaAuthProvider } from "../utils/arcana-sdk";

export default {
  setup() {
    onMounted(() => {
      // window.onload = () => {
      getArcanaAuthProvider().handleRedirectPage(window.location);
      // };
    });
  },
};
</script>