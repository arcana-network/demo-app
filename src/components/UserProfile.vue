<template>
  <div>
    <div class="flex flex-row mt-6 ml-6 lg:mt-16 lg:ml-16">
      <img
        :src="profile.profileImage"
        class="rounded-full h-12 w-12 cursor-pointer"
        @click.stop="toggleProfileOptions"
      />
      <span class="mt-2 ml-4 font-ubuntu font-light" style="font-size: 1.3rem">
        Hello,
      </span>
      <span
        class="mt-2 ml-1 font-ubuntu font-bold"
        style="color: #058aff; font-size: 1.3rem"
      >
        {{ profile.givenName }}!
      </span>
    </div>
    <div
      class="
        profile-options
        text-center
        ml-10
        lg:ml-20
        mt-2
        z-50
        overflow-hidden
      "
      :class="profileOptions ? 'profile-options-active' : ''"
      id="profile-options-container"
    >
      <div
        class="
          overflow-ellipsis
          w-full
          overflow-hidden
          whitespace-nowrap
          py-4
          px-5
        "
      >
        <span class="font-medium">Email : </span>
        <span class="font-bold" style="color: #058aff">
          {{ profile.email }}
        </span>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="
          w-full
          overflow-ellipsis overflow-hidden
          whitespace-nowrap
          py-4
          px-5
        "
      >
        <span class="font-medium"> Wallet Address : </span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <a
              class="
                font-medium
                overflow-ellipsis overflow-hidden
                whitespace-nowrap
                inline-block
                w-24
              "
              style="color: #058aff; vertical-align: middle"
              :href="
                'https://explorer.arcana.network/address/' +
                profile.walletAddress
              "
              target="__blank"
            >
              {{ profile.walletAddress }}
            </a>
          </template>
          {{ profile.walletAddress }}
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <ClipboardCopyIcon
              class="h-5 w-5 inline -mt-1 ml-2 cursor-pointer"
              @click.stop="copy(profile.walletAddress)"
              title="Click to copy"
            />
          </template>
          Copy Address
        </n-tooltip>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="
          overflow-ellipsis
          w-full
          overflow-hidden
          whitespace-nowrap
          py-4
          cursor-pointer
          px-5
        "
        @click.stop="downloadKeys"
      >
        <span class="font-medium">Download Keys</span>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="
          overflow-ellipsis
          w-full
          overflow-hidden
          whitespace-nowrap
          py-4
          cursor-pointer
          px-5
        "
        @click.stop="logout"
      >
        <span class="font-medium">Logout</span>
      </div>
      <hr class="mx-3 p-0 m-0" style="border: 1px solid #e0e0e0" />
      <div
        class="
          overflow-ellipsis
          w-full
          overflow-hidden
          whitespace-nowrap
          py-2
          px-5
        "
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
  height: 248px !important;
  opacity: 1 !important;
}
</style>

<script>
import { ref } from "@vue/reactivity";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { inject, onMounted } from "@vue/runtime-core";
import { saveAs } from "file-saver";
import { ClipboardCopyIcon } from "@heroicons/vue/outline";
import copyToClipboard from "../utils/copyToClipboard";
import { NTooltip } from "naive-ui";
import * as arcanaAuth from "../utils/arcana-sdk";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    let profile = ref({});
    let profileOptions = ref(false);
    const toast = inject("$toast");
    onMounted(() => {
      profile.value = store.getters.basicProfile;
      document.addEventListener("click", handleMenuCollapse);
    });

    function handleMenuCollapse(event) {
      const profileContainer = event.path.find(
        (el) => el.id === "profile-options-container"
      );
      if (!profileContainer) {
        profileOptions.value = false;
      }
    }

    function toggleProfileOptions() {
      profileOptions.value = !profileOptions.value;
    }

    function downloadKeys() {
      const keys = store.getters.cryptoDetails;
      const blob = new Blob([JSON.stringify(keys, null, "\t")], {
        type: "text/plain;charset=utf-8",
      });
      saveAs(blob, "arcana-demo-app-keys.json");
    }

    function logout() {
      arcanaAuth.logout();
      store.dispatch("clearStore").then(() => {
        router.replace("/login");
      });
    }

    function copy(value) {
      copyToClipboard(value)
        .then(() => {
          toast("Copied to clipboard", {
            styles: {
              backgroundColor: "green",
            },
            type: "success",
          });
        })
        .catch(() => {
          toast("Failed to copy", {
            styles: {
              backgroundColor: "red",
            },
            type: "error",
          });
        });
    }

    return {
      profile,
      profileOptions,
      downloadKeys,
      toggleProfileOptions,
      logout,
      copy,
    };
  },
  components: { ClipboardCopyIcon, NTooltip },
};
</script>