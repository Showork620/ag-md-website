<script setup lang="ts">
import { catalogData } from '~/utils/catalog-data'
import CatalogSidebar from '~/components/CatalogSidebar.vue'

const route = useRoute()
const componentName = route.params.name as string

const componentData = computed(() => 
  catalogData.find(c => c.name === componentName)
)

// Reactive props state
const currentProps = reactive<Record<string, any>>({})

// Initialize props with defaults
watch(componentData, (newData) => {
  if (newData?.props) {
    Object.entries(newData.props).forEach(([key, def]: [string, any]) => {
      currentProps[key] = def.default
    })
  }
}, { immediate: true })

// Slot content handling
const slotContent = computed(() => {
  if (componentData.value?.props?.default) {
    return currentProps.default
  }
  return ''
})
</script>

<template>
  <div class="detail-layout">
    <CatalogSidebar />
    
    <div class="detail-content">
      <div v-if="componentData" class="controls-panel">
        <div class="controls-header-wrapper">
          <NuxtLink to="/catalog" class="back-link-small">← Back to Index</NuxtLink>
          <div class="controls-header">
            <h2>{{ componentData.name }}</h2>
            <span class="badge">{{ componentData.category }}</span>
          </div>
        </div>
        <p class="desc">{{ componentData.description }}</p>
        
        <div v-if="componentData.props" class="props-form">
          <h3>Interactive Props</h3>
          <div v-for="(def, key) in componentData.props" :key="key" class="prop-control">
            <template v-if="key !== 'default'">
              <label>{{ key }}</label>
              
              <!-- Select -->
              <select 
                v-if="(def as any).type === 'select'" 
                v-model="currentProps[key]"
                class="control-input"
              >
                <option v-for="opt in (def as any).options" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
              
              <!-- Boolean -->
              <div v-else-if="(def as any).type === 'boolean'" class="toggle-wrapper">
                <input 
                  type="checkbox" 
                  v-model="currentProps[key]"
                  :id="`prop-${key}`"
                />
                <label :for="`prop-${key}`">{{ currentProps[key] ? 'True' : 'False' }}</label>
              </div>

              <!-- JSON / Object -->
              <div v-else-if="(def as any).type === 'json'">
                <textarea 
                  :value="JSON.stringify(currentProps[key], null, 2)"
                  @input="e => { try { currentProps[key] = JSON.parse((e.target as HTMLTextAreaElement).value) } catch {} }"
                  class="control-input textarea font-mono"
                ></textarea>
              </div>
              
              <!-- Text -->
              <input 
                v-else 
                v-model="currentProps[key]"
                class="control-input"
              />
              
              <p class="prop-desc">{{ (def as any).description }}</p>
            </template>
          </div>

          <!-- Slot Content Editor -->
          <div v-if="componentData.props?.default" class="prop-control">
            <label>Content (Slot)</label>
            <textarea 
              v-model="currentProps.default"
              class="control-input textarea"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="preview-area">
        <div class="preview-stage" :class="{ 'dark-bg': componentData?.category === 'Organism' }">
          <component 
            v-if="componentData"
            :is="componentData.component"
            v-bind="currentProps"
          >
            <span v-if="slotContent" v-html="slotContent"></span>
          </component>
        </div>

        <!-- Gallery Section -->
        <div v-if="componentData?.gallery" class="gallery-section">
          <h3>{{ componentData.gallery.type === 'icons' ? 'Icon Gallery' : 'Variations' }}</h3>
          <div class="gallery-grid">
            <button 
              v-for="item in componentData.gallery.items" 
              :key="item"
              class="gallery-item"
              :class="{ active: currentProps[componentData.gallery.prop] === item }"
              @click="currentProps[componentData.gallery.prop] = item"
              :title="item"
            >
              <!-- Icon Gallery -->
              <component 
                v-if="componentData.gallery.type === 'icons'"
                :is="componentData.component"
                :name="item"
                size="24px"
              />
              
              <!-- Variant Gallery (Button/Tag) -->
              <component 
                v-else
                :is="componentData.component"
                v-bind="{ ...currentProps, [componentData.gallery.prop]: item }"
              >
                {{ slotContent || item }}
              </component>
              
              <span class="gallery-label">{{ item }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-layout {
  display: flex;
  min-height: 100vh;
}

.detail-content {
  flex: 1;
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.controls-panel {
  width: 350px;
  background-color: var(--color-bg-base);
  border-right: 1px solid var(--color-border);
  padding: 2rem;
  overflow-y: auto;
  flex-shrink: 0;
}

.controls-header-wrapper {
  margin-bottom: 1rem;
}

.back-link-small {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.back-link-small:hover {
  color: var(--color-primary);
  text-decoration: underline;
}

.controls-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.controls-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-text-primary);
}

.badge {
  display: inline-block;
  padding: 0.2rem 0.5rem;
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.desc {
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
  line-height: 1.5;
  font-size: 0.9rem;
}

.props-form h3 {
  font-size: 1rem;
  color: var(--color-text-primary);
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.prop-control {
  margin-bottom: 1.5rem;
}

.prop-control label {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.control-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: var(--color-bg-elevated);
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.control-input.textarea {
  min-height: 80px;
  resize: vertical;
}

.font-mono {
  font-family: monospace;
  font-size: 0.8rem;
}

.toggle-wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.toggle-wrapper input {
  margin: 0;
}

.toggle-wrapper label {
  margin: 0;
  cursor: pointer;
}

.prop-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.25rem;
}

.preview-area {
  flex: 1;
  background-color: #f0f0f0; /* Neutral background for preview wrapper */
  display: flex;
  flex-direction: column; /* Stack preview and gallery */
  align-items: center;
  /* justify-content: center; Removed to allow scrolling if gallery is long */
  padding: 2rem;
  overflow-y: auto;
  gap: 2rem;
}

.preview-stage {
  padding: 3rem;
  background-color: var(--color-bg-base);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  min-width: 300px;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.preview-stage.dark-bg {
  background-color: var(--color-bg-base);
}

.gallery-section {
  width: 100%;
  max-width: 800px;
  background-color: var(--color-bg-base);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.gallery-section h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
}

.gallery-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.gallery-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-elevated);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 80px;
}

.gallery-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.gallery-item.active {
  border-color: var(--color-primary);
  background-color: rgba(61, 122, 95, 0.05);
  box-shadow: 0 0 0 2px var(--color-primary);
}

.gallery-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: monospace;
}
</style>
