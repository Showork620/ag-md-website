<script setup lang="ts">
const { data: session, signOut } = useAuth()

const handleSignOut = async () => {
  await signOut({ callbackUrl: '/' })
}
</script>

<template>
  <div class="banned-container">
    <div class="banned-card">
      <div class="banned-icon">🚫</div>
      
      <h1>アカウントが停止されています</h1>
      
      <div v-if="session?.user?.banReason" class="ban-reason">
        <h2>理由</h2>
        <p>{{ session.user.banReason }}</p>
      </div>
      
      <div v-if="session?.user?.canContactAdmin" class="contact-info">
        <p>
          この措置に心当たりがない場合、または異議を申し立てたい場合は、<br>
          管理者にご連絡ください。
        </p>
        <a href="mailto:admin@example.com" class="contact-button">
          管理者に連絡
        </a>
      </div>
      
      <div v-else class="permanent-ban">
        <p class="permanent-message">
          このアカウントは永久に停止されています。
        </p>
      </div>
      
      <CAButton @click="handleSignOut" variant="outline" class="logout-button">
        ログアウト
      </CAButton>
    </div>
  </div>
</template>

<style scoped>
.banned-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: var(--color-bg-base);
}

.banned-card {
  max-width: 500px;
  width: 100%;
  background-color: var(--color-bg-elevated);
  border: 2px solid #ff4d4f;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
}

.banned-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.banned-card h1 {
  font-size: 1.75rem;
  color: var(--color-text-primary);
  margin: 0 0 2rem 0;
}

.ban-reason {
  background-color: rgba(255, 77, 79, 0.1);
  border: 1px solid rgba(255, 77, 79, 0.3);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;
}

.ban-reason h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #ff4d4f;
  margin: 0 0 0.5rem 0;
}

.ban-reason p {
  font-size: 0.95rem;
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.5;
}

.contact-info {
  margin-bottom: 2rem;
}

.contact-info p {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
}

.contact-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.contact-button:hover {
  filter: brightness(1.1);
}

.permanent-ban {
  margin-bottom: 2rem;
}

.permanent-message {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0;
  font-style: italic;
}

.logout-button {
  margin-top: 1rem;
}
</style>
