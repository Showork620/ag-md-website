<script setup lang="ts">
const { status, data: session } = useAuth()
const isAuthenticated = computed(() => status.value === 'authenticated')

const emit = defineEmits<{
  toggleMenu: []
}>()

function toggleMenu() {
  emit('toggleMenu')
}
</script>

<template>
  <header class="global-header">
    <div class="header-content">
      <!-- Left: Hamburger + Logo/Title -->
      <div class="header-left">
        <button @click="toggleMenu" class="menu-toggle" aria-label="Toggle menu">
          <CAIcon name="menu" />
        </button>
        <NuxtLink to="/" class="logo">
          <h1>Article Site</h1>
        </NuxtLink>
      </div>

      <!-- Right: Actions -->
      <div class="header-right">
        <!-- Auth Button -->
        <ClientOnly>
          <CMAuthButton />
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped>
.menu-toggle {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-primary);
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.menu-toggle:hover {
  background-color: var(--color-bg-base);
  color: var(--color-primary);
}

.global-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background-color: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  height: 100%;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  text-decoration: none;
  color: var(--color-text-primary);
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .header-content {
    padding: 0 1rem;
  }
  
  .logo h1 {
    font-size: 1.25rem;
  }
}
</style>
