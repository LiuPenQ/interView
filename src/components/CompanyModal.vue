<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  isOpen: boolean
  company?: { name: string; description: string; position: string; salary: string } | null
}

interface Emits {
  close: []
  save: [company: { name: string; description: string; position: string; salary: string }]
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  company: null
})

const emit = defineEmits<Emits>()

const form = ref({
  name: props.company?.name || '',
  description: props.company?.description || '',
  position: props.company?.position || '',
  salary: props.company?.salary || ''
})

const isSubmitting = ref(false)

const isFormValid = computed(() => {
  return form.value.name.trim() && form.value.position.trim()
})

const resetForm = () => {
  form.value = {
    name: '',
    description: '',
    position: '',
    salary: ''
  }
  isSubmitting.value = false
}

const handleClose = () => {
  resetForm()
  emit('close')
}

const handleSave = async () => {
  if (isFormValid.value && !isSubmitting.value) {
    isSubmitting.value = true
    try {
      emit('save', { ...form.value })
    } finally {
      isSubmitting.value = false
    }
  }
}
</script>

<template>
  <Dialog :visible="isOpen" :title="company ? '编辑公司' : '新建公司'" @close="handleClose">
    <template #body>
      <form>
        <div class="form-group">
          <label for="name" class="form-label">公司名称</label>
          <input id="name" v-model="form.name" type="text" class="form-input" placeholder="请输入公司名称" required />
        </div>
        <div class="form-group">
          <label for="description" class="form-label">公司介绍</label>
          <textarea id="description" v-model="form.description" class="form-input" placeholder="请输入公司介绍"
            rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="position" class="form-label">岗位描述</label>
          <input id="position" v-model="form.position" type="text" class="form-input" placeholder="请输入岗位描述" required />
        </div>
        <div class="form-group">
          <label for="salary" class="form-label">薪资范围</label>
          <input id="salary" v-model="form.salary" type="text" class="form-input" placeholder="请输入薪资范围" />
        </div>
      </form>
    </template>

    <template #footer>
      <button type="button" class="btn btn-secondary" @click="handleClose">
        取消
      </button>
      <button type="submit" class="btn btn-primary" :disabled="!isFormValid || isSubmitting" @click="handleSave">
        {{ isSubmitting ? '保存中...' : '保存' }}
      </button>
    </template>
  </Dialog>
</template>

<style scoped>
.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-xs);
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input {
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background-color: var(--color-border);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-primary:disabled {
  background-color: var(--color-border);
  cursor: not-allowed;
}
</style>