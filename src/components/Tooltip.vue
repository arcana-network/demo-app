<template>
  <div class="tooltip-box inline-block">
    <slot @mouseenter="showTooltip" @mouseleave="hideTooltip"></slot>
    <div class="tooltip">
      <!-- <span class="triangle"></span> -->
      {{ message }}
    </div>
  </div>
</template>

<style scoped>
.tooltip {
  background: #058aff;
  color: #ffffff;
  text-align: center;
  padding: 10px 20px 10px 20px;
  border-radius: 50px;
  box-shadow: 5px 5px 12px #058aff66;
  top: calc(100% + 15px);
  left: 50%;
  transform: translate-x(-50%);
}
.tooltip-box {
  position: relative;
  vertical-align: middle;
}
.triangle {
  border-width: 0 7px 10px;
  border-color: transparent;
  border-bottom-color: #058aff;
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translate-x(-50%);
}
</style>

<script>
export default {
  props: ["message"],
  setup(props) {
    function showTooltip(event) {
      console.log(event);
    }

    function hideTooltip(event) {
      console.log(event);
    }

    return {
      showTooltip,
      hideTooltip,
    };
  },
};
</script>