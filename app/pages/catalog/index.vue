<script setup lang="ts">
import { catalogData } from '~/utils/catalog-data'
import CatalogSidebar from '~/components/CatalogSidebar.vue'

const categories = ['Atom', 'Molecule', 'Organism']

function getComponentsByCategory(category: string) {
  return catalogData.filter(c => c.category === category)
}
</script>

<template>
  <div class="catalog-layout">
    <CatalogSidebar />
    
    <div class="catalog-content">
      <header class="catalog-header">
        <h1>Component Catalog</h1>
        <p>Design System Documentation</p>
      </header>

      <div v-for="category in categories" :key="category" class="category-section">
        <h2>{{ category }}</h2>
        <div class="component-grid">
          <NuxtLink 
            v-for="component in getComponentsByCategory(category)" 
            :key="component.name"
            :to="`/catalog/${component.name}`"
            class="component-card"
          >
            <div class="card-header">
              <h3>{{ component.name }}</h3>
              <span class="category-badge">{{ component.category }}</span>
            </div>
            <p class="description">{{ component.description }}</p>
            
            <!-- Preview Placeholder -->
            <div class="preview-placeholder">
              <component 
                v-if="component.previewInCatalog"
                :is="component.component" 
                v-bind="component.props?.default ? {} : component.props"
                class="preview-item"
              >
                {{ component.props?.default?.default || '' }}
              </component>
              <div v-else class="complex-preview">
                Click to view details
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-layout {
  display: flex;
  min-height: 100vh;
}

.catalog-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.catalog-header {
  margin-bottom: 3rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.catalog-header h1 {
  font-size: 2.5rem;
  color: var(--color-text-primary);
  margin: 0;
}

.catalog-header p {
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
}

.category-section {
  margin-bottom: 3rem;
}

.category-section h2 {
  font-size: 1.5rem;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  padding-left: 0.5rem;
  border-left: 4px solid var(--color-primary);
}

.component-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.component-card {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}

.component-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.card-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-text-primary);
}

.category-badge {
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  background-color: var(--color-bg-base);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.description {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  flex-grow: 1;
}

.preview-placeholder {
  background-color: var(--color-bg-base);
  border: 1px dashed var(--color-border);
  border-radius: 4px;
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.complex-preview {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
  font-style: italic;
}

.preview-item {
  pointer-events: none; /* Disable interaction in preview */
}
</style>
