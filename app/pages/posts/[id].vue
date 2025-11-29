<script setup lang="ts">
import MarkdownIt from 'markdown-it'

const route = useRoute()
const router = useRouter()
const { data: session } = useAuth()
const { data: post, refresh } = await useFetch(`/api/posts/${route.params.id}`)

const { isFavorited, toggleFavorite, isAuthenticated, loadFavorites } = useFavorites()

// Load favorites on mount
onMounted(async () => {
  await loadFavorites()
})

const md = new MarkdownIt()
const renderedContent = computed(() => {
  return post.value ? md.render(post.value.content) : ''
})

const isOwner = computed(() => {
  if (!session.value?.user || !post.value) return false
  return session.value.user.id === post.value.author?.id
})

const isAdmin = computed(() => {
  return session.value?.user?.isAdmin || false
})

const canEdit = computed(() => isOwner.value || isAdmin.value)

const handleFavorite = async () => {
  if (!post.value) return
  await toggleFavorite(post.value.id)
}

const handleDelete = async () => {
  if (!confirm('本当に削除しますか？')) return
  
  try {
    await $fetch(`/api/posts/${route.params.id}`, { method: 'DELETE' })
    router.push('/')
  } catch (error) {
    alert('削除に失敗しました')
  }
}
</script>

<template>
  <CAContainer max-width="800px">
    <div class="page-content">
      <NuxtLink to="/" class="back-link">← Back to list</NuxtLink>
      
      <article v-if="post" class="article">
        <div class="article-header">
          <h1>{{ post.title }}</h1>
          
          <!-- Action buttons -->
          <div class="action-buttons">
            <!-- Favorite button -->
            <CAButton 
              v-if="isAuthenticated"
              @click="handleFavorite"
              :variant="isFavorited(post.id) ? 'primary' : 'outline'"
              size="small"
            >
              <CAIconLabel 
                icon="heart" 
                :label="isFavorited(post.id) ? 'お気に入り済み' : 'お気に入り追加'" 
              />
            </CAButton>
            
            <!-- Edit button (owner or admin only) -->
            <CAButton 
              v-if="canEdit"
              @click="router.push(`/posts/${post.id}/edit`)"
              variant="outline"
              size="small"
            >
              <CAIconLabel icon="edit" label="編集" />
            </CAButton>
            
            <!-- Delete button (owner or admin only) -->
            <CAButton 
              v-if="canEdit"
              @click="handleDelete"
              variant="outline"
              size="small"
              class="delete-button"
            >
              <CAIconLabel icon="trash" label="削除" />
            </CAButton>
          </div>
        </div>
        
        <div class="post-meta">
          <span class="date">{{ new Date(post.createdAt).toLocaleDateString() }}</span>
          <div class="tags">
            <CATag 
              v-for="tag in post.tags" 
              :key="tag.id" 
              :color="tag.id % 2 === 0 ? 'green' : 'orange'"
            >
              {{ tag.name }}
            </CATag>
          </div>
        </div>
        
        <div class="content markdown-body" v-html="renderedContent"></div>
      </article>
      <div v-else class="loading">
        Loading...
      </div>
    </div>
  </CAContainer>
</template>

<style scoped>
.page-content {
  padding-block: 2rem;
}

.back-link {
  display: inline-block;
  margin-bottom: 2rem;
  text-decoration: none;
  color: var(--color-primary);
  font-weight: 500;
  transition: color 0.2s;
}

.back-link:hover {
  color: var(--color-accent);
}

.article {
  background-color: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.article h1 {
  font-size: 2.5rem;
  margin: 0;
  color: var(--color-text-primary);
  flex: 1;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.delete-button {
  color: #ff4d4f;
  border-color: #ff4d4f;
}

.delete-button:hover {
  background-color: rgba(255, 77, 79, 0.1);
}

@media (max-width: 768px) {
  .article-header {
    flex-direction: column;
  }
  
  .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }
}

.post-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.date {
  color: var(--color-text-secondary);
  font-size: 0.875rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.content {
  color: var(--color-text-primary);
  line-height: 1.8;
}

.loading {
  text-align: center;
  padding: 4rem;
  color: var(--color-text-secondary);
}

/* Markdown styles */
:deep(.markdown-body h1) { 
  font-size: 2em; 
  margin: 1.5em 0 0.5em 0;
  color: var(--color-text-primary);
}

:deep(.markdown-body h2) { 
  font-size: 1.5em; 
  margin: 1.2em 0 0.5em 0;
  color: var(--color-text-primary);
}

:deep(.markdown-body h3) { 
  font-size: 1.25em; 
  margin: 1em 0 0.5em 0;
  color: var(--color-text-primary);
}

:deep(.markdown-body p) { 
  margin-bottom: 1em; 
  line-height: 1.8;
}

:deep(.markdown-body ul),
:deep(.markdown-body ol) { 
  margin-bottom: 1em; 
  padding-left: 1.5em;
}

:deep(.markdown-body code) {
  background-color: var(--color-bg-base);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-size: 0.9em;
}

:deep(.markdown-body pre) {
  background-color: var(--color-bg-base);
  padding: 1em;
  border-radius: 6px;
  overflow-x: auto;
  margin-bottom: 1em;
}

:deep(.markdown-body table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1em;
}

:deep(.markdown-body th),
:deep(.markdown-body td) {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  text-align: left;
}

:deep(.markdown-body th) {
  background-color: var(--color-bg-base);
  font-weight: 600;
}
</style>
