<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
})

const { data: favorites, pending, error, refresh } = await useFetch('/api/favorites')
</script>

<template>
  <CAContainer max-width="1200px">
    <div class="page-content">
      <div class="page-header">
        <h1>お気に入り</h1>
        <CAButton @click="refresh" variant="outline" size="small">
          <CAIconLabel icon="search" label="更新" />
        </CAButton>
      </div>

      <!-- Loading state -->
      <div v-if="pending" class="loading">
        読み込み中...
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="error">
        エラーが発生しました: {{ error.message }}
      </div>

      <!-- Empty state -->
      <div v-else-if="!favorites || favorites.length === 0" class="empty-state">
        <CAIcon name="heart" class="empty-icon" />
        <p>お気に入りの投稿がありません</p>
      </div>

      <!-- Posts list -->
      <div v-else class="posts-list">
        <div v-for="post in favorites" :key="post.id">
          <NuxtLink :to="`/posts/${post.id}`" class="post-link">
            <CMPostListItem :post="post" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </CAContainer>
</template>

<style scoped>
.page-content {
  padding: 2rem;
  padding-left: 6rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-header h1 {
  margin: 0;
  font-size: 2rem;
  color: var(--color-text-primary);
}

.loading,
.error {
  text-align: center;
  padding: 3rem;
  color: var(--color-text-secondary);
}

.error {
  color: #ff4d4f;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: var(--color-text-secondary);
  margin-bottom: 1rem;
}

.empty-state p {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
</style>
