<script setup lang="ts">
import MarkdownIt from 'markdown-it'
import CAIconLabel from '~/components/CAIconLabel.vue'

definePageMeta({
  middleware: 'auth',
})

const title = ref('')
const content = ref('')
const tags = ref('')
const md = new MarkdownIt()

const renderedContent = computed(() => md.render(content.value))

// Slash command state
const showMenu = ref(false)
const selectedIndex = ref(0)
const textareaRef = ref<HTMLTextAreaElement | null>(null)

// Table picker state
const showTablePicker = ref(false)
const tableRows = ref(3)
const tableCols = ref(3)
const tablePickerFocus = ref<'cols' | 'rows'>('cols') // Which field is focused

// Publishing state
const isPublishing = ref(false)

// Mobile preview state
const showPreview = ref(false)
const touchStartY = ref(0)
const touchCurrentY = ref(0)
const isDragging = ref(false)

import { EDITOR_SHORTCUTS as menuItems } from '~/utils/editor-shortcuts'

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  const value = target.value
  const cursorPosition = target.selectionStart

  if (value.slice(cursorPosition - 1, cursorPosition) === '/') {
    showMenu.value = true
    selectedIndex.value = 0
  } else {
    if (showMenu.value && value.slice(cursorPosition - 1, cursorPosition) !== '/') {
       showMenu.value = false
    }
  }
}

function handleKeyDown(e: KeyboardEvent) {
  // Table picker keyboard controls
  if (showTablePicker.value) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (tablePickerFocus.value === 'cols') {
        tableCols.value = Math.min(10, tableCols.value + 1)
      } else {
        tableRows.value = Math.min(10, tableRows.value + 1)
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (tablePickerFocus.value === 'cols') {
        tableCols.value = Math.max(1, tableCols.value - 1)
      } else {
        tableRows.value = Math.max(1, tableRows.value - 1)
      }
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      if (tablePickerFocus.value === 'cols') {
        tablePickerFocus.value = 'rows'
      } else {
        // On rows field, Enter/Tab confirms and inserts
        insertTable()
      }
    } else if (e.key === 'Escape') {
      showTablePicker.value = false
    }
    return
  }

  // Slash menu keyboard controls
  if (!showMenu.value) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value + 1) % menuItems.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = (selectedIndex.value - 1 + menuItems.length) % menuItems.length
  } else if (e.key === 'Enter' || e.key === 'Tab') {
    e.preventDefault()
    selectItem(menuItems[selectedIndex.value]?.value ?? '')
  } else if (e.key === 'Escape') {
    showMenu.value = false
  }
}

function selectItem(value: string) {
  if (value === 'TABLE_PICKER') {
    showTablePicker.value = true
    showMenu.value = false
    tablePickerFocus.value = 'cols' // Reset to cols when opening
    return
  }
  insertMarkdown(value)
}

function insertMarkdown(text: string) {
  if (!textareaRef.value) return

  const textarea = textareaRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const value = textarea.value
  
  let replaceStart = start
  if (value.slice(start - 1, start) === '/') {
    replaceStart = start - 1
  }

  content.value = value.slice(0, replaceStart) + text + value.slice(end)
  
  nextTick(() => {
    textarea.focus()
    const newCursorPos = replaceStart + text.length
    textarea.selectionStart = newCursorPos
    textarea.selectionEnd = newCursorPos
  })

  showMenu.value = false
}

function insertTable() {
  const rows = tableRows.value
  const cols = tableCols.value
  
  let tableMd = '\n'
  
  // Header row
  tableMd += '|'
  for (let c = 0; c < cols; c++) {
    tableMd += ` Header_${c + 1} |`
  }
  tableMd += '\n'
  
  // Separator row
  tableMd += '|'
  for (let c = 0; c < cols; c++) {
    tableMd += ' --- |'
  }
  tableMd += '\n'
  
  // Data rows
  for (let r = 0; r < rows; r++) {
    tableMd += '|'
    for (let c = 0; c < cols; c++) {
      tableMd += ` Cell_${r + 1}_${c + 1} |`
    }
    tableMd += '\n'
  }
  
  insertMarkdown(tableMd)
  showTablePicker.value = false
}

// Draft logic
import { v4 as uuidv4 } from 'uuid'
import { saveDraft, getDraft, deleteDraft } from '~/utils/drafts'

const route = useRoute()
const draftId = ref<string>('')

// Initialize draft
onMounted(() => {
  const idFromQuery = route.query.draftId as string
  if (idFromQuery) {
    const draft = getDraft(idFromQuery)
    if (draft) {
      draftId.value = draft.id
      title.value = draft.title
      content.value = draft.content
      tags.value = draft.tags
    }
  } else {
    // New draft
    draftId.value = uuidv4()
  }
})

// Auto-save
let saveTimeout: NodeJS.Timeout

watch([title, content, tags], () => {
  if (!title.value && !content.value && !tags.value) return // Don't save empty
  
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    saveDraft({
      id: draftId.value,
      title: title.value,
      content: content.value,
      tags: tags.value,
      updatedAt: Date.now()
    })
  }, 1000)
})



// Clear draft on publish
async function publishPost() {
  if (!title.value || !content.value) {
    alert('Title and content are required')
    return
  }

  isPublishing.value = true

  try {
    const tagArray = tags.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)

    const response = await $fetch('/api/posts', {
      method: 'POST',
      body: {
        title: title.value,
        content: content.value,
        tags: tagArray,
      },
    })

    // Delete draft after successful publish
    deleteDraft(draftId.value)

    // Redirect to the new post
    navigateTo(`/posts/${response.id}`)
  } catch (error) {
    console.error('Failed to publish post:', error)
    alert('Failed to publish post. Please try again.')
  } finally {
    isPublishing.value = false
  }

}

// Tag selection logic
const { data: posts } = await useFetch('/api/posts')
const existingTags = computed(() => {
  if (!posts.value) return []
  const tagSet = new Set<string>()
  posts.value.forEach((post: any) => {
    post.tags?.forEach((tag: any) => tagSet.add(tag.name))
  })
  return Array.from(tagSet)
})

function addTag(tagName: string) {
  const currentTags = tags.value.split(',').map(t => t.trim()).filter(t => t)
  if (!currentTags.includes(tagName)) {
    currentTags.push(tagName)
    tags.value = currentTags.join(', ')
  }
}

// Mobile swipe handlers for bottom sheet (vertical swipe)
function handlePreviewTouchStart(e: TouchEvent) {
  if (!e.touches || !e.touches[0]) return
  touchStartY.value = e.touches[0].clientY
  touchCurrentY.value = e.touches[0].clientY
  isDragging.value = true
}

function handlePreviewTouchMove(e: TouchEvent) {
  if (!isDragging.value || !e.touches || !e.touches[0]) return
  touchCurrentY.value = e.touches[0].clientY
}

function handlePreviewTouchEnd() {
  if (!isDragging.value) return
  
  const deltaY = touchCurrentY.value - touchStartY.value
  const threshold = 50 // pixels
  
  // Upward swipe (negative delta) - open preview
  if (deltaY < -threshold && !showPreview.value) {
    showPreview.value = true
  }
  // Downward swipe (positive delta) - close preview
  else if (deltaY > threshold && showPreview.value) {
    showPreview.value = false
  }
  
  isDragging.value = false
  touchCurrentY.value = 0
  touchStartY.value = 0
}

function togglePreview() {
  showPreview.value = !showPreview.value
}
</script>

<template>
  <CAContainer variant="compact">
    <div class="editor-content">
      <div class="header">
        <!-- Top row: Back and Publish buttons -->
        <div class="header-top-row">
          <CAButton variant="plain" @click="navigateTo('/')">
            <CAIconLabel icon="chevronLeft" label="Back" />
          </CAButton>
          <CAButton 
            @click="publishPost" 
            :disabled="isPublishing" 
            variant="accent"
          >
            {{ isPublishing ? 'Publishing...' : 'Publish' }}
          </CAButton>
        </div>
        
        <!-- Input row: Title, Tags, and suggestions -->
        <div class="header-inputs">
          <CAInput v-model="title" placeholder="Post Title" />
          <CAInput v-model="tags" placeholder="Tags (comma separated)" />
          <div class="tag-suggestions" v-if="existingTags.length > 0">
            <span class="suggestion-label">Suggested:</span>
            <button 
              v-for="tag in existingTags" 
              :key="tag" 
              @click="addTag(tag)"
              class="tag-chip"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
      
      <div class="main-area">
        <div class="input-area">
          <textarea
            ref="textareaRef"
            v-model="content"
            @input="handleInput"
            @keydown="handleKeyDown"
            placeholder="Write your post... (Type '/' for commands)"
            class="markdown-input"
          ></textarea>
          
          <div v-if="showMenu" class="slash-menu">
            <div class="menu-title">Insert...</div>
            <ul>
              <li 
                v-for="(item, index) in menuItems" 
                :key="item.label" 
                @click="selectItem(item.value)"
                :class="{ 'selected': index === selectedIndex }"
              >
                {{ item.label }}
              </li>
            </ul>
          </div>

          <div v-if="showTablePicker" class="table-picker">
            <div class="picker-title">Insert Table</div>
            <div class="picker-row" :class="{ 'focused': tablePickerFocus === 'cols' }">
              <label>Columns:</label>
              <div class="value-display">{{ tableCols }}</div>
            </div>
            <div class="picker-row" :class="{ 'focused': tablePickerFocus === 'rows' }">
              <label>Rows:</label>
              <div class="value-display">{{ tableRows }}</div>
            </div>
            <div class="picker-hint">
              ↑↓: Adjust | Tab/Enter: Next/Confirm | Esc: Cancel
            </div>
          </div>
        </div>
        
        <!-- Bottom sheet preview for mobile -->
        <div 
          class="preview-area markdown-body" 
          :class="{ 'show': showPreview, 'dragging': isDragging }"
          @touchstart="handlePreviewTouchStart"
          @touchmove="handlePreviewTouchMove"
          @touchend="handlePreviewTouchEnd"
          @click="togglePreview"
        >
          <div class="preview-handle"></div>
          <div class="preview-content" v-html="renderedContent"></div>
        </div>
      </div>
    </div>
  </CAContainer>
</template>

<style scoped>
.editor-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding-block: 1rem;
  box-sizing: border-box;
  background-color: var(--color-bg-base);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 0.75rem;
}

.header-inputs {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.main-area {
  display: flex;
  flex: 1;
  gap: 1rem;
  min-height: 0;
}

.input-area, .preview-area {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow-y: auto;
  padding: 1rem;
  position: relative;
  background-color: var(--color-bg-elevated);
}

.markdown-input {
  width: 100%;
  height: 100%;
  border: none;
  resize: none;
  outline: none;
  font-family: monospace;
  font-size: 1rem;
  background: transparent;
  color: var(--color-text-primary);
}

.slash-menu {
  position: absolute;
  top: 50px;
  left: 20px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10;
  width: 200px;
}

.menu-title {
  padding: 0.5rem;
  background: var(--color-bg-base);
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  border-bottom: 1px solid var(--color-border);
}

.slash-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.slash-menu li {
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: background-color 0.2s;
}

.slash-menu li:hover, .slash-menu li.selected {
  background-color: rgba(61, 122, 95, 0.1);
  color: var(--color-primary);
}

.table-picker {
  position: absolute;
  top: 50px;
  left: 20px;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 20;
  padding: 1rem;
  width: 250px;
}

.picker-title {
  font-weight: bold;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.5rem;
  color: var(--color-text-primary);
}

.picker-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.picker-row.focused {
  background-color: rgba(61, 122, 95, 0.1);
  border-color: var(--color-primary);
}

.picker-row label {
  color: var(--color-text-primary);
}

.value-display {
  font-weight: bold;
  font-size: 1.2rem;
  min-width: 30px;
  text-align: center;
  color: var(--color-text-primary);
}

.picker-hint {
  margin-top: 1rem;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: center;
  padding: 0.5rem;
  background-color: var(--color-bg-base);
  border-radius: 4px;
}

/* Markdown preview styles */
.preview-area {
  color: var(--color-text-primary);
}

:deep(.markdown-body h1) { 
  font-size: 2em; 
  margin-bottom: 0.5em; 
  color: var(--color-text-primary);
}

:deep(.markdown-body h2) { 
  font-size: 1.5em; 
  margin-bottom: 0.5em;
  color: var(--color-text-primary);
}

:deep(.markdown-body p) { 
  margin-bottom: 1em; 
  line-height: 1.6;
}

:deep(.markdown-body ul) { 
  margin-bottom: 1em; 
  padding-left: 1.5em;
}

:deep(.markdown-body table) { 
  width: 100%; 
  border-collapse: collapse; 
  margin-bottom: 1em;
}

:deep(.markdown-body th), 
:deep(.markdown-body td) { 
  border: 1px solid var(--color-border); 
  padding: 0.5rem;
}

:deep(.markdown-body th) { 
  background-color: var(--color-bg-base);
}

.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
}

.suggestion-label {
  color: var(--color-text-secondary);
  margin-right: 0.5rem;
}

.tag-chip {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: all 0.2s;
}

.tag-chip:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* Preview handle for bottom sheet */
.preview-handle {
  display: none; /* Hidden on desktop */
}

.preview-content {
  height: 100%;
  overflow-y: auto;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .editor-content {
    padding-block: 0.5rem;
  }
  
  /* Header: 2-row layout */
  .header {
    flex-direction: column;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
  }
  
  /* Top row: Back and Publish buttons */
  .header-top-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  
  /* Input row: Full width */
  .header-inputs {
    width: 100%;
  }
  
  /* Main area: Single column */
  .main-area {
    flex-direction: column;
    position: relative;
  }
  
  .input-area {
    flex: 1;
    width: 100%;
    margin-bottom: 80px; /* Space for bottom sheet handle */
  }
  
  /* Bottom sheet preview */
  .preview-area {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 70vh;
    max-height: 70vh;
    z-index: 1000;
    transform: translateY(calc(100% - 60px)); /* Show only handle initially */
    transition: transform 0.3s ease-out;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.15);
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
  
  .preview-area.show {
    transform: translateY(0); /* Fully open */
  }
  
  .preview-area.dragging {
    transition: none; /* Smooth dragging */
  }
  
  /* Handle bar for bottom sheet */
  .preview-handle {
    display: block;
    width: 40px;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    margin: 12px auto;
    flex-shrink: 0;
  }
  
  .preview-content {
    padding: 1rem;
    height: calc(100% - 28px); /* Subtract handle height */
    overflow-y: auto;
  }
  
  /* Tag suggestions: scroll horizontally on mobile */
  .tag-suggestions {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
  }
}

/* Desktop: hide top-row wrapper, use original flex layout */
@media (min-width: 769px) {
  .header-top-row {
    display: contents; /* Unwrap to participate in flex layout */
  }
}
</style>
