<template>
  <fullsize-background>
    <full-screen-loader
      v-if="loader || !isWalletLoaded"
      :key="'arcana-demo-app-loader'"
      :message="loadingMessage"
    />
    <div v-if="isWalletLoaded">
      <app-sidebar v-if="privateKey && $route.name !== 'Login'" />
      <router-view></router-view>
    </div>
  </fullsize-background>
</template>

<script>
import FullsizeBackground from "./components/FullsizeBackground.vue";
import AppSidebar from "./components/AppSidebar.vue";
import FullScreenLoader from "./components/FullScreenLoader.vue";
import { useStore } from "vuex";
import { computed, onBeforeMount, ref } from "vue";
import useArcanaWallet from "./use/arcanaWallet";

export default {
  setup() {
    const store = useStore();
    const isWalletLoaded = ref(false);
    const { init } = useArcanaWallet();

    onBeforeMount(async () => {
      await init();
      isWalletLoaded.value = true;
    });

    let loader = computed(() => {
      return store.getters.loader;
    });
    let loadingMessage = computed(() => {
      return store.getters.loadingMessage;
    });
    let privateKey = computed(() => {
      return store.getters.privateKey;
    });

    return {
      loader,
      loadingMessage,
      privateKey,
      isWalletLoaded,
    };
  },
  components: { FullsizeBackground, AppSidebar, FullScreenLoader },
};
</script>

<style></style>
