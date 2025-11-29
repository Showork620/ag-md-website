<script setup lang="ts">
interface Props {
  variant?: 'default' | 'compact' | 'full-bleed'
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  maxWidth: '1400px'
})
</script>

<template>
  <div 
    class="container" 
    :class="`container--${variant}`"
    :style="{ maxWidth }"
  >
    <slot />
  </div>
</template>

<style scoped>
.container {
  max-width: 1400px;
}

/* Default variant - 標準の余白 */
.container--default {
  padding-inline: 1.5rem;
}

@media (max-width: 768px) {
  .container--default {
    padding-inline: 1rem;
  }
}

/* Compact variant - モバイルで余白最小 */
.container--compact {
  padding-inline: 1.5rem;
}

@media (max-width: 768px) {
  .container--compact {
    padding-inline: 0.5rem;
  }
}

/* Full-bleed variant - モバイルで余白なし */
.container--full-bleed {
  padding-inline: 1.5rem;
}

@media (max-width: 768px) {
  .container--full-bleed {
    padding-inline: 0;
  }
}
</style>
