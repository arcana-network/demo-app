<template>
  <button
    class="
      rounded-3xl
      px-6
      py-2
      cursor-pointer
      upload-btn
      focus:outline-none
      ripple
      font-ubuntu
    "
    @click.stop="openFileUploadView"
  >
    Upload File
  </button>
</template>

<style scoped>
.upload-btn {
  background-color: #058aff;
  color: white;
  font-weight: 500;
  box-shadow: 0px 3px 20px #058aff66;
}
</style>

<script>
import { onBeforeUnmount, onMounted } from "@vue/runtime-core";

import useArcanaStorage from "../use/arcanaStorage";

export default {
  setup() {
    const { upload } = useArcanaStorage();

    let file;

    onMounted(() => {
      file = document.createElement("input");
      file.type = "file";
      file.hidden = true;
      file.multiple = false;
      file.onchange = fileChangeHandler;
    });

    onBeforeUnmount(() => {
      file.remove();
    });

    function openFileUploadView() {
      file.click();
    }

    function fileChangeHandler() {
      if (this.files[0]) {
        upload(this.files[0]);
        file.value = "";
      }
    }
    return {
      openFileUploadView,
    };
  },
};
</script>
