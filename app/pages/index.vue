<script setup lang="ts">
import CAIconLabel from '~/components/CAIconLabel.vue'
const { data: posts } = await useFetch('/api/posts')

const viewMode = ref<'grid' | 'list'>('grid')

// Truncate content for preview
function truncate(text: string, length: number = 20) {
  if (!text || text.length <= length) return text
  return text.substring(0, length) + '...'
}

function toggleView() {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  localStorage.setItem('viewMode', viewMode.value)
}

onMounted(() => {
  const saved = localStorage.getItem('viewMode')
  if (saved === 'grid' || saved === 'list') {
    viewMode.value = saved
  }
  loadDrafts()
})

// Drafts logic
import { getDrafts, deleteDraft, type Draft } from '~/utils/drafts'
import CMPostCard from '~/components/CMPostCard.vue'
import CMPostListItem from '~/components/CMPostListItem.vue'

const drafts = ref<Draft[]>([])

function loadDrafts() {
  drafts.value = getDrafts().sort((a, b) => b.updatedAt - a.updatedAt)
}

function removeDraft(id: string | number) {
  if (confirm('Are you sure you want to delete this draft?')) {
    deleteDraft(String(id))
    loadDrafts()
  }
}

function convertToPost(draft: Draft) {
  return {
    id: draft.id,
    title: draft.title,
    content: draft.content,
    createdAt: new Date(draft.updatedAt).toISOString(),
    tags: draft.tags ? draft.tags.split(',').filter(t => t.trim()).map((t, i) => ({
      id: `draft-tag-${i}`,
      name: t.trim(),
      color: 'neutral'
    })) : []
  }
}
</script>

<template>
  <CAContainer>
    <div class="page-content">
      <div class="header">
        <h1>Blog Posts</h1>
        <div class="header-actions">
          <CAButton variant="plain" @click="toggleView">
            <CAIconLabel 
              :icon="viewMode === 'grid' ? 'list' : 'grid'" 
              :label="viewMode === 'grid' ? 'List View' : 'Grid View'" 
            />
          </CAButton>
          <NuxtLink to="/posts/new">
            <CAButton variant="accent">New Post</CAButton>
          </NuxtLink>
        </div>
      </div>
      
      <!-- Drafts Section -->
      <div v-if="drafts.length > 0" class="drafts-section">
        <h2>Drafts</h2>
        <div :class="viewMode === 'grid' ? 'posts-grid' : 'list-view'">
          <template v-if="viewMode === 'grid'">
            <div v-for="draft in drafts" :key="draft.id" class="post-card-wrapper">
              <NuxtLink :to="`/posts/new?draftId=${draft.id}`" class="post-link-wrapper">
                <CMPostCard 
                  :post="convertToPost(draft)" 
                  is-draft 
                  @delete="removeDraft"
                />
              </NuxtLink>
            </div>
          </template>
          <template v-else>
            <div v-for="draft in drafts" :key="draft.id">
              <NuxtLink :to="`/posts/new?draftId=${draft.id}`" class="post-link-wrapper">
                <CMPostListItem 
                  :post="convertToPost(draft)" 
                  is-draft 
                  @delete="removeDraft"
                />
              </NuxtLink>
            </div>
          </template>
        </div>
      </div>
      
      <!-- Posts Section -->
      <div v-if="viewMode === 'grid'" class="posts-grid">
        <div v-for="post in posts" :key="post.id" class="post-card-wrapper">
          <NuxtLink :to="`/posts/${post.id}`" class="post-link-wrapper">
            <CMPostCard :post="post" />
          </NuxtLink>
        </div>
      </div>

      <div v-else-if="viewMode === 'list'" class="list-view">
        <div v-for="post in posts" :key="post.id">
          <NuxtLink :to="`/posts/${post.id}`" class="post-link-wrapper">
            <CMPostListItem :post="post" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </CAContainer>
</template>

<style scoped>
.page-content {
  padding-block: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  font-size: 2rem;
  color: var(--color-text-primary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}



/* Drafts Section */
.drafts-section {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--color-border);
}

.drafts-section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
}

/* Grid View */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.post-card-wrapper {
  height: 100%;
}

.post-link-wrapper {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

/* List View */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
