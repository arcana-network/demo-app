<template>
  <div class="flex items-center">
    <div class="spinner" />
    <div class="ml-2 text-lg">{{ message }}...</div>
  </div>
</template>

<style scoped>
.spinner {
  display: block;
  height: 1.125rem;
  width: 1.125rem;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.25);
  border-top-color: #058aff;
  animation: spin 0.8s infinite cubic-bezier(0.45, 0.05, 0.55, 0.95);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

<script>
export default {
  props: ["message"],
};
</script>
