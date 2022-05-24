<template>
  <div>
    <div class="flex flex-row mt-6 ml-6 lg:mt-16 lg:ml-16 items-center">
      <div
        class="rounded-full flex h-14 cursor-pointer relative items-center"
        style="
          background: #eef1f6;
          transition: width 0.4s;
          width: 6em;
          transition: border 0.4s;
        "
        :style="
          isProfileMenuOpen
            ? 'border: 2px solid #a1cdf8'
            : 'border: 2px solid #eef1f6'
        "
        @click.stop="toggleProfileMenu"
      >
        <img
          :src="userInfo.picture || UserProfileIcon"
          class="rounded-full h-11 w-11 inline p-1"
        />
        <img
          :src="ArrowDownIcon"
          class="h-4 w-4 right-2.5 absolute inline"
          style="transition: transform 0.4s, margin 0.4s"
          :style="
            isProfileMenuOpen
              ? 'transform: rotate(-180deg); margin-top: -4px'
              : 'transform: rotate(0)'
          "
        />
      </div>
      <span
        class="ml-4 font-ubuntu font-bold"
        style="color: #253d52; font-size: 1.3rem"
      >
        Hello, {{ userInfo.name || "there" }}!
      </span>
    </div>
    <div
      class="profile-options text-center ml-10 lg:ml-20 mt-2 z-50 overflow-hidden"
      :class="isProfileMenuOpen ? 'profile-options-active' : ''"
      id="profile-options-container"
    >
      <div
        class="overflow-ellipsis w-full overflow-hidden whitespace-nowrap py-4 px-5"
      >
        <span class="font-medium">Email : </span>
        <span class="font-bold" style="color: #058aff">
          {{ userInfo.email }}
        </span>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="w-full overflow-ellipsis overflow-hidden whitespace-nowrap py-4 px-5"
      >
        <span class="font-medium"> Wallet Address : </span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <a
              class="font-medium overflow-ellipsis overflow-hidden whitespace-nowrap inline-block w-24"
              style="color: #058aff; vertical-align: middle"
              :href="
                'https://explorer.arcana.network/address/' + walletInfo.address
              "
              target="__blank"
            >
              {{ walletInfo.address }}
            </a>
          </template>
          {{ walletInfo.address }}
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <ClipboardCopyIcon
              class="h-5 w-5 inline -mt-1 ml-2 cursor-pointer"
              @click.stop="copy(walletInfo.address)"
              title="Click to copy"
            />
          </template>
          Copy Address
        </n-tooltip>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="overflow-ellipsis w-full overflow-hidden whitespace-nowrap py-4 cursor-pointer px-5"
        @click.stop="handleLogout"
      >
        <span class="font-medium">Logout</span>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="overflow-ellipsis w-full overflow-hidden whitespace-nowrap py-2 px-5"
      >
        <a
          href="https://arcana.network"
          target="__blank"
          style="color: #058aff"
        >
          Powered by Arcana.Network
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-options {
  border-radius: 30px;
  border-top-left-radius: 0;
  border: 3px solid #e0e0e0;
  width: 272px;
  font-size: 0.8rem;
  height: 0;
  opacity: 0;
  transition: height 0.6s, opacity 0.6s;
  position: absolute;
  background-color: white;
}
.profile-options.profile-options-active {
  height: 215px !important;
  opacity: 1 !important;
}
</style>

<script>
import { ClipboardCopyIcon } from "@heroicons/vue/outline";
import { ref, onMounted, computed } from "vue";
import { NTooltip } from "naive-ui";
import { useStore } from "vuex";

import copyToClipboard from "../utils/copyToClipboard";
import useArcanaWallet from "../use/arcanaWallet";
import useToast from "../use/toast";

import ArrowDownIcon from "../assets/triangle-down.svg";
import UserProfileIcon from "../assets/user-profile.svg";

export default {
  setup() {
    const store = useStore();
    const { toastSuccess, toastError } = useToast();

    const { logout } = useArcanaWallet();

    const userInfo = computed(() => store.getters.userInfo);
    const walletInfo = computed(() => store.getters.walletInfo);
    const isProfileMenuOpen = ref(false);

    onMounted(() => {
      document.addEventListener("click", handleMenuCollapse);
    });

    function handleMenuCollapse(event) {
      const profileContainer = event.path.find(
        (el) => el.id === "profile-options-container"
      );
      if (!profileContainer) {
        isProfileMenuOpen.value = false;
      }
    }

    function toggleProfileMenu() {
      isProfileMenuOpen.value = !isProfileMenuOpen.value;
    }

    async function handleLogout() {
      await logout();
    }

    function copy(value) {
      copyToClipboard(value)
        .then(() => {
          toastSuccess("Copied to clipboard");
        })
        .catch(() => {
          toastError("Failed to copy");
        });
    }

    return {
      userInfo,
      walletInfo,
      isProfileMenuOpen,
      toggleProfileMenu,
      handleLogout,
      copy,
      ArrowDownIcon,
      UserProfileIcon,
    };
  },
  components: { ClipboardCopyIcon, NTooltip },
};
</script>
