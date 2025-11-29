<script setup lang="ts">
import CACard from './CACard.vue'
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
  <CACard hoverable class="post-card" :class="{ 'is-draft': isDraft }">
    <div class="post-header">
      <h3 class="post-title">
        <CAIconLabel v-if="isDraft" icon="edit" class="draft-icon" />
        {{ post.title || (isDraft ? 'Untitled Draft' : '') }}
      </h3>
      <span class="post-date">{{ isDraft ? 'Last updated: ' : '' }}{{ formatDate(post.createdAt) }}</span>
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

    <p class="post-excerpt" v-if="post.content">
      {{ post.content.substring(0, 100) }}...
    </p>
    <p class="post-excerpt" v-else>
      No content available.
    </p>
  </CACard>
</template>

<style scoped>
.post-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.post-card.is-draft {
  border: 1px dashed var(--color-border);
}

.post-card.is-draft:hover {
  border-color: var(--color-primary);
}

.post-header {
  margin-bottom: 0.75rem;
  padding-right: 2rem; /* Space for delete button */
}

.delete-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}

.post-card:hover .delete-btn {
  opacity: 1;
}

.favorite-btn {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 2;
}

.post-card:hover .favorite-btn {
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

.post-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: var(--color-text-primary);
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.draft-icon {
  color: var(--color-text-secondary);
  font-size: 0.9em;
}

.post-date {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-excerpt {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
