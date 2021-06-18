<template>
  <div
    class="
      bg-white
      files-container
      fixed
      right-3
      top-16
      lg:top-4
      overflow-y-auto
    "
  >
    <div id="my-files-container" class="transition-fade">
      <user-profile />
      <files-list :files="files" pageTitle="Bin" />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "@vue/runtime-core";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";
import { useStore } from "vuex";

export default {
  name: "",
  setup() {
    const store = useStore();
    let files = computed(() => {
      return store.getters.trash;
    });
    onMounted(() => {
      document.title = "Bin | Arcana Demo";
    });

    return {
      files,
    };
  },
  components: { UserProfile, FilesList },
};
</script>