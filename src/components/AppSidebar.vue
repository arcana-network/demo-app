<template>
  <div class="header h-10 cursor-pointer lg:hidden" @click.stop="openMenu">
    <MenuIcon class="h-7 w-7 inline-block mr-2 text-white" />
    <img
      src="@/assets/rocket-science.png"
      class="inline-block -mt-2"
      width="280"
    />
  </div>
  <full-screen-overlay v-if="menu" />
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
    <div class="hero-image -ml-2 mt-8">
      <img
        src="@/assets/rocket-science.png"
        width="280"
        class="mt-4 lg:mt-8 inline"
      />
    </div>
    <div class="menu mt-24" style="font-size: 1rem">
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
    <div
      class="absolute bottom-10 mx-auto footer flex flex-col items-center justify-end"
    >
      <div class="mt-8" v-if="isLoadingInline">
        <inline-loader class="justify-center" :message="inlineLoadingMessage" />
      </div>
      <div v-if="hasApprovedStorageLimitsRequest">
        <div class="mt-8 font-ubuntu font-bold" style="font-size: 1.5em">
          Storage Status
        </div>
        <div class="my-2">
          <div class="progress-container mx-auto">
            <div
              class="progress-success-container"
              :style="{ width: storage.percentage + '%' }"
            ></div>
          </div>
        </div>
        <div class="my-2 font-ubuntu" style="font-weight: 300">
          <span style="font-weight: 800">{{
            readableBytes(storage.storageUsed)
          }}</span>
          of
          <span style="font-weight: 800">{{
            readableBytes(storage.totalStorage)
          }}</span>
        </div>
      </div>
      <div v-if="hasApprovedBandwidthLimitsRequest">
        <div class="mt-8 font-ubuntu font-bold" style="font-size: 1.5em">
          Bandwidth Status
        </div>
        <div class="my-2">
          <div class="progress-container mx-auto">
            <div
              class="progress-success-container"
              :style="{ width: bandwidth.percentage + '%' }"
            ></div>
          </div>
        </div>
        <div class="my-2 font-ubuntu" style="font-weight: 300">
          <span style="font-weight: 800">{{
            readableBytes(bandwidth.bandwidthUsed)
          }}</span>
          of
          <span style="font-weight: 800">{{
            readableBytes(bandwidth.totalBandwidth)
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
    transition: transform 0.5s;
    transform: translateX(-340px);
    z-index: 10001;
  }
  .sidebar-active {
    transform: translateX(0);
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
  width: 220px;
  height: 6px;
  border-radius: 30px;
  overflow: hidden;
}

.progress-success-container {
  background-color: #26de43;
  width: 0;
  height: 6px;
  border-radius: 30px;
  transition: width 1s;
}

.liquid-translate-my-files {
  top: 227px;
}

.liquid-translate-shared-with-me {
  top: 287px;
}

.liquid-translate-bin {
  top: 318px;
}
</style>

<script>
import { useRoute } from "vue-router";
import { watch, ref, onMounted, computed } from "@vue/runtime-core";
import { useStore } from "vuex";

import {
  FolderOpenIcon,
  UsersIcon,
  MenuIcon,
  XIcon,
} from "@heroicons/vue/outline";

import bytes from "bytes";
import FullScreenOverlay from "./FullScreenOverlay.vue";
import InlineLoader from "./InlineLoader.vue";

const UNLIMITED = "Unlimited";
const TEN_TB = "10 TB";

export default {
  setup() {
    const route = useRoute();
    const store = useStore();
    const liquidMenuTranslate = ref("");
    const menu = ref(false);

    let isLoadingInline = computed(() => {
      return store.getters.isLoadingInline;
    });
    let inlineLoadingMessage = computed(() => {
      return store.getters.inlineLoadingMessage;
    });

    const hasApprovedStorageLimitsRequest = computed(
      () => store.getters.hasApprovedStorageLimitsRequest
    );
    const storage = computed(() => {
      const storageLimits = store.getters.storageLimits;
      if (storageLimits.totalStorage >= bytes(TEN_TB)) {
        storageLimits.totalStorage = UNLIMITED;
        return {
          ...storageLimits,
          percentage: storageLimits.storageUsed === 0 ? 0 : 1,
        };
      }
      const percentage =
        (storageLimits.storageUsed / storageLimits.totalStorage) * 100;
      return {
        ...storageLimits,
        percentage,
      };
    });

    const hasApprovedBandwidthLimitsRequest = computed(
      () => store.getters.hasApprovedBandwidthLimitsRequest
    );
    const bandwidth = computed(() => {
      const bandwidthLimits = store.getters.bandwidthLimits;
      if (bandwidthLimits.totalBandwidth >= bytes(TEN_TB)) {
        bandwidthLimits.totalBandwidth = UNLIMITED;
        return {
          ...bandwidthLimits,
          percentage: bandwidthLimits.bandwidthUsed === 0 ? 0 : 1,
        };
      }
      const percentage =
        (bandwidthLimits.bandwidthUsed / bandwidthLimits.totalBandwidth) * 100;
      return {
        ...bandwidthLimits,
        percentage,
      };
    });

    onMounted(() => {
      window.onresize = function () {
        menu.value = false;
      };
      document.addEventListener("click", (event) => {
        const menuContainer = event.path.find(
          (el) =>
            typeof el.className === "string" && el.className.includes("sidebar")
        );
        if (!menuContainer) {
          menu.value = false;
        }
      });
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

    function readableBytes(value) {
      if (value === UNLIMITED) {
        return UNLIMITED;
      }
      return bytes(value);
    }

    return {
      liquidMenuTranslate,
      menu,
      openMenu,
      storage,
      bandwidth,
      readableBytes,
      hasApprovedStorageLimitsRequest,
      hasApprovedBandwidthLimitsRequest,
      isLoadingInline,
      inlineLoadingMessage,
    };
  },
  components: {
    FolderOpenIcon,
    UsersIcon,
    MenuIcon,
    XIcon,
    FullScreenOverlay,
    InlineLoader,
  },
};
</script>
