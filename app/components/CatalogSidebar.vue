<script setup lang="ts">
import { catalogData } from '~/utils/catalog-data'
import CMThemeSwitcher from '~/components/CMThemeSwitcher.vue'

const route = useRoute()
const isCollapsed = ref(false)
const searchQuery = ref('')

const filteredCatalog = computed(() => {
  if (!searchQuery.value) return catalogData
  const query = searchQuery.value.toLowerCase()
  return catalogData.filter(c => c.name.toLowerCase().includes(query))
})

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}
</script>

<template>
  <div :class="['catalog-sidebar', { 'is-collapsed': isCollapsed }]">
    <div class="sidebar-header">
      <div v-if="!isCollapsed" class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search components..."
          class="search-input"
        />
      </div>
      <button @click="toggleSidebar" class="collapse-btn" :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'">
        <CAIcon :name="isCollapsed ? 'search' : 'chevronLeft'" />
      </button>
    </div>

    <div v-if="!isCollapsed" class="component-list">
      <NuxtLink to="/catalog" class="nav-item index-link" :class="{ active: route.path === '/catalog' }">
        <span class="comp-name">Catalog Index</span>
      </NuxtLink>
      
      <NuxtLink to="/catalog/tokens" class="nav-item index-link" :class="{ active: route.path === '/catalog/tokens' }">
        <span class="comp-name">Design Tokens</span>
      </NuxtLink>
      
      <div class="divider"></div>

      <NuxtLink 
        v-for="comp in filteredCatalog" 
        :key="comp.name"
        :to="`/catalog/${comp.name}`"
        class="nav-item"
        :class="{ active: route.path === `/catalog/${comp.name}` }"
      >
        <span class="comp-name">{{ comp.name }}</span>
        <span class="comp-cat">{{ comp.category }}</span>
      </NuxtLink>
    </div>
    
    <div v-if="!isCollapsed" class="sidebar-footer">
      <CMThemeSwitcher />
    </div>
  </div>
</template>

<style scoped>
.catalog-sidebar {
  width: 280px;
  background-color: var(--color-bg-elevated);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 0.3s ease;
  height: 100vh;
  position: sticky;
  top: 0;
  overflow: hidden; /* Prevent entire sidebar from scrolling */
}

.catalog-sidebar.is-collapsed {
  width: 60px;
}

.sidebar-header {
  padding: 1rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  min-height: 70px;
  flex-shrink: 0; /* Prevent header from shrinking */
}

.search-box {
  flex: 1;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.collapse-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: 0.5rem;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.collapse-btn:hover {
  background-color: var(--color-bg-base);
  color: var(--color-primary);
}

.component-list {
  flex: 1;
  overflow-y: auto; /* Only component list scrolls */
  padding: 0.5rem;
  min-height: 0; /* Important for flex scrolling */
}

.nav-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--color-text-primary);
  border-radius: 6px;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: var(--color-bg-base);
}

.nav-item.active {
  background-color: var(--color-primary);
  color: white;
}

.nav-item.active .comp-cat {
  color: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.4);
}

.index-link {
  font-weight: 600;
}

.divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 0.5rem 0;
}

.comp-cat {
  font-size: 0.7rem;
  padding: 0.1rem 0.4rem;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  color: var(--color-text-secondary);
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0; /* Prevent footer from shrinking */
  background-color: var(--color-bg-elevated);
}
</style>
