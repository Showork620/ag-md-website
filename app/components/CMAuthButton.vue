<script setup lang="ts">
defineOptions({ ssr: false })
import CAButton from './CAButton.vue'
import CAIconLabel from './CAIconLabel.vue'

const { status, data: session, signIn, signOut } = useAuth()

const handleSignIn = () => {
  if (typeof signIn === 'function') {
    signIn('google', { callbackUrl: '/' })
  } else {
    window.location.href = '/'
  }
}

const handleSignOut = () => {
  if (typeof signOut === 'function') {
    signOut({ callbackUrl: '/' })
  } else {
    window.location.href = '/'
  }
}

const isLoading = computed(() => status?.value === 'loading')
const isAuthenticated = computed(() => status?.value === 'authenticated')
</script>

<template>
  <div class="auth-button-container">
    <div class="auth-inner">
      <CAButton
        :variant="isAuthenticated ? 'plain' : 'plain'"
        :disabled="isLoading"
        @click="isAuthenticated ? handleSignOut() : handleSignIn()"
        :title="isAuthenticated ? 'ログアウト' : 'ログイン'"
        :aria-label="isAuthenticated ? 'ログアウト' : 'ログイン'"
      >
        <CAIconLabel :icon="isLoading ? 'loading' : (isAuthenticated ? '' : 'user')" :label="isLoading ? '読み込み中' : (isAuthenticated ? 'ログアウト' : 'ログイン')" />
      </CAButton>

      <!-- Avatar when authenticated -->
      <img v-if="isAuthenticated && session?.user?.image" :src="session.user.image" alt="ユーザー画像" class="auth-avatar" />
    </div>
  </div>
</template>

<style scoped>
.auth-button-container {
  display: flex;
  align-items: center;
}

.auth-button-container .base-button {
  padding: 0.35rem 0.6rem;
}

.auth-inner {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.auth-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-border);
}
</style>

