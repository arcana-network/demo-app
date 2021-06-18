<template>
  <full-screen-overlay @click.stop="closeDialog" />
  <div
    class="fixed top-1/2 left-1/2 h-auto py-4 px-6 bg-white"
    style="
      min-width: 210px;
      max-width: 420px;
      width: 50%;
      min-height: 20px;
      z-index: 10001;
      transform: translate(-50%, -50%);
    "
  >
    <XIcon
      class="absolute h-6 w-6 right-2 top-2 cursor-pointer"
      style="color: #707070"
      @click.stop="closeDialog"
    />
    <slot></slot>
  </div>
</template>

<script>
import FullScreenOverlay from "./FullScreenOverlay.vue";
import { XIcon } from "@heroicons/vue/outline";
export default {
  components: { FullScreenOverlay, XIcon },
  emits: ["close"],
  setup(props, { emit }) {
    function closeDialog() {
      emit("close");
    }

    return {
      closeDialog,
    };
  },
};
</script>