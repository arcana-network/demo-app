<template>
  <div
    class="bg-white files-container fixed right-3 top-20 lg:top-4 overflow-y-auto"
  >
    <div id="my-files-container" class="transition-fade">
      <user-profile />
      <files-list :files="files" pageTitle="My Files">
        <template #controls>
          <upload-button />
        </template>
      </files-list>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";

import FilesList from "../components/FilesList.vue";
import UploadButton from "../components/UploadButton.vue";
import useArcanaStorage from "../use/arcanaStorage";
import UserProfile from "../components/UserProfile.vue";
import InlineLoader from "../components/InlineLoader.vue";

export default {
  name: "MyFiles",
  setup() {
    const store = useStore();
    const { fetchStorageLimits, fetchMyFiles } = useArcanaStorage();

    const files = computed(() => store.getters.myFiles);

    onMounted(async () => {
      document.title = "My Files | Arcana Demo";
      await fetchStorageLimits();
      await fetchMyFiles();
    });

    return {
      files,
    };
  },
  components: { UploadButton, UserProfile, FilesList, InlineLoader },
};
</script>
