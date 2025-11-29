export const useFavorites = () => {
  const { status } = useAuth()
  const favorites = ref<Set<number>>(new Set())
  const loading = ref(false)

  // Load favorites on mount (if authenticated)
  const loadFavorites = async () => {
    if (status.value !== 'authenticated') return

    try {
      const data = await $fetch<any[]>('/api/favorites')
      favorites.value = new Set(data.map(post => post.id))
    } catch (error) {
      console.error('Failed to load favorites:', error)
    }
  }

  // Check if post is favorited
  const isFavorited = (postId: number) => {
    return favorites.value.has(postId)
  }

  // Toggle favorite
  const toggleFavorite = async (postId: number) => {
    if (status.value !== 'authenticated') return false

    loading.value = true
    const wasFavorited = isFavorited(postId)

    try {
      if (wasFavorited) {
        await $fetch(`/api/favorites/${postId}`, { method: 'DELETE' })
        favorites.value.delete(postId)
      } else {
        await $fetch(`/api/favorites/${postId}`, { method: 'POST' })
        favorites.value.add(postId)
      }
      return true
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    favorites,
    loading,
    isFavorited,
    toggleFavorite,
    loadFavorites,
    isAuthenticated: computed(() => status.value === 'authenticated'),
  }
}
