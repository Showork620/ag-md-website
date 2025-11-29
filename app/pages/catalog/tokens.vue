<script setup lang="ts">
import CatalogSidebar from '~/components/CatalogSidebar.vue'

const colorTokens = [
  { name: '--color-bg-base', description: 'ベース背景色' },
  { name: '--color-bg-elevated', description: '浮き上がった背景色' },
  { name: '--color-text-primary', description: 'プライマリテキスト色' },
  { name: '--color-text-secondary', description: 'セカンダリテキスト色' },
  { name: '--color-primary', description: 'プライマリカラー' },
  { name: '--color-accent', description: 'アクセントカラー' },
  { name: '--color-border', description: 'ボーダーカラー' },
]

const typographySizes = [
  { name: 'h1', size: '2.5rem', use: 'ページタイトル' },
  { name: 'h2', size: '2rem', use: 'セクションタイトル' },
  { name: 'h3', size: '1.5rem', use: 'サブセクション' },
  { name: 'body', size: '1rem', use: '本文テキスト' },
  { name: 'small', size: '0.875rem', use: '補足テキスト' },
]

const fontSettings = [
  { property: 'font-family', value: 'system-ui, sans-serif', description: 'システムフォント' },
  { property: 'line-height', value: '1.6', description: '行の高さ' },
  { property: 'font-weight (normal)', value: '400', description: '通常の太さ' },
  { property: 'font-weight (bold)', value: '600-700', description: '太字' },
]

function getCSSVariable(varName: string) {
  if (process.client) {
    return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  }
  return '#000'
}
</script>

<template>
  <div class="catalog-layout">
    <CatalogSidebar />
    
    <div class="tokens-page">
      <h1>Design Tokens</h1>
      <p class="intro">デザインシステムの基礎となるトークン（変数）の定義です。</p>

      <!-- Color Palette -->
      <section class="token-section">
        <h2>カラーパレット</h2>
        <div class="token-grid">
          <div v-for="token in colorTokens" :key="token.name" class="color-token">
            <div 
              class="color-swatch" 
              :style="{ backgroundColor: `var(${token.name})` }"
            ></div>
            <div class="token-info">
              <code class="token-name">{{ token.name }}</code>
              <p class="token-description">{{ token.description }}</p>
              <ClientOnly>
                <span class="token-value">{{ getCSSVariable(token.name) }}</span>
              </ClientOnly>
            </div>
          </div>
        </div>
      </section>

      <!-- Typography Scale -->
      <section class="token-section">
        <h2>Typography Scale</h2>
        <div class="typography-grid">
          <div v-for="type in typographySizes" :key="type.name" class="typography-item">
            <component :is="type.name === 'body' ? 'p' : type.name" class="typography-sample">
              Sample Text
            </component>
            <div class="token-info">
              <code class="token-name">{{ type.name }}</code>
              <span class="token-value">{{ type.size }}</span>
              <p class="token-description">{{ type.use }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Font Settings -->
      <section class="token-section">
        <h2>フォント設定</h2>
        <div class="settings-list">
          <div v-for="setting in fontSettings" :key="setting.property" class="setting-item">
            <code class="setting-property">{{ setting.property }}</code>
            <span class="setting-value">{{ setting.value }}</span>
            <p class="setting-description">{{ setting.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.catalog-layout {
  display: flex;
  min-height: 100vh;
}

.tokens-page {
  flex: 1;
  padding: 2rem;
}

.intro {
  color: var(--color-text-secondary);
  margin-bottom: 3rem;
}

.token-section {
  margin-bottom: 4rem;
}

.token-section h2 {
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-border);
  padding-bottom: 0.5rem;
}

/* Color Tokens */
.token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.color-token {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.color-swatch {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  flex-shrink: 0;
}

.token-info {
  flex: 1;
}

.token-name {
  display: block;
  font-size: 0.875rem;
  color: var(--color-primary);
  margin-bottom: 0.25rem;
  font-family: 'Courier New', monospace;
}

.token-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin: 0.25rem 0;
}

.token-value {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: 'Courier New', monospace;
}

/* Typography */
.typography-grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.typography-item {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.5rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.typography-sample {
  flex-shrink: 0;
  margin: 0;
  color: var(--color-text-primary);
}

/* Font Settings */
.settings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.setting-item {
  padding: 1rem;
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1rem;
  align-items: center;
}

.setting-property {
  font-family: 'Courier New', monospace;
  color: var(--color-primary);
  font-size: 0.875rem;
}

.setting-value {
  font-family: 'Courier New', monospace;
  color: var(--color-text-primary);
  font-size: 0.875rem;
}

.setting-description {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

@media (max-width: 768px) {
  .token-grid {
    grid-template-columns: 1fr;
  }
  
  .typography-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .setting-item {
    grid-template-columns: 1fr;
  }
}
</style>
