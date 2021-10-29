<template>
  <div class="mt-6 ml-6 lg:ml-16">
    <div
      class="inline-block px-6 py-1 font-bold"
      style="
        background: #eef1f6;
        font-size: 0.9rem;
        border-radius: 20px;
        color: #4b4b4b;
      "
    >
      {{ pageTitle }}
    </div>
    <div v-if="!files.length">
      <div
        class="absolute inline-block top-1/2 left-1/2 font-bold text-center"
        style="
          transform: translate(-50%, -50%);
          color: #bcb8b8;
          font-size: 1.15rem;
        "
      >
        <img
          class="inline-block mb-2"
          src="@/assets/file_image.png"
          style="
            min-width: 160px;
            max-width: 300px;
            width: 22%;
            filter: invert(5%);
          "
        />
        <br />
        <span v-if="pageTitle === 'My Files'">Upload a file to begin</span>
        <span v-else-if="pageTitle === 'Shared With Me'"
          >No files shared with you</span
        >
        <span v-else>No files added to Bin</span>
      </div>
    </div>
    <div v-else class="mt-6 lg:ml-4 mr-6 lg:mr-16">
      <DropdownMenu
        :position="menuPosition"
        :show="showMenu"
        :items="menuItems"
        @close="closeDropdown"
      >
      </DropdownMenu>
      <div
        v-if="listType === 'table'"
        class="overflow-x-auto transition-fade lg:mb-20 mb-20"
        style="min-width: 200px"
      >
        <table style="width: 100%" class="font-bold">
          <thead style="color: #b9b8b8">
            <tr>
              <th class="uppercase" style="text-align: left">Name</th>
              <th class="uppercase" style="text-align: left; width: auto">
                Last Modified
              </th>
              <th class="uppercase mb-6" style="text-align: left">Size</th>
              <th class="uppercase mb-6" style="width: 20px"></th>
            </tr>
          </thead>
          <tbody style="color: #707070">
            <tr
              v-for="file in files"
              :key="file.fileId"
              style="border-bottom: 2px solid #a1cdf8"
            >
              <td
                class="
                  overflow-ellipsis overflow-hidden
                  whitespace-nowrap
                  pt-6
                  pb-3
                "
                style="
                  max-width: 260px;
                  min-width: 40px;
                  padding-right: 20px;
                  vertical-align: middle;
                "
              >
                {{ file.fileId }}
              </td>
              <td class="pt-6 pb-3" style="vertical-align: middle">
                {{ getReadableDate(file.createdAt) }}
              </td>
              <td class="pt-6 pb-3" style="vertical-align: middle">
                {{ getReadableSize(file.size) }}
              </td>
              <td>
                <div
                  class="mt-2 py-2 file-menu"
                  @click.stop="fileMenu(file, $event)"
                >
                  <DotsVerticalIcon class="h-5 w-5" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        v-else-if="listType === 'grid'"
        class="
          flex flex-row flex-wrap
          gap-4
          lg:gap-12 lg:mb-20
          mb-20
          transition-fade
        "
      >
        <div
          v-for="file in files"
          :key="file.fileId"
          class="w-44 h-48"
          style="border: 3px solid #e0e0e0; border-radius: 20px"
        >
          <div
            class="py-2 ml-1 mt-1 file-menu inline-block"
            @click.stop="fileMenu(file.fileId, $event)"
          >
            <DotsVerticalIcon class="h-5 w-5" />
          </div>
          <img src="@/assets/image_gallery.png" class="mx-auto mt-0" />
          <div class="mt-6 mx-5">
            <n-tooltip trigger="hover">
              <template #trigger>
                <span
                  class="
                    inline-block
                    overflow-ellipsis overflow-hidden
                    whitespace-nowrap
                    font-ubuntu font-medium
                  "
                  style="
                    width: 56%;
                    vertical-align: middle;
                    font-size: 0.85rem;
                    color: #4b4b4b;
                    text-align: center;
                  "
                >
                  {{ file.fileId }}
                </span>
              </template>
              {{ file.fileId }}
            </n-tooltip>
            <span
              class="font-ubuntu"
              style="color: #4b4b4b88; font-size: 0.9rem"
              >|</span
            >
            <span
              class="inline-block font-light font-ubuntu"
              style="
                width: 38%;
                vertical-align: middle;
                text-align: center;
                font-size: 0.75rem;
              "
            >
              {{ getReadableSize(file.size) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div class="absolute top-7 right-6 lg:top-16 lg:right-16">
    <div class="inline-block mr-5">
      <div
        class="inline-block rounded-full p-1 cursor-pointer"
        style="background: #c6c9c9"
      >
        <SearchIcon class="h-6 w-6 inline-block text-white" />
      </div>
    </div>
    <div
      class="inline-block cursor-pointer list-type mt-1 lg"
      :class="listType === 'grid' ? 'list-active' : ''"
      style="
        border-right: 1px solid #c6c9c9;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        padding: 2px;
      "
      @click.stop="() => (listType = 'grid')"
    >
      <ViewGridIcon class="h-6 w-6 inline-block" />
    </div>
    <div
      class="inline-block cursor-pointer list-type mt-1 lg:mt-2"
      :class="listType === 'table' ? 'list-active' : ''"
      style="
        border-left: 1px solid #c6c9c9;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
        padding: 2px;
      "
      @click.stop="() => (listType = 'table')"
    >
      <ViewListIcon class="h-6 w-6 inline-block" />
    </div>
  </div> -->
  <dialog-box v-if="shareDialog" @close="closeDialog">
    <h3 class="font-ubuntu font-bold" style="color: #253d52; font-size: 1.5em">
      Share file
    </h3>
    <label
      class="block mt-4 mb-2 font-semibold"
      for="recipient-email"
      style="color: #707070; font-size: 1.2em"
    >
      Recipient Email
    </label>
    <input
      type="email"
      id="recipient-email"
      v-model="shareEmail"
      class="focus:outline-none rounded-full px-4 py-2 w-full"
    />
    <div class="text-center mt-5 mb-3">
      <button
        class="focus:outline-none py-2 px-5 rounded-full font-bold shadow-2xl"
        :class="!shareEmailInvalid ? 'cursor-pointer' : 'cursor-not-allowed'"
        :style="{
          background: !shareEmailInvalid ? '#058aff' : '#a1cdf8',
          color: 'white',
        }"
        :disabled="shareEmailInvalid"
        @click.stop="shareFile"
      >
        Share
      </button>
    </div>
  </dialog-box>
</template>

<style scoped>
.list-type {
  color: #c6c9c9;
  border: 2px solid #c6c9c9;
}

.list-type:hover {
  background-color: #c6c9c966;
}

.list-active {
  background-color: #c6c9c9;
  color: white;
}

.list-active:hover {
  background-color: #c6c9c9;
}

.file-menu {
  color: #4b4b4b;
  cursor: pointer;
  border-radius: 20px;
}

#recipient-email {
  border: 2px solid #a1cdf8;
}

#recipient-email:focus {
  border: 2px solid #058aff;
}

.file-menu:hover {
  background-color: #4b4b4b;
  color: white;
}
</style>

<script>
import { ref } from "@vue/reactivity";
import { inject, onMounted, watch } from "@vue/runtime-core";

import {
  ViewGridIcon,
  ViewListIcon,
  DotsVerticalIcon,
  PencilAltIcon,
  ShareIcon,
  DownloadIcon,
  TrashIcon,
  XCircleIcon,
  RefreshIcon,
  SearchIcon,
} from "@heroicons/vue/outline";
import { NTooltip } from "naive-ui";
import DropdownMenu from "./DropdownMenu.vue";
import DialogBox from "./DialogBox.vue";
import isValidEmail from "pragmatic-email-regex";

import bytes from "bytes";
import moment from "moment";
import { useFileMixin } from "../mixins/file.mixin";

export default {
  setup(props) {
    let listType = ref("table");
    let menuPosition = ref({});
    let showMenu = ref(false);
    let shareDialog = ref(false);
    let shareEmail = ref("");
    let shareEmailInvalid = ref(false);
    const toast = inject("$toast");
    const fileMixin = useFileMixin(toast);
    let selectedFile;

    let menuItem = {};
    menuItem.verify = {
      label: "Verify",
      icon: PencilAltIcon,
      command: () => {
        window.open(
          "https://explorer.arcana.network/did/" + selectedFile.did,
          "__blank"
        );
      },
    };

    menuItem.download = {
      label: "Download",
      icon: DownloadIcon,
      command: () => {
        fileMixin.download(selectedFile);
      },
    };

    menuItem.share = {
      label: "Share",
      icon: ShareIcon,
      command: () => {
        shareDialog.value = true;
      },
    };

    menuItem.remove = {
      label: "Delete",
      icon: TrashIcon,
      command: () => {
        fileMixin.remove(selectedFile);
      },
    };

    menuItem.revoke = {
      label: "Revoke",
      icon: PencilAltIcon,
      command: () => {
        console.log("Revoke");
      },
    };

    menuItem.recover = {
      label: "Recover",
      icon: RefreshIcon,
      command: () => {},
    };

    menuItem.delete = {
      label: "Delete Forever",
      icon: XCircleIcon,
      command: () => {},
    };

    let menuItemsArr = [];
    if (props.pageTitle === "My Files") {
      menuItemsArr = [menuItem.download, menuItem.share, menuItem.remove];
    } else if (props.pageTitle === "Shared With Me") {
      menuItemsArr = [menuItem.download];
    } else {
      menuItemsArr = [menuItem.recover, menuItem.delete];
    }
    let menuItems = ref(menuItemsArr);

    function fileMenu(file, event) {
      selectedFile = file;
      showMenu.value = false;
      setTimeout(() => {
        showMenu.value = true;
        const menuEl = event.path.find(
          (el) =>
            typeof el.className === "string" &&
            el.className.includes("file-menu")
        );
        if (menuEl) {
          const rect = menuEl.getBoundingClientRect();
          menuPosition.value = {
            x: rect.left,
            y: rect.top,
            el: {
              w: rect.width,
              h: rect.height,
            },
          };
        }
      }, 100);
    }

    function hideMenu() {
      showMenu.value = false;
    }

    function closeDropdown() {
      showMenu.value = false;
    }

    function getReadableDate(date) {
      if (date) {
        return moment(date).format("DD-MM-YYYY");
      }
      return moment().format("DD-MM-YYYY");
    }

    function getReadableSize(size) {
      return bytes(size);
    }

    function closeDialog() {
      shareEmail.value = "";
      shareEmailInvalid.value = false;
      shareDialog.value = false;
    }

    function shareFile() {
      fileMixin.share(selectedFile, shareEmail.value);
      closeDialog();
    }

    onMounted(() => {
      document.querySelector(".files-container").onscroll = hideMenu;
    });

    watch(
      () => shareEmail.value,
      () => {
        if (isValidEmail(shareEmail.value)) {
          shareEmailInvalid.value = false;
        } else {
          shareEmailInvalid.value = true;
        }
      }
    );

    return {
      listType,
      bytes,
      menuPosition,
      showMenu,
      menuItems,
      shareDialog,
      shareEmail,
      shareEmailInvalid,
      fileMenu,
      closeDropdown,
      getReadableDate,
      getReadableSize,
      shareFile,
      closeDialog,
    };
  },
  props: ["files", "pageTitle"],
  components: {
    ViewGridIcon,
    ViewListIcon,
    DotsVerticalIcon,
    SearchIcon,
    DropdownMenu,
    NTooltip,
    DialogBox,
  },
};
</script>