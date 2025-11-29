<script setup lang="ts">
interface Props {
  modelValue: string
  type?: 'text' | 'textarea'
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <component
    :is="type === 'textarea' ? 'textarea' : 'input'"
    :value="modelValue"
    @input="handleInput"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="['base-input', { 'base-input--textarea': type === 'textarea' }]"
  />
</template>

<style scoped>
.base-input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background-color: var(--color-bg-base);
  color: var(--color-text-primary);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.base-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(61, 122, 95, 0.1);
}

.base-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-input--textarea {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}
</style>
