<template>
  <fullsize-background>
    <app-sidebar v-if="$route.name !== 'Login'" />
    <router-view></router-view>
  </fullsize-background>
</template>

<script>
import FullsizeBackground from "./components/FullsizeBackground.vue";
import AppSidebar from "./components/AppSidebar.vue";
export default {
  setup() {},
  components: { FullsizeBackground, AppSidebar },
};
</script>

<style>
</style>
