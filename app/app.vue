<script setup lang="ts">
const route = useRoute()
const showSideMenu = computed(() => !route.path.startsWith('/catalog'))
const showGlobalHeader = computed(() => !route.path.startsWith('/catalog'))

const isMenuOpen = ref(false)
function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}
function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <div class="app-layout">
    <COGlobalHeader v-if="showGlobalHeader" @toggle-menu="toggleMenu" />
    <div class="app-content" :class="{ 'no-header': !showGlobalHeader }">
      <COSideMenu v-if="showSideMenu" :is-open="isMenuOpen" @close="closeMenu" />
      <NuxtPage />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-content {
  margin-top: 64px; /* Header height */
  flex: 1;
}

.app-content.no-header {
  margin-top: 0; /* No margin when header is hidden */
}
</style>
