<script setup lang="ts">
const sampleText = ref('')
const sampleTextarea = ref('Sample text in textarea...')
</script>

<template>
  <div class="showcase">
    <h1>基本コンポーネント一覧</h1>
    
    <section class="section">
      <h2>Buttons</h2>
      <div class="component-demo">
        <CAButton variant="primary">Primary Button</CAButton>
        <CAButton variant="accent">Accent Button</CAButton>
        <CAButton variant="outline">Outline Button</CAButton>
      </div>
    </section>

    <section class="section">
      <h2>Cards</h2>
      <div class="component-demo">
        <CACard>
          <h3>Basic Card</h3>
          <p>This is a basic card component.</p>
        </CACard>
        <CACard :hoverable="true">
          <h3>Hoverable Card</h3>
          <p>Hover over me!</p>
        </CACard>
      </div>
    </section>

    <section class="section">
      <h2>Tags</h2>
      <div class="component-demo">
        <CATag color="green">Green Tag</CATag>
        <CATag color="orange">Orange Tag</CATag>
        <CATag color="neutral">Neutral Tag</CATag>
      </div>
    </section>

    <section class="section">
      <h2>Inputs</h2>
      <div class="component-demo vertical">
        <label>Disabled Input:</label>
        <CAInput modelValue="Disabled input" :disabled="true" />
      </div>
    </section>

    <section class="section">
      <h2>Combined Example</h2>
      <CACard :hoverable="true">
        <h3>記事タイトル</h3>
        <div class="tags">
          <CATag color="green">Vue</CATag>
          <CATag color="orange">Nuxt</CATag>
          <CATag color="neutral">TypeScript</CATag>
        </div>
        <p>これは複数のコンポーネントを組み合わせた例です。カード内にタグとボタンが配置されています。</p>
        <CAButton variant="primary">Read More</CAButton>
      </CACard>
    </section>
  </div>
</template>

<style scoped>
.showcase {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--color-text-primary);
}

.section {
  margin-bottom: 3rem;
}

.section h2 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 0.5rem;
}

.component-demo {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

.component-demo.vertical {
  flex-direction: column;
}

.component-demo > * {
  flex: 1;
  min-width: 200px;
}

.component-demo label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.section h3 {
  margin: 0 0 0.5rem 0;
  color: var(--color-text-primary);
}

.section p {
  margin: 0.5rem 0;
  line-height: 1.6;
  color: var(--color-text-primary);
}
</style>
