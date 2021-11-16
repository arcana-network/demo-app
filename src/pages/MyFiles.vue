<template>
  <div
    class="
      bg-white
      files-container
      fixed
      right-3
      top-20
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
import { computed, onMounted, inject } from "@vue/runtime-core";
import UploadFab from "../components/UploadFab.vue";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";
import { useStore } from "vuex";
import { useFileMixin } from "../mixins/file.mixin";
import { getArcanaStorage } from "../utils/arcana-sdk";

export default {
  name: "",
  setup() {
    const store = useStore();
    const toast = inject("$toast");
    const fileMixin = useFileMixin(toast);
    let files = computed(() => {
      return store.getters.myFiles;
    });

    onMounted(async () => {
      document.title = "My Files | Arcana Demo";
      store.dispatch("showLoader", "Fetching uploaded files...");
      await fileMixin.updateLimits();
      const arcanaStorage = getArcanaStorage();
      let myfiles = await arcanaStorage.myFiles();
      myfiles = myfiles ? myfiles : [];
      store.dispatch(
        "updateMyFiles",
        myfiles.map((d) => {
          d["fileId"] = d["did"];
          return d;
        })
      );
      store.dispatch("hideLoader");
    });
    return {
      files,
    };
  },
  components: { UploadFab, UserProfile, FilesList },
};
</script>


