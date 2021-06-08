<template>
  <div class="sidebar">
    <div class="hero-image">
      <img src="@/assets/vertical-dark.svg" width="120" class="mt-8 inline" />
    </div>
    <div class="menu mt-16">
      <router-link to="/my-files" class="inline-block mx-8 my-3 font-bold">
        <FolderOpenIcon class="h-6 w-6 inline -mt-2 mr-2" />
        My Files
      </router-link>
      <br />
      <router-link
        to="/shared-with-me"
        class="inline-block mx-8 my-3 font-bold"
      >
        <UsersIcon class="h-6 w-6 inline -mt-2 mr-2" />
        Shared With Me
      </router-link>
      <br />
      <router-link to="/bin" class="inline-block mx-8 my-3 font-bold">
        <TrashIcon class="h-6 w-6 inline -mt-2 mr-2" />
        Bin
      </router-link>
    </div>
    <div class="absolute bottom-4 ml-1 footer">
      <div class="mt-10 font-ubuntu font-bold">Storage Status</div>
      <div class="my-1">
        <div class="progress-container mx-auto">
          <div class="progress-success-container"></div>
        </div>
      </div>
      <div class="my-1 font-ubuntu font-bold">9GB of 25GB</div>
      <div class="mt-6">
        <button class="font-ubuntu font-bold buy-more-storage">
          Buy more storage
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 280px;
}

.hero-image {
  width: 100%;
  text-align: center;
}

.menu {
  width: 100%;
}

.menu a {
  color: white;
  width: 220px;
  padding: 10px 25px;
}

.router-link-active {
  background-color: #058aff;
  border-radius: 30px;
}

.footer {
  width: 300px;
  height: 201px;
  background-image: url("/buystorage.png");
  background-size: cover;
  text-align: center;
  color: white;
  font-weight: bold;
}

.buy-more-storage {
  box-shadow: 0px 3px 20px #00020380;
  color: #2c2525;
  padding: 8px 25px;
  cursor: pointer;
  background-color: white;
  border-radius: 30px;
}

.progress-container {
  background-color: #eef1f6;
  width: 160px;
  height: 6px;
  border-radius: 30px;
}

.progress-success-container {
  background-color: #26de43;
  width: 60px;
  height: 6px;
  border-radius: 30px;
}
</style>

<script>
import { FolderOpenIcon, UsersIcon, TrashIcon } from "@heroicons/vue/outline";
export default {
  setup() {},
  components: { FolderOpenIcon, UsersIcon, TrashIcon },
};
</script>