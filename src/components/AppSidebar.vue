<template>
  <div class="sidebar">
    <div class="hero-image">
      <img src="@/assets/vertical-dark.svg" width="120" class="mt-8 inline" />
    </div>
    <div class="menu mt-16">
      <router-link to="/my-files" class="inline-block mx-10 my-2 font-bold">
        <FolderOpenIcon class="h-6 w-6 inline -mt-1 mr-2" />
        My Files
      </router-link>
      <br />
      <router-link
        to="/shared-with-me"
        class="inline-block mx-10 my-2 font-bold"
      >
        <UsersIcon class="h-6 w-6 inline -mt-1 mr-2" />
        Shared With Me
      </router-link>
      <br />
      <router-link to="/bin" class="inline-block mx-10 my-2 font-bold">
        <TrashIcon class="h-6 w-6 inline -mt-1 mr-2" />
        Bin
      </router-link>
    </div>
    <div class="absolute menu-liquid-interaction" :class="liquidMenuTranslate">
      <div
        class="relative rounded-full h-9 w-9 bg-white px-3 py-3"
        style="z-index: 100"
      >
        <div class="rounded-full h-3 w-3 bg-blue-700"></div>
      </div>
      <div
        class="absolute menu-liquid-inset-curve h-12 w-12 bg-white"
        style="z-index: 0"
      >
        <div
          class="absolute h-9 w-9"
          style="
            top: -26px;
            left: -6px;
            border-bottom-right-radius: 20px;
            border-bottom-left-radius: 18px;
            z-index: -1;
            background-color: #2c2525;
          "
        ></div>
        <div
          class="absolute h-9 w-9"
          style="
            top: 38px;
            left: -6px;
            border-top-right-radius: 20px;
            border-top-left-radius: 18px;
            z-index: -1;
            background-color: #2c2525;
          "
        ></div>
      </div>
    </div>
    <div class="absolute bottom-4 mx-auto footer">
      <div class="mt-10 font-ubuntu font-bold">Storage Status</div>
      <div class="my-1">
        <div class="progress-container mx-auto">
          <div class="progress-success-container"></div>
        </div>
      </div>
      <div class="my-1 font-ubuntu font-bold">9GB of 25GB</div>
      <div class="mt-10">
        <button class="font-ubuntu font-bold buy-more-storage">
          Buy more storage
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 300px;
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
  width: 240px;
  padding: 10px 25px;
  border-radius: 30px;
  transition: background-color 1s;
}

.router-link-active {
  background-color: #058aff;
}

.menu-liquid-interaction {
  left: 300px;
  top: 218px;
  transition: top 1s;
}

.menu-liquid-inset-curve {
  top: -6px;
  left: 20px;
  z-index: 1;
}

.footer {
  width: 340px;
  height: 220px;
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

.liquid-translate-my-files {
  top: 218px;
}

.liquid-translate-shared-with-me {
  top: 278px;
}

.liquid-translate-bin {
  top: 338px;
}
</style>

<script>
import { FolderOpenIcon, UsersIcon, TrashIcon } from "@heroicons/vue/outline";
import { useRoute } from "vue-router";
import { watch, ref } from "@vue/runtime-core";
export default {
  setup() {
    const route = useRoute();
    let liquidMenuTranslate = ref("");
    liquidMenuTransition();
    watch(route, () => {
      liquidMenuTransition();
    });

    function liquidMenuTransition() {
      if (route.name === "My Files") {
        liquidMenuTranslate.value = "liquid-translate-my-files";
      } else if (route.name === "Shared With Me") {
        liquidMenuTranslate.value = "liquid-translate-shared-with-me";
      } else {
        liquidMenuTranslate.value = "liquid-translate-bin";
      }
    }

    return {
      liquidMenuTranslate,
    };
  },
  components: { FolderOpenIcon, UsersIcon, TrashIcon },
};
</script>