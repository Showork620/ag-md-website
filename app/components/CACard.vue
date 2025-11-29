<script setup lang="ts">
interface Props {
  hoverable?: boolean
}

withDefaults(defineProps<Props>(), {
  hoverable: false
})
</script>

<template>
  <div :class="['ca-card', { 'hoverable': hoverable }]">
    <slot />
  </div>
</template>

<style scoped>
.ca-card {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.ca-card.hoverable {
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Default subtle shadow */
}

.ca-card.hoverable:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary);
}
</style>
