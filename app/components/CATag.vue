<script setup lang="ts">
interface Props {
  color?: 'green' | 'orange' | 'neutral'
}

withDefaults(defineProps<Props>(), {
  color: 'neutral'
})
</script>

<template>
  <span :class="['base-tag', `base-tag--${color}`]">
    <slot />
  </span>
</template>

<style scoped>
.base-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.base-tag--green {
  background-color: rgba(61, 122, 95, 0.15);
  color: var(--color-primary);
  border: 1px solid var(--color-primary);
}

.base-tag--orange {
  background-color: rgba(230, 126, 34, 0.15);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}

.base-tag--neutral {
  background-color: var(--color-bg-elevated);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}
</style>
