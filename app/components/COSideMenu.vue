<script setup lang="ts">
import { NAVIGATION_ITEMS } from '~/utils/navigation'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const { status } = useAuth()

function closeMenu() {
  emit('close')
}
</script>

<template>
  <div>
    <!-- Overlay -->
    <div 
      v-if="props.isOpen" 
      class="overlay" 
      @click="closeMenu"
    ></div>

    <!-- Side Menu -->
    <aside :class="['side-menu', { 'is-open': props.isOpen }]">
      <CAContainer>
        <div class="menu-header">
          <h2>Menu</h2>
          <button @click="closeMenu" class="close-btn" aria-label="Close menu">
            <CAIcon name="close" />
          </button>
        </div>

        <nav class="menu-nav">
          <NuxtLink 
            v-for="item in NAVIGATION_ITEMS"
            :key="item.path"
            :to="item.path" 
            @click="closeMenu" 
            class="menu-link"
          >
            <CAIcon :name="item.icon" class="menu-icon" />
            {{ item.label }}
          </NuxtLink>
          
          <!-- Favorites link (only when authenticated) -->
          <ClientOnly>
            <NuxtLink 
              v-if="status === 'authenticated'"
              to="/favorites" 
              @click="closeMenu" 
              class="menu-link"
            >
              <CAIcon name="heart" class="menu-icon" />
              お気に入り
            </NuxtLink>
          </ClientOnly>
        </nav>

        <div class="menu-section">
          <h3>Settings</h3>
          <CMThemeSwitcher />
        </div>
      </CAContainer>
    </aside>
  </div>
</template>

<style scoped>
/* Note: menu-toggle button styling is now in COGlobalHeader */

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1002;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.side-menu {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background-color: var(--color-bg-elevated);
  border-right: 1px solid var(--color-border);
  z-index: 1003;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.side-menu.is-open {
  transform: translateX(0);
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid var(--color-border);
}

.menu-header h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
}

.menu-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.menu-link {
  padding: 0.75rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  color: var(--color-text-primary);
  font-weight: 500;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.menu-link:hover {
  background-color: var(--color-bg-base);
  color: var(--color-primary);
}

.menu-section {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.menu-section h3 {
  margin: 0 0 1rem 0;
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
