<script setup lang="ts">
interface Props {
  visible: boolean
  title?: string
  width?: string
  maxWidth?: string
  closeOnClickOutside?: boolean
}

interface Emits {
  close: []
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  title: '提示',
  width: '90%',
  maxWidth: '500px',
  closeOnClickOutside: true
})

const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}

const handleOverlayClick = (event: MouseEvent) => {
  if (props.closeOnClickOutside && event.target === event.currentTarget) {
    handleClose()
  }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
      <div class="dialog-content" :style="{
        width: width,
        maxWidth: maxWidth
      }">
        <div class="dialog-header">
          <h2 class="dialog-title">{{ title }}</h2>
          <button class="dialog-close" @click="handleClose">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="dialog-body">
          <slot name="body"></slot>
        </div>
        <div v-if="$slots.footer" class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.dialog-content {
  background-color: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: 0 10px 25px var(--color-shadow);
  max-height: 90vh;
  overflow-y: auto;
}

.dialog-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--color-text-primary);
}

.dialog-close {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs);
  border: none;
  background-color: transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.dialog-close:hover {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.dialog-body {
  padding: var(--spacing-lg);
}

.dialog-footer {
  margin-top: var(--spacing-xl);
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}
</style>