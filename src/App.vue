<template>
  <fullsize-background>
    <full-screen-loader
      v-if="loader || !isAppInitialised"
      :key="'arcana-demo-app-loader'"
      :message="loadingMessage"
    />
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
import useArcanaStorage from "./use/arcanaStorage";
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
    const { initStorage } = useArcanaStorage();

    onBeforeMount(async () => {
      await initWallet();
      const hasLoggedIn = await isLoggedIn();
      if (hasLoggedIn) {
        await fetchUserDetails();

        initStorage();

        if (route.path === "/login") {
          await router.push("/my-files");
          toastSuccess("Login Success");
        }
      } else {
        await router.push("/login");
      }

      isAppInitialised.value = true;
    });

    let loader = computed(() => {
      return store.getters.loader;
    });
    let loadingMessage = computed(() => {
      return store.getters.loadingMessage;
    });

    return {
      isAppInitialised,
      loader,
      loadingMessage,
    };
  },
  components: { FullsizeBackground, AppSidebar, FullScreenLoader },
};
</script>
