<template>
  <fullsize-background>
    <full-screen-loader v-if="isLoadingFullScreen || !isAppInitialised" :key="'arcana-demo-app-loader'"
      :message="fullScreenLoadingMessage" />
    <div v-else="isAppInitialised">
      <app-sidebar v-if="$route.name !== 'Login'" />
      <router-view />
    </div>
  </fullsize-background>
</template>

<script>
import { computed, onBeforeMount, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

import AppSidebar from "./components/AppSidebar.vue";
import FullScreenLoader from "./components/FullScreenLoader.vue";
import FullsizeBackground from "./components/FullsizeBackground.vue";
import useArcanaWallet from "./use/arcanaWallet";
import useToast from "./use/toast";

export default {
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const { toastSuccess } = useToast();

    const isAppInitialised = ref(false);

    const { initWallet, isLoggedIn, fetchUserDetails } = useArcanaWallet();

    onBeforeMount(async () => {
      await initWallet();
      const hasLoggedIn = await isLoggedIn();
      if (hasLoggedIn) {
        store.dispatch("showFullScreenLoader", "Fetching account details...");
        setTimeout(async () => {
          await fetchUserDetails();

          if (route.path === "/login") {
            await router.push("/my-files");
            toastSuccess("Login Success");
          }
        }, 500)
      } else {
        await router.push("/login");
      }

      isAppInitialised.value = true;
    });

    let isLoadingFullScreen = computed(() => {
      return store.getters.isLoadingFullScreen;
    });
    let fullScreenLoadingMessage = computed(() => {
      return store.getters.fullScreenLoadingMessage;
    });

    return {
      isAppInitialised,
      isLoadingFullScreen,
      fullScreenLoadingMessage,
    };
  },
  components: { FullsizeBackground, AppSidebar, FullScreenLoader },
};
</script>
