<script setup lang="ts">
import { ref, computed } from 'vue'

// 上传状态类型
type UploadStatus = 'idle' | 'uploading' | 'paused' | 'completed' | 'error'

// 分片信息接口
interface Chunk {
  index: number
  start: number
  end: number
  size: number
  blob: Blob
  uploaded: boolean
  error: boolean
}

// 文件上传状态
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadStatus = ref<UploadStatus>('idle')
const uploadProgress = ref(0)
const currentChunk = ref(0)
const chunks = ref<Chunk[]>([])
const chunkSize = ref(1024 * 1024) // 1MB 分片
const uploadedChunks = ref<Set<number>>(new Set())
const uploadSpeed = ref(0)
const estimatedTime = ref(0)

// 计算属性
const totalChunks = computed(() => {
  if (!file.value) return 0
  return Math.ceil(file.value.size / chunkSize.value)
})

const fileName = computed(() => {
  return file.value?.name || '未选择文件'
})

const fileSize = computed(() => {
  if (!file.value) return '0 B'
  const size = file.value.size
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
})

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    file.value = target.files[0]
    resetUpload()
    splitFileIntoChunks()
  }
}

// 重置上传状态
const resetUpload = () => {
  uploadStatus.value = 'idle'
  uploadProgress.value = 0
  currentChunk.value = 0
  chunks.value = []
  uploadedChunks.value = new Set()
  uploadSpeed.value = 0
  estimatedTime.value = 0
}

// 将文件分割成分片
const splitFileIntoChunks = () => {
  if (!file.value) return

  chunks.value = []
  const totalSize = file.value.size
  let start = 0
  let index = 0

  while (start < totalSize) {
    const end = Math.min(start + chunkSize.value, totalSize)
    const size = end - start
    const blob = file.value.slice(start, end)

    chunks.value.push({
      index,
      start,
      end,
      size,
      blob,
      uploaded: false,
      error: false
    })

    start = end
    index++
  }
}

// 模拟上传分片
const uploadChunk = async (chunk: Chunk): Promise<boolean> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 200))
  
  // 模拟上传成功（实际项目中这里应该发送HTTP请求）
  console.log(`上传分片 ${chunk.index + 1}/${totalChunks.value}`)
  
  // 模拟5%的失败率
  if (Math.random() < 0.05) {
    return false
  }
  
  return true
}

// 开始上传
const startUpload = async () => {
  if (!file.value || uploadStatus.value === 'uploading') return

  uploadStatus.value = 'uploading'
  const startTime = Date.now()
  let uploadedBytes = 0

  try {
    // 从上次中断的分片开始
    for (let i = currentChunk.value; i < chunks.value.length; i++) {
      if (uploadStatus.value !== 'uploading') break
      
      const chunk = chunks.value[i]
      if (uploadedChunks.value.has(i)) {
        currentChunk.value = i + 1
        continue
      }

      const success = await uploadChunk(chunk)
      
      if (success) {
        chunk.uploaded = true
        chunk.error = false
        uploadedChunks.value.add(i)
        currentChunk.value = i + 1
        
        // 计算上传进度
        uploadedBytes += chunk.size
        uploadProgress.value = Math.round((uploadedBytes / file.value!.size) * 100)
        
        // 计算上传速度
        const elapsedTime = (Date.now() - startTime) / 1000
        uploadSpeed.value = Math.round(uploadedBytes / elapsedTime / 1024) // KB/s
        
        // 计算剩余时间
        const remainingBytes = file.value!.size - uploadedBytes
        estimatedTime.value = Math.round(remainingBytes / (uploadSpeed.value * 1024)) // 秒
      } else {
        chunk.error = true
        throw new Error(`分片 ${i + 1} 上传失败`)
      }
    }

    if (uploadStatus.value === 'uploading' && uploadProgress.value === 100) {
      uploadStatus.value = 'completed'
    }
  } catch (error) {
    console.error('上传失败:', error)
    uploadStatus.value = 'error'
  }
}

// 暂停上传
const pauseUpload = () => {
  if (uploadStatus.value === 'uploading') {
    uploadStatus.value = 'paused'
  }
}

// 恢复上传
const resumeUpload = () => {
  if (uploadStatus.value === 'paused') {
    startUpload()
  }
}

// 重新上传
const restartUpload = () => {
  resetUpload()
  if (file.value) {
    splitFileIntoChunks()
  }
}

// 选择文件
const selectFile = () => {
  fileInput.value?.click()
}

// 取消上传
const cancelUpload = () => {
  resetUpload()
  file.value = null
}
</script>

<template>
  <div class="file-upload-container p-6">
    <h1 class="text-2xl font-bold mb-6">大文件上传研究</h1>
    
    <!-- 文件选择区域 -->
    <div class="file-selector mb-8">
      <h2 class="text-xl font-semibold mb-4">文件选择</h2>
      <div class="flex items-center gap-4">
        <input 
          ref="fileInput" 
          type="file" 
          class="hidden" 
          @change="handleFileChange"
        />
        <button 
          class="btn btn-primary" 
          @click="selectFile"
          :disabled="uploadStatus === 'uploading'"
        >
          选择文件
        </button>
        <div class="file-info flex-1">
          <p class="file-name">{{ fileName }}</p>
          <p class="file-size text-sm text-gray-500">{{ fileSize }}</p>
        </div>
      </div>
    </div>

    <!-- 上传设置 -->
    <div class="upload-settings mb-8">
      <h2 class="text-xl font-semibold mb-4">上传设置</h2>
      <div class="form-group">
        <label class="form-label">分片大小</label>
        <div class="flex items-center gap-4">
          <input 
            type="range" 
            v-model.number="chunkSize" 
            min="1024 * 1024" 
            max="10 * 1024 * 1024" 
            step="1024 * 1024"
            :disabled="uploadStatus === 'uploading'"
          />
          <span>{{ chunkSize / (1024 * 1024) }} MB</span>
        </div>
      </div>
      <div class="form-group mt-4">
        <p class="text-sm">
          总分片数: {{ totalChunks }}
          <span v-if="file"> ({{ chunkSize }} bytes 每片)</span>
        </p>
      </div>
    </div>

    <!-- 上传状态 -->
    <div class="upload-status mb-8">
      <h2 class="text-xl font-semibold mb-4">上传状态</h2>
      <div class="status-card p-4 rounded-lg">
        <div class="status-item mb-2">
          <span class="status-label">状态:</span>
          <span class="status-value" :class="{
            'text-green-500': uploadStatus === 'completed',
            'text-blue-500': uploadStatus === 'uploading',
            'text-yellow-500': uploadStatus === 'paused',
            'text-red-500': uploadStatus === 'error'
          }">
            {{ {
              idle: '就绪',
              uploading: '上传中',
              paused: '已暂停',
              completed: '已完成',
              error: '上传失败'
            }[uploadStatus] }}
          </span>
        </div>
        <div class="status-item mb-2">
          <span class="status-label">进度:</span>
          <span class="status-value">{{ uploadProgress }}%</span>
        </div>
        <div class="status-item mb-2">
          <span class="status-label">当前分片:</span>
          <span class="status-value">{{ currentChunk }}/{{ totalChunks }}</span>
        </div>
        <div class="status-item mb-2">
          <span class="status-label">上传速度:</span>
          <span class="status-value">{{ uploadSpeed }} KB/s</span>
        </div>
        <div class="status-item">
          <span class="status-label">预计剩余时间:</span>
          <span class="status-value">{{ estimatedTime }} 秒</span>
        </div>
      </div>
    </div>

    <!-- 上传进度条 -->
    <div class="upload-progress mb-8">
      <div class="progress-bar bg-gray-200 rounded-full h-4 overflow-hidden">
        <div 
          class="progress-fill h-full rounded-full transition-all duration-300" 
          :class="{
            'bg-blue-500': uploadStatus === 'uploading',
            'bg-green-500': uploadStatus === 'completed',
            'bg-yellow-500': uploadStatus === 'paused',
            'bg-red-500': uploadStatus === 'error'
          }"
          :style="{ width: `${uploadProgress}%` }"
        ></div>
      </div>
    </div>

    <!-- 分片信息 -->
    <div class="chunks-info mb-8">
      <h2 class="text-xl font-semibold mb-4">分片信息</h2>
      <div class="chunks-grid grid grid-cols-10 gap-1">
        <div 
          v-for="chunk in chunks" 
          :key="chunk.index"
          class="chunk-item w-4 h-4 rounded-full transition-all"
          :class="{
            'bg-gray-300': !chunk.uploaded && !chunk.error,
            'bg-green-500': chunk.uploaded,
            'bg-red-500': chunk.error,
            'ring-2 ring-blue-500': chunk.index === currentChunk - 1
          }"
          :title="`分片 ${chunk.index + 1}: ${chunk.size} bytes`"
        ></div>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="upload-controls">
      <h2 class="text-xl font-semibold mb-4">控制</h2>
      <div class="flex gap-4">
        <button 
          class="btn btn-primary" 
          @click="startUpload"
          :disabled="!file || uploadStatus === 'uploading' || uploadStatus === 'completed'"
        >
          开始上传
        </button>
        <button 
          class="btn btn-secondary" 
          @click="pauseUpload"
          :disabled="uploadStatus !== 'uploading'"
        >
          暂停
        </button>
        <button 
          class="btn btn-secondary" 
          @click="resumeUpload"
          :disabled="uploadStatus !== 'paused'"
        >
          恢复
        </button>
        <button 
          class="btn btn-danger" 
          @click="restartUpload"
          :disabled="!file"
        >
          重新上传
        </button>
        <button 
          class="btn btn-danger" 
          @click="cancelUpload"
          :disabled="!file"
        >
          取消
        </button>
      </div>
    </div>

    <!-- 技术说明 -->
    <div class="tech-info mt-12 p-4 bg-gray-100 rounded-lg">
      <h2 class="text-xl font-semibold mb-4">技术说明</h2>
      <div class="space-y-2">
        <p><strong>分片上传:</strong> 将大文件分割成多个小块（分片），逐个上传，降低单个请求的大小和失败率。</p>
        <p><strong>断点续传:</strong> 记录已上传的分片，支持从失败或暂停的地方继续上传，不需要重新上传整个文件。</p>
        <p><strong>实现原理:</strong></p>
        <ul class="list-disc pl-6 space-y-1">
          <li>使用 File.slice() 方法分割文件</li>
          <li>记录已上传的分片索引</li>
          <li>支持暂停和恢复上传</li>
          <li>计算上传进度和速度</li>
          <li>模拟网络错误和重试机制</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.file-upload-container {
  max-width: 800px;
  margin: 0 auto;
}

.file-selector {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.upload-settings,
.upload-status,
.upload-progress,
.chunks-info,
.upload-controls {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.status-card {
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-label {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.status-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.btn {
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
}

.btn-secondary {
  background-color: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-border);
}

.btn-danger {
  background-color: #ef4444;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.file-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.file-size {
  color: var(--color-text-secondary);
}

.chunks-grid {
  max-width: 100%;
  overflow-x: auto;
  padding: var(--spacing-sm) 0;
}

.tech-info {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
}
</style>