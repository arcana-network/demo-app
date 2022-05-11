<template>
  <div class="text-white m-2">Redirecting...</div>
</template>

<script>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

import useArcanaWallet from "../use/arcanaWallet";

export default {
  setup() {
    const router = useRouter();

    const { fetchUserDetails } = useArcanaWallet();

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
