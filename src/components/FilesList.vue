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
        src="@/assets/file_image.png"
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
              :key="file.did"
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
                {{ file.name }}
              </td>
              <td class="pt-6 pb-3" style="vertical-align: middle">
                {{
                  file.createdAt
                    ? moment(file.createdAt).format("DD-MM-YYYY")
                    : moment().format("DD-MM-YYYY")
                }}
              </td>
              <td class="pt-6 pb-3" style="vertical-align: middle">
                {{ bytes(file.size) }}
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
          lg:gap-12
          lg:mb-20
          mb-20
          transition-fade
        "
      >
        <div
          v-for="file in files"
          :key="file.did"
          class="w-44 h-48"
          style="border: 3px solid #e0e0e0; border-radius: 20px"
        >
          <div
            class="py-2 ml-1 mt-1 file-menu inline-block"
            @click.stop="fileMenu(file.did, $event)"
          >
            <DotsVerticalIcon class="h-5 w-5" />
          </div>
          <img src="@/assets/image_gallery.png" class="mx-auto mt-0" />
          <div class="mt-6 mx-5">
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
              {{ file.name }}
            </span>
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
              >{{ bytes(file.size) }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute top-7 right-6 lg:top-16 lg:right-16">
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
  </div>
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

.file-menu:hover {
  background-color: #4b4b4b;
  color: white;
}
</style>

<script>
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
} from "@heroicons/vue/outline";
import { ref } from "@vue/reactivity";
import bytes from "bytes";
import DropdownMenu from "./DropdownMenu.vue";
import { inject, onMounted } from "@vue/runtime-core";
import { useFileMixin } from "../mixins/file.mixin";
import moment from "moment";
export default {
  setup(props) {
    let listType = ref("table");
    let menuPosition = ref({});
    let showMenu = ref(false);
    const toast = inject("$toast");
    const fileMixin = useFileMixin(toast);
    let selectedFile;

    let menuItemsArr = [];

    if (props.pageTitle === "My Files") {
      menuItemsArr = [
        {
          label: "Verify",
          icon: PencilAltIcon,
          command: () => {
            window.open(
              "https://explorer.arcana.network/did/" + selectedFile.did,
              "__blank"
            );
          },
        },
        {
          label: "Download",
          icon: DownloadIcon,
          command: () => {
            fileMixin.download(selectedFile);
          },
        },
        {
          label: "Share",
          icon: ShareIcon,
          command: () => {},
        },
        {
          label: "Delete",
          icon: TrashIcon,
          command: () => {},
          disabled: true,
        },
      ];
    } else if (props.pageTitle === "Shared With Me") {
      menuItemsArr = [
        {
          label: "Verify",
          icon: PencilAltIcon,
          command: () => {},
        },
        {
          label: "Download",
          icon: DownloadIcon,
          command: () => {
            fileMixin.download(selectedFile);
          },
        },
      ];
    } else {
      menuItemsArr = [
        {
          label: "Recover",
          icon: RefreshIcon,
          command: () => {},
        },
        {
          label: "Delete Forever",
          icon: XCircleIcon,
          command: () => {},
        },
      ];
    }
    console.log("Menu Items Arr", menuItemsArr);
    let menuItems = ref(menuItemsArr);

    function fileMenu(file, event) {
      selectedFile = file;
      showMenu.value = true;
      const menuEl = event.path.find(
        (el) =>
          typeof el.className === "string" && el.className.includes("file-menu")
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
    }

    onMounted(() => {
      document.querySelector(".files-container").onscroll = hideMenu;
    });

    function hideMenu() {
      showMenu.value = false;
    }

    function closeDropdown() {
      showMenu.value = false;
    }

    return {
      listType,
      bytes,
      fileMenu,
      menuPosition,
      showMenu,
      closeDropdown,
      menuItems,
      moment,
    };
  },
  props: ["files", "pageTitle"],
  components: { ViewGridIcon, ViewListIcon, DotsVerticalIcon, DropdownMenu },
};
</script>