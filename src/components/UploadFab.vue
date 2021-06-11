<template>
  <button
    class="
      fixed
      rounded-3xl
      right-14
      bottom-12
      px-6
      py-2
      cursor-pointer
      upload-fab
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
.upload-fab {
  background-color: #058aff;
  color: white;
  font-weight: 500;
  box-shadow: 0px 3px 20px #058aff66;
}
</style>

<script>
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    let file;
    onMounted(() => {
      file = document.createElement("input");
      file.type = "file";
      file.hidden = true;
      file.multiple = false;
      file.onchange = fileChangeHandler;
    });
    function openFileUploadView() {
      file.click();
    }
    function fileChangeHandler(event) {
      console.log(event, this.files);
    }
    return {
      openFileUploadView,
    };
  },
};
</script>
