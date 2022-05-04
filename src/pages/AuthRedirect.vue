<script lang="ts">
import { onMounted } from '@vue/runtime-core'
import { useRouter } from 'vue-router'

import useArcanaAuth from '../use/arcanaAuth'

export default {
  setup() {
    const router = useRouter()

    const { fetchUserDetails } = useArcanaAuth()

    onMounted(async () => {
      await fetchUserDetails()
      await router.push({ name: 'My Files' })
      toast('Login Success', {
        styles: {
          backgroundColor: 'green',
        },
        type: 'success',
      })
    })
  },
}
</script>

<template>
  <div class="text-white m-2">Redirecting...</div>
</template>
