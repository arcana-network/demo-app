<template>
  <fullsize-background>
    <full-screen-loader
      v-if="loader"
      :key="'arcana-demo-app-loader'"
      :message="loadingMessage"
    />
    <div v-else>
      <app-sidebar v-if="$route.name !== 'Login'" />
      <router-view />
    </div>
  </fullsize-background>
</template>

<script>
import { computed, onBeforeMount, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import AppSidebar from "./components/AppSidebar.vue";
import FullScreenLoader from "./components/FullScreenLoader.vue";
import FullsizeBackground from "./components/FullsizeBackground.vue";
import useArcanaWallet from "./use/arcanaWallet";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const toast = inject("$toast");

    const { init, isLoggedIn, fetchUserDetails } = useArcanaWallet();

    onBeforeMount(async () => {
      await init();
      const hasLoggedIn = await isLoggedIn();
      if (hasLoggedIn) {
        await fetchUserDetails();

        if (route.path === "/login") {
          store.dispatch("showLoader");
          await router.push("/my-files");
          store.dispatch("hideLoader");

          toast("Login Success", {
            styles: {
              backgroundColor: "green",
            },
            type: "success",
          });
        }
      } else {
        store.dispatch("showLoader");
        await router.push("/login");
        store.dispatch("hideLoader");
      }
    });

    let loader = computed(() => {
      return store.getters.loader;
    });
    let loadingMessage = computed(() => {
      return store.getters.loadingMessage;
    });

    return {
      loader,
      loadingMessage,
    };
  },
  components: { FullsizeBackground, AppSidebar, FullScreenLoader },
};
</script>
