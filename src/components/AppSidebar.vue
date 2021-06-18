<template>
  <div class="header h-10 lg:hidden">
    <!-- <MenuIcon class="h-7 w-7 inline-block mr-2 text-white" /> -->
    <img
      src="@/assets/horizontal-dark.svg"
      class="inline-block cursor-pointer"
      style="height: 32px"
      @click.stop="openMenu"
    />
  </div>
  <div v-if="menu" class="fixed top-0 left-0 h-screen w-full overlay"></div>
  <div
    class="sidebar overflow-x-hidden fixed top-0 bottom-0 left-0"
    :class="menu ? 'sidebar-active' : ''"
  >
    <div
      class="lg:hidden absolute inline-block rounded-full cursor-pointer"
      style="left: 300px; top: 10px"
      @click.stop="menu = false"
    >
      <XIcon class="text-white h-7 w-7" />
    </div>
    <div class="hero-image -ml-4">
      <img
        src="@/assets/vertical-dark.svg"
        width="120"
        class="mt-4 lg:mt-8 inline"
      />
    </div>
    <div class="menu mt-16" style="font-size: 1rem">
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
    <div
      class="absolute menu-liquid-interaction hidden lg:block"
      :class="liquidMenuTranslate"
    >
      <div
        class="relative rounded-full h-9 w-9 bg-white px-3 py-3"
        style="z-index: 2"
      >
        <div
          class="rounded-full h-3 w-3"
          style="background-color: #058aff"
        ></div>
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
          <div
            class="progress-success-container"
            :style="{ width: storage.percentage }"
          ></div>
        </div>
      </div>
      <div class="my-1 font-ubuntu font-bold">
        {{ bytes(storage.storageUsed) }} of {{ bytes(storage.totalStorage) }}
      </div>
      <div class="mt-10">
        <button
          class="
            font-ubuntu font-bold
            buy-more-storage
            focus:outline-none
            cursor-not-allowed
          "
        >
          Buy more storage
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  background-color: black;
  opacity: 0.75;
  z-index: 10000;
  filter: blur(4px);
}
.sidebar,
.sidebar-active {
  width: 350px;
  background-color: #2c2525;
}

.menu {
  width: 100%;
}

.menu a {
  color: white;
  width: 240px;
  padding: 10px 25px;
  border-radius: 30px;
  transition: background-color 0.7s;
}

@media screen and (max-width: 1024px) {
  .sidebar {
    width: 0px;
    transition: width 1s, z-index 1s;
    z-index: 10001;
  }
  .sidebar-active {
    width: 340px;
  }

  .menu a {
    color: white;
    width: 240px;
    padding: 10px 25px;
    border-radius: 30px;
    transition: none;
  }
}

.hero-image {
  width: 100%;
  text-align: center;
}

.router-link-active {
  background-color: #058aff;
}

.menu-liquid-interaction {
  left: 300px;
  top: 218px;
  transition: top 0.6s;
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
  overflow: hidden;
}

.progress-success-container {
  background-color: #26de43;
  width: 0px;
  height: 6px;
  border-radius: 30px;
}

.liquid-translate-my-files {
  top: 200px;
}

.liquid-translate-shared-with-me {
  top: 257px;
}

.liquid-translate-bin {
  top: 318px;
}
</style>

<script>
import {
  FolderOpenIcon,
  UsersIcon,
  TrashIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/vue/outline";
import { useRoute } from "vue-router";
import { watch, ref, onMounted, computed } from "@vue/runtime-core";
import bytes from "bytes";
import { useStore } from "vuex";
export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    let liquidMenuTranslate = ref("");
    let menu = ref(false);
    let storage = computed(() => {
      const storageState = store.getters.storage;
      const percentage =
        (storageState.storageUsed / storageState.totalStorage) * 100;
      return {
        ...storageState,
        percentage,
      };
    });

    onMounted(() => {
      window.onresize = function () {
        menu.value = false;
      };
      document.onclick = function (event) {
        console.log(event);
        const menuContainer = event.path.find(
          (el) =>
            typeof el.className === "string" && el.className.includes("sidebar")
        );
        if (!menuContainer) {
          menu.value = false;
        }
      };
    });

    liquidMenuTransition();
    watch(route, () => {
      liquidMenuTransition();
    });

    function openMenu() {
      menu.value = true;
    }

    function liquidMenuTransition() {
      menu.value = false;
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
      menu,
      openMenu,
      storage,
      bytes,
    };
  },
  components: { FolderOpenIcon, UsersIcon, TrashIcon, MenuIcon, XIcon },
};
</script>