<script setup lang="ts">
const theme = ref<'light' | 'dark'>('light')

const isDark = computed(() => theme.value === 'dark')

onMounted(() => {
  // Check for saved theme preference or default to light
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  theme.value = savedTheme || 'light'
  applyTheme(theme.value)
})

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  applyTheme(theme.value)
  localStorage.setItem('theme', theme.value)
}

function applyTheme(themeName: 'light' | 'dark') {
  if (themeName === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.removeAttribute('data-theme')
  }
}
</script>

<template>
  <div class="theme-switcher">
    <span class="label">Theme:</span>
    <button 
      @click="toggleTheme" 
      class="theme-toggle"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <CAIcon :name="isDark ? 'moon' : 'sun'" />
    </button>
  </div>
</template>

<style scoped>
.theme-switcher {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-bg-base);
  border-radius: 6px;
}

.label {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

.theme-toggle {
  background-color: var(--color-bg-elevated);
  border: 2px solid var(--color-border);
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  color: var(--color-text-primary);
  flex: 1;
  justify-content: center;
}

.theme-toggle:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}
</style>
