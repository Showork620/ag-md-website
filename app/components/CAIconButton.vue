<script setup lang="ts">
import CAIcon from './CAIcon.vue'

defineProps<{
  icon: string
  variant?: 'primary' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'large'
  title?: string
  disabled?: boolean
}>()

defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()
</script>

<template>
  <button 
    class="icon-button" 
    :class="[
      `variant-${variant || 'ghost'}`,
      `size-${size || 'medium'}`,
      { 'is-disabled': disabled }
    ]"
    :title="title"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <CAIcon :name="icon" />
  </button>
</template>

<style scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.2s;
  flex-shrink: 0;
}

.icon-button:disabled,
.icon-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Size variants */
.size-small {
  width: 32px;
  height: 32px;
  font-size: 1rem;
}

.size-medium {
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
}

.size-large {
  width: 48px;
  height: 48px;
  font-size: 1.5rem;
}

/* Variant styles */
.variant-ghost {
  color: var(--color-text-secondary);
}

.variant-ghost:hover:not(:disabled) {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
}

.variant-primary {
  color: var(--color-primary);
}

.variant-primary:hover:not(:disabled) {
  background-color: rgba(99, 102, 241, 0.1);
  color: var(--color-accent);
}

.variant-danger {
  color: #ff4d4f;
}

.variant-danger:hover:not(:disabled) {
  background-color: rgba(255, 77, 79, 0.1);
  color: #ff1a1a;
}

/* Touch device support - always show on touch devices */
@media (hover: none) {
  .icon-button {
    opacity: 1 !important;
  }
}
</style>
