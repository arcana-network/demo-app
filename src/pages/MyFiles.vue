<script lang="ts">
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

import FilesList from '../components/FilesList.vue'
import UploadFab from '../components/UploadFab.vue'
import UserProfile from '../components/UserProfile.vue'
import useArcanaStorage from '../use/arcanaStorage'

export default {
  name: 'MyFiles',
  components: { UploadFab, UserProfile, FilesList },
  setup() {
    const store = useStore()
    const { fetchStorageLimits, fetchMyFiles } = useArcanaStorage()

    const files = computed(() => store.getters.myFiles)

    onMounted(async () => {
      document.title = 'My Files | Arcana Demo'
      await fetchStorageLimits()
      await fetchMyFiles()
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
      <upload-fab />
      <files-list :files="files" page-title="My Files" />
    </div>
  </div>
</template>
