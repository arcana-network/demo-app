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
      files = store.getters.sharedWithMe;
      console.log("Files inside comp",files)
      return files;
    });
    // onMounted(() => {
    //   document.title = "Shared With Me | Arcana Demo";
    //   const publicKey = store.getters.publicKey;
    //   findUser(publicKey).then((snapshot) => {
    //     const user = snapshot.data();
    //     store.dispatch("updateSharedWithMe", user.sharedWithMe);
    //   });
    // });

    return {
      files,
    };
  },
  components: { UserProfile, FilesList },
};
</script>