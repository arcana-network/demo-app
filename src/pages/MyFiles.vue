<template>
  <!-- <div></div> -->
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
      <upload-fab />
      <files-list :files="files" pageTitle="My Files" />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "@vue/runtime-core";
import UploadFab from "../components/UploadFab.vue";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";
import { useStore } from "vuex";

export default {
  name: "",
  setup() {
    const store = useStore();
    let files = computed(() => {
      return store.getters.myFiles;
    });
    onMounted(() => {
      document.title = "My Files | Arcana Demo";
    });
    return {
      files,
    };
  },
  components: { UploadFab, UserProfile, FilesList },
};
</script>


