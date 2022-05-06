<template>
  <div class="text-white m-2">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";

import useArcanaAuth from "../use/arcanaAuth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const router = useRouter();

    const { fetchUserDetails } = useArcanaAuth();

    onMounted(async () => {
      await fetchUserDetails();
      await router.push({ name: "My Files" });
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
