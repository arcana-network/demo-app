<template>
  <div class="bg-white files-container fixed right-3 top-4">
    <div id="my-files-container">
      <user-profile />
      <upload-fab />
      <files-list :files="files" pageType="My Files" :listType="listType" />
    </div>
  </div>
</template>

<style scoped>
#my-files-container {
  opacity: 1;
  animation: fade 1s;
}
@keyframes fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>

<script>
import { onMounted, ref } from "@vue/runtime-core";
import UploadFab from "../components/UploadFab.vue";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";

export default {
  name: "",
  setup() {
    const files = ref([]);
    const listType = ref("grid");
    onMounted(() => {
      document.title = "My Files | Arcana Demo";
    });

    return {
      files,
      listType,
    };
  },
  components: { UploadFab, UserProfile, FilesList },
};
</script>


