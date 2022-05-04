<script lang="ts">
import { onMounted, computed } from '@vue/runtime-core'
import { useStore } from 'vuex'

import FilesList from '../components/FilesList.vue'
import UserProfile from '../components/UserProfile.vue'

export default {
  name: '',
  components: { UserProfile, FilesList },
  setup() {
    const store = useStore()
    let files = computed(() => {
      return store.getters.trash
    })
    onMounted(() => {
      document.title = 'Bin | Arcana Demo'
    })

    return {
      files,
    }
  },
}
</script>

<template>
  <div
    class="bg-white files-container fixed right-3 top-20 lg:top-4 overflow-y-auto"
  >
    <div id="my-files-container" class="transition-fade">
      <user-profile />
      <files-list :files="files" page-title="Bin" />
    </div>
  </div>
</template>
