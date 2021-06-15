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
import { onMounted, ref } from "@vue/runtime-core";
import UserProfile from "../components/UserProfile.vue";
import FilesList from "../components/FilesList.vue";

export default {
  name: "",
  setup() {
    let files = ref([
      {
        name: "File 1",
        size: 3012,
        did: "randomhash",
      },
      {
        name: "File 2",
        size: 3512,
        did: "randomhash2",
      },
      {
        name: "File 3",
        size: 9012,
        did: "randomhash3",
      },
      {
        name: "File 3",
        size: 9012,
        did: "randomhash3",
      },
      {
        name: "File 2",
        size: 3512,
        did: "randomhash2",
      },
      {
        name: "File 3",
        size: 9012,
        did: "randomhash3",
      },
      {
        name: "File 3",
        size: 9012,
        did: "randomhash3",
      },
      {
        name: "File 1 dfdfsewtwetrretwtewtrewr askjheoiuwqhyouwqheoiwqeowqehowqieuwqoieuoiwqeuiowqueoiwqueowq",
        size: 3012,
        did: "randomhash",
      },
      {
        name: "File 2",
        size: 3512,
        did: "randomhash2",
      },
      {
        name: "File 3",
        size: 9012,
        did: "randomhash3",
      },
    ]);
    onMounted(() => {
      document.title = "Shared With Me | Arcana Demo";
    });

    return {
      files,
    };
  },
  components: { UserProfile, FilesList },
};
</script>