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
    <div class="mt-6 lg:ml-4 mr-16">
      <table
        v-if="listType === 'table'"
        class="transition-fade lg:mb-20 mb-28"
        style="width: 100%"
      >
        <thead style="color: #b9b8b8">
          <tr>
            <th class="uppercase" style="max-width: 50%; text-align: left">
              Name
            </th>
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
              class="overflow-ellipsis overflow-hidden whitespace-nowrap"
              style="
                max-width: 260px;
                min-width: 120px;
                width: 65%;
                padding-right: 20px;
                vertical-align: middle;
              "
            >
              {{ file.name }}
            </td>
            <td class="pt-6 pb-3" style="vertical-align: middle">XX-XX-XXXX</td>
            <td class="pt-6 pb-3" style="vertical-align: middle">
              {{ bytes(file.size) }}
            </td>
            <td>
              <div class="py-2 file-menu">
                <DotsVerticalIcon class="h-5 w-5" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        v-else-if="listType === 'grid'"
        class="
          flex flex-row flex-wrap
          gap-4
          lg:gap-12
          lg:mb-20
          mb-28
          transition-fade
        "
      >
        <div
          v-for="file in files"
          :key="file.did"
          class="w-44 h-48"
          style="border: 3px solid #e0e0e0; border-radius: 20px"
        >
          <div class="py-2 ml-1 mt-1 file-menu inline-block">
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
} from "@heroicons/vue/outline";
import { ref } from "@vue/reactivity";
import bytes from "bytes";
import Menu from "primevue/menu";
export default {
  setup() {
    let listType = ref("table");
    return {
      listType,
      bytes,
    };
  },
  props: ["files", "pageTitle"],
  components: { ViewGridIcon, ViewListIcon, DotsVerticalIcon, Menu },
};
</script>