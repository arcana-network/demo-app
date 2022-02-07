<template>
  <div class="body-1">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";

import useArcanaAuth from "../use/arcanaAuth";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    onMounted(async () => {
      const { fetchUserDetails } = await useArcanaAuth(store);
      await fetchUserDetails();
      store.dispatch("showLoader");
      await router.push({ name: "My Files" });
      store.dispatch("hideLoader");
      toast("Login Success", {
        styles: {
          backgroundColor: "green",
        },
        type: "success",
      });
    });
  },
};
</script>
