<template>
  <fullsize-background>
    <full-screen-loader
      v-if="loader || !isAuthLoaded"
      :key="'arcana-demo-app-loader'"
      :message="loadingMessage"
    />
    <div v-if="isAuthLoaded">
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
import useArcanaAuth from "./use/arcanaAuth";

export default {
  setup() {
    const store = useStore();
    const isAuthLoaded = ref(false);
    const { init } = useArcanaAuth();

    onBeforeMount(async () => {
      await init();
      isAuthLoaded.value = true;
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
      isAuthLoaded,
    };
  },
  components: { FullsizeBackground, AppSidebar, FullScreenLoader },
};
</script>

<style>
</style>
