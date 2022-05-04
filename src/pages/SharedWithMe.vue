<script lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import FilesList from '../components/FilesList.vue'
import UserProfile from '../components/UserProfile.vue'
import useArcanaStorage from '../use/arcanaStorage'

export default {
  name: 'SharedWithMe',
  components: { UserProfile, FilesList },
  setup() {
    const store = useStore()
    const { fetchStorageLimits, fetchSharedFiles } = useArcanaStorage()

    const files = computed(() => store.getters.sharedWithMe)

    onMounted(async () => {
      document.title = 'Shared With Me | Arcana Demo'
      await fetchStorageLimits()
      await fetchSharedFiles()
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
      <files-list :files="files" page-title="Shared With Me" />
    </div>
  </div>
</template>
