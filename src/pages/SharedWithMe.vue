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
      <files-list :files="files" pageTitle="Shared With Me" />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from "@vue/runtime-core";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";
import { useStore } from "vuex";
// import { findUser } from "../services/user.service";

export default {
  name: "",
  setup() {
    const store = useStore();
    let files = computed(() => {
      return store.getters.sharedWithMe;
    });
    onMounted(async () => {
      document.title = "Shared With Me | Arcana Demo";
      const address = import.meta.env.VITE_ARCANA_APP_ID;
      const Arcana = new arcana.Arcana(
        address,
        store.getters.privateKey,
        store.getters.email
      );
      let sharedFiles = await Arcana.sharedFiles();
      store.dispatch(
        "updateSharedWithMe",
        sharedFiles.map((d) => {
          d["fileId"] = d["did"];
          return d;
        })
      );
    });

    return {
      files,
    };
  },
  components: { UserProfile, FilesList },
};
</script>