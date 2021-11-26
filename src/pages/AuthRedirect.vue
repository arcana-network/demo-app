<template>
  <div class="body-1">Redirecting...</div>
</template>

<script>
import { onMounted } from "@vue/runtime-core";

import useArcanaAuth from "../use/arcanaAuth";

export default {
  setup() {
    const { handleRedirect } = useArcanaAuth();

    onMounted(() => {
      handleRedirect();
    });
  },
};
</script>
