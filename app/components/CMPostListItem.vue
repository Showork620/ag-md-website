<script setup lang="ts">
import CATag from './CATag.vue'
import CAIconLabel from './CAIconLabel.vue'

interface Post {
  id: string | number
  title: string
  content: string
  createdAt: string
  tags?: { id: string; name: string; color?: string }[]
}

const props = defineProps<{
  post: Post
  isDraft?: boolean
}>()

defineEmits<{
  (e: 'delete', id: string | number): void
}>()

const { isFavorited, toggleFavorite, isAuthenticated } = useFavorites()

const handleFavorite = async (e: Event) => {
  e.preventDefault()
  e.stopPropagation()
  await toggleFavorite(Number(props.post.id))
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="post-list-item" :class="{ 'is-draft': isDraft }">
    <div class="date-col">
      <span class="post-date">{{ formatDate(post.createdAt) }}</span>
    </div>
    
    <div class="content-col">
      <div class="title-row">
        <h3 class="post-title">
          <CAIconLabel v-if="isDraft" icon="edit" class="draft-icon" />
          {{ post.title || (isDraft ? 'Untitled Draft' : '') }}
        </h3>
        <div class="post-tags" v-if="post.tags && post.tags.length">
          <CATag 
            v-for="tag in post.tags" 
            :key="tag.id" 
            :color="tag.color as any || 'neutral'"
            size="small"
          >
            {{ tag.name }}
          </CATag>
        </div>
      </div>
      <p class="post-excerpt" v-if="post.content">{{ post.content.substring(0, 120) }}...</p>
      <p class="post-excerpt" v-else>No content available.</p>
    </div>

    <CAIconButton
      v-if="isDraft"
      @click.prevent.stop="$emit('delete', post.id)"
      icon="trash"
      variant="danger"
      size="small"
      title="Delete Draft"
      class="delete-btn"
    />
    
    <!-- Favorite button (only for non-draft posts when authenticated) -->
    <CAIconButton
      v-if="!isDraft && isAuthenticated"
      @click="handleFavorite"
      icon="heart"
      :variant="isFavorited(Number(post.id)) ? 'primary' : 'ghost'"
      size="small"
      :title="isFavorited(Number(post.id)) ? 'お気に入りから削除' : 'お気に入りに追加'"
      class="favorite-btn"
      :class="{ 'is-favorited': isFavorited(Number(post.id)) }"
    />
  </div>
</template>

<style scoped>
.post-list-item {
  display: flex;
  padding: 1.5rem;
  background-color: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  transition: background-color 0.2s;
  cursor: pointer;
  position: relative;
}

.post-list-item.is-draft {
  border-bottom: 1px dashed var(--color-border);
}

.post-list-item:hover {
  background-color: var(--color-bg-base);
}

.date-col {
  width: 120px;
  flex-shrink: 0;
  padding-top: 0.25rem;
}

.post-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.content-col {
  flex: 1;
  padding-right: 2rem; /* Space for delete button */
}

.title-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.post-title {
  margin: 0;
  font-size: 1.1rem;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.draft-icon {
  color: var(--color-text-secondary);
  font-size: 0.9em;
}

.post-tags {
  display: flex;
  gap: 0.5rem;
}

.post-excerpt {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.delete-btn {
  position: absolute;
  top: 50%;
  right: 0.5rem;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.post-list-item:hover .delete-btn {
  opacity: 1;
}

.favorite-btn {
  position: absolute;
  top: 50%;
  right: 3.5rem;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.post-list-item:hover .favorite-btn {
  opacity: 1;
}

.favorite-btn.is-favorited {
  opacity: 1;
}

/* Touch device support - always show */
@media (hover: none) {
  .delete-btn,
  .favorite-btn {
    opacity: 1 !important;
  }
}
</style>
