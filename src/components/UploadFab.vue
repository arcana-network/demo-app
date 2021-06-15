<template>
  <button
    class="
      fixed
      rounded-3xl
      right-14
      lg:bottom-12
      bottom-6
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
  z-index: 3000;
}
</style>

<script>
import { inject, onBeforeUnmount, onMounted } from "@vue/runtime-core";
export default {
  setup() {
    let file;
    const toast = inject("$toast");
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
    function fileChangeHandler(event) {
      console.log(event, this.files);
      toast("File uploaded", {
        styles: {
          backgroundColor: "green",
        },
        type: "success",
      });
    }
    return {
      openFileUploadView,
    };
  },
};
</script>
