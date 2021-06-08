<template>
  <div class="bg-white files-container fixed right-3 top-4">
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
    >
      Upload File
    </button>
  </div>
</template>

<style scoped>
.files-container {
  height: calc(100vh - 2rem);
  width: calc(100% - 320px);
  border-top-left-radius: 40px;
  border-top-right-radius: 16px;
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 16px;
}

.upload-fab {
  background-color: #058aff;
  color: white;
  font-weight: 500;
  box-shadow: 0px 3px 20px #058aff66;
}

.ripple {
  background-position: center;
  transition: background 0.8s;
}
.ripple:hover {
  background: #47a7f5 radial-gradient(circle, transparent 1%, #47a7f5 1%)
    center/15000%;
}
.ripple:active {
  background-color: #6eb9f7;
  background-size: 100%;
  transition: background 0s;
}

@media screen and (max-width: 1024px) {
  .files-container {
    width: calc(100% - 1.5rem);
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}
</style>

<script>
import { onMounted } from "@vue/runtime-core";
export default {
  setup() {
    onMounted(() => {
      document.title = "My Files | Arcana Demo";
    });
  },
};
</script>
