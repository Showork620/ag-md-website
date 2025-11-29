<script setup lang="ts">
import { ICON_PATHS } from '~/utils/icons'

const props = defineProps<{
  name: string
  size?: string | number
}>()

const path = computed(() => ICON_PATHS[props.name] || '')


const sizeStyle = computed(() => {
  if (typeof props.size === 'number') return `${props.size}px`
  return props.size || '1em'
})
</script>

<template>
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    fill="none" 
    viewBox="0 0 24 24" 
    stroke="currentColor" 
    stroke-width="2"
    class="ca-icon"
    :style="{ width: sizeStyle, height: sizeStyle }"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" :d="path" />
  </svg>
</template>

<style scoped>
.ca-icon {
  display: inline-block;
  vertical-align: middle;
}
</style>
