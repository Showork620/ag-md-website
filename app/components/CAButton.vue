<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'accent' | 'outline' | 'plain'
  disabled?: boolean
}

withDefaults(defineProps<Props>(), {
  variant: 'primary',
  disabled: false
})
</script>

<template>
  <button 
    :class="['base-button', `base-button--${variant}`]"
    :disabled="disabled"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem; /* Reduced vertical padding */
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.95rem; /* Slightly smaller font */
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--primary {
  background-color: var(--color-primary);
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  filter: brightness(1.1);
}

.base-button--accent {
  background-color: var(--color-accent);
  color: white;
}

.base-button--accent:hover:not(:disabled) {
  filter: brightness(0.9);
}

.base-button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.base-button--outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: white;
}

.base-button--plain {
  background-color: transparent;
  color: var(--color-text-primary);
  border: 1px solid var(--color-border); /* Add border */
  /* Padding is inherited from base-button, so no need to override with smaller padding */
}

.base-button--plain:hover:not(:disabled) {
  background-color: var(--color-bg-elevated);
  border-color: var(--color-text-primary); /* Darken border on hover */
}
</style>
