<script setup lang="ts">
import CAIcon from './CAIcon.vue'

const props = defineProps<{
  icon: string
  label?: string
  iconPosition?: 'left' | 'right'
  gap?: string
  size?: string | number
}>()

// Calculate font size based on icon size
const fontSize = computed(() => {
  if (!props.size) return undefined
  
  // If size is a number, treat as pixels
  if (typeof props.size === 'number') {
    return `${props.size}px`
  }
  
  // If size is already a string (e.g., '24px', '1.5em'), use it directly
  return props.size
})

const iconSize = computed(() => {
  return props.size || '1em'
})
</script>

<template>
  <span class="ca-icon-label" :class="`icon-${iconPosition || 'left'}`" :style="{ fontSize, gap: gap || '0.5em' }">
    <CAIcon v-if="icon" :name="icon" :size="iconSize" class="icon" />
    <span v-if="label" class="label">
      {{ label }}
    </span>
  </span>
</template>

<style scoped>
.ca-icon-label {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  gap: 0.5em; /* default gap, can be overridden by inline style */
}

.icon-right {
  flex-direction: row-reverse;
}
</style>
