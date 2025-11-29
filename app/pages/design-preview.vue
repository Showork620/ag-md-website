<script setup lang="ts">
const themes = [
  {
    name: 'Light Mode',
    colors: [
      { name: 'Primary Green', hex: '#3D7A5F', usage: 'メインアクション、リンク' },
      { name: 'Accent Orange', hex: '#E67E22', usage: '強調、重要なアクション' },
      { name: 'Background Base', hex: '#F5F6F7', usage: 'ページ背景' },
      { name: 'Background Elevated', hex: '#E8EAED', usage: 'カード背景、セクション' },
      { name: 'Text Primary', hex: '#2C3238', usage: '本文テキスト' },
      { name: 'Text Secondary', hex: '#6B7280', usage: '補足情報、日付' },
      { name: 'Border', hex: '#D1D5DB', usage: 'ボーダー、区切り線' },
    ],
    class: 'theme-light'
  },
  {
    name: 'Dark Mode',
    colors: [
      { name: 'Primary Green', hex: '#3D7A5F', usage: 'メインアクション、リンク' },
      { name: 'Accent Orange', hex: '#E67E22', usage: '強調、重要なアクション' },
      { name: 'Background Dark', hex: '#1A1D23', usage: 'ページ背景' },
      { name: 'Background Medium', hex: '#2C3039', usage: 'カード背景、セクション' },
      { name: 'Text Light', hex: '#E8E9ED', usage: '本文テキスト' },
      { name: 'Text Muted', hex: '#9CA3AF', usage: '補足情報、日付' },
      { name: 'Border', hex: '#404450', usage: 'ボーダー、区切り線' },
    ],
    class: 'theme-dark'
  }
]
</script>

<template>
  <div class="preview-wrapper">
    <h1 class="page-title">カラーパレット比較</h1>
    
    <div class="themes-container">
      <div v-for="theme in themes" :key="theme.name" :class="['theme-section', theme.class]">
        <h2 class="theme-title">{{ theme.name }}</h2>
        
        <div class="color-grid">
          <div v-for="color in theme.colors" :key="color.name" class="color-card">
            <div class="color-swatch" :style="{ backgroundColor: color.hex }"></div>
            <div class="color-info">
              <strong>{{ color.name }}</strong>
              <code>{{ color.hex }}</code>
              <p>{{ color.usage }}</p>
            </div>
          </div>
        </div>

        <!-- Components -->
        <div class="components-section">
          <h3>Components</h3>
          <div class="component-group">
            <h4>Buttons</h4>
            <div class="demo-row">
              <CAButton variant="primary">Primary</CAButton>
              <CAButton variant="accent">Accent</CAButton>
              <CAButton variant="outline">Outline</CAButton>
              <CAButton disabled>Disabled</CAButton>
            </div>
          </div>

          <div class="component-group">
            <h4>Cards</h4>
            <div class="demo-row">
              <CACard>Basic Card</CACard>
              <CACard :hoverable="true">Hoverable Card</CACard>
            </div>
          </div>

          <div class="component-group">
            <h4>Tags</h4>
            <div class="demo-row">
              <CATag color="green">Green</CATag>
              <CATag color="orange">Orange</CATag>
              <CATag color="neutral">Neutral</CATag>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-wrapper {
  min-height: 100vh;
  padding: 2rem;
  background: #f0f0f0;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #333;
}

.themes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.theme-section {
  border-radius: 12px;
  padding: 2rem;
  min-height: 600px;
}

.theme-light {
  background: #F5F6F7;
  color: #2C3238;
}

.theme-dark {
  background: #1A1D23;
  color: #E8E9ED;
}

.theme-title {
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
}

.theme-light .theme-title {
  border-bottom: 2px solid #3D7A5F;
}

.theme-dark .theme-title {
  border-bottom: 2px solid #3D7A5F;
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.color-card {
  border-radius: 8px;
  overflow: hidden;
}

.theme-light .color-card {
  border: 1px solid #D1D5DB;
  background: #E8EAED;
}

.theme-dark .color-card {
  border: 1px solid #404450;
  background: #2C3039;
}

.color-swatch {
  height: 60px;
  width: 100%;
}

.color-info {
  padding: 0.75rem;
}

.color-info strong {
  display: block;
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
}

.color-info code {
  display: block;
  font-size: 0.75rem;
  margin-bottom: 0.25rem;
}

.theme-light .color-info code {
  color: #6B7280;
}

.theme-dark .color-info code {
  color: #9CA3AF;
}

.color-info p {
  font-size: 0.7rem;
  margin: 0;
}

.theme-light .color-info p {
  color: #6B7280;
}

.theme-dark .color-info p {
  color: #9CA3AF;
}

.components-preview h3 {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

.component-group {
  margin-bottom: 1.5rem;
}

.buttons {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-accent, .btn-outline {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-primary {
  background-color: #3D7A5F;
  color: white;
}

.btn-primary:hover {
  background-color: #4A8B7A;
}

.btn-accent {
  background-color: #E67E22;
  color: white;
}

.btn-accent:hover {
  background-color: #D35400;
}

.btn-outline {
  background-color: transparent;
  color: #3D7A5F;
  border: 2px solid #3D7A5F;
}

.btn-outline:hover {
  background-color: #3D7A5F;
  color: white;
}

.sample-card {
  border-radius: 8px;
  padding: 1rem;
}

.theme-light .sample-card {
  border: 1px solid #D1D5DB;
  background: #E8EAED;
}

.theme-dark .sample-card {
  border: 1px solid #404450;
  background: #2C3039;
}

.sample-card h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.meta {
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.theme-light .meta {
  color: #6B7280;
}

.theme-dark .meta {
  color: #9CA3AF;
}

.tag {
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.tag-green {
  background-color: rgba(61, 122, 95, 0.2);
  color: #3D7A5F;
  border: 1px solid #3D7A5F;
}

.tag-orange {
  background-color: rgba(230, 126, 34, 0.2);
  color: #E67E22;
  border: 1px solid #E67E22;
}

.description {
  line-height: 1.5;
  margin-bottom: 0.75rem;
}

.link {
  color: #3D7A5F;
  text-decoration: none;
  font-weight: 500;
}

.link:hover {
  color: #E67E22;
}
</style>

