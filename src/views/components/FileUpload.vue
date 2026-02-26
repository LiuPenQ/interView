<!--
大文件上传研究页面
用途：实现分片上传和断点续传功能，研究大文件上传的性能优化
实现：使用Vue 3 Composition API，通过File.slice()方法分割文件，逐个上传分片
功能：
- 支持大文件分片上传
- 实现断点续传
- 内存使用优化
- 上传进度和速度显示
- 分片大小可调整
- 网络错误模拟和重试机制
-->
<template>
  <div class="file-upload-container p-6 relative">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold">大文件上传研究</h1>
      <div class="relative">
        <button class="tech-info-btn" @mouseenter="showTechInfo = true" :title="'显示技术说明'">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>

        <!-- 技术说明气泡 -->
        <div v-if="showTechInfo" class="tech-info-popover" @mouseleave="showTechInfo = false">
          <div class="tech-info-content">
            <h2 class="text-lg font-semibold mb-2">技术说明</h2>
            <div class="space-y-2">
              <p><strong>分片上传:</strong> 将大文件分割成多个小块（分片），逐个上传，降低单个请求的大小和失败率。</p>
              <p><strong>断点续传:</strong> 记录已上传的分片，支持从失败或暂停的地方继续上传，不需要重新上传整个文件。</p>
              <p><strong>内存优化:</strong> 针对大文件上传进行了内存使用优化，避免页面崩溃。</p>
              <p><strong>实现原理:</strong></p>
              <ul class="list-disc pl-6 space-y-1">
                <li>使用 File.slice() 方法分割文件</li>
                <li>延迟创建分片的 Blob 对象，避免一次性占用过多内存</li>
                <li>上传完成后释放 Blob 对象占用的内存</li>
                <li>限制最大文件大小（1.5GB）和最大分片数（2000个）</li>
                <li>记录已上传的分片索引，支持断点续传</li>
                <li>支持暂停和恢复上传</li>
                <li>计算上传进度、速度和剩余时间</li>
                <li>模拟网络错误和重试机制</li>
                <li>定期触发垃圾回收（如果浏览器支持）</li>
              </ul>
              <p><strong>性能建议:</strong></p>
              <ul class="list-disc pl-6 space-y-1">
                <li>对于大文件，建议使用10-20MB的分片大小</li>
                <li>避免同时上传多个大文件</li>
                <li>如果遇到内存使用过高的错误，尝试增大分片大小</li>
                <li>对于特别大的文件，考虑使用专业的文件上传服务</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文件选择区域 -->
    <div class="file-selector mb-8">
      <h2 class="text-xl font-semibold mb-4">文件选择</h2>
      <div class="flex items-center gap-4">
        <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
        <button class="btn btn-primary" @click="selectFile" :disabled="uploadStatus === 'uploading'">
          选择文件
        </button>
        <div class="file-info flex-1">
          <p class="file-name">{{ fileName }}</p>
          <p class="file-size text-sm" style="color: var(--color-text-secondary);">{{ fileSize }}</p>
          <p v-if="memoryUsage > 0" class="text-sm" style="color: var(--color-text-secondary);">
            预估内存使用: {{ memoryUsage.toFixed(2) }} MB
          </p>
        </div>
      </div>
      <!-- 错误消息 -->
      <div v-if="errorMessage" class="error-message mt-4 p-3 rounded-md"
        style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444;">
        {{ errorMessage }}
      </div>
    </div>

    <!-- 上传设置 -->
    <div class="upload-settings mb-8">
      <h2 class="text-xl font-semibold mb-4">上传设置</h2>
      <div class="form-group">
        <label class="form-label">分片大小</label>
        <div class="flex items-center gap-4">
          <input type="range" v-model.number="chunkSize" :min="1024 * 1024" :max="20 * 1024 * 1024" :step="1024 * 1024"
            :disabled="uploadStatus === 'uploading'" />
          <span>{{ chunkSize / (1024 * 1024) }} MB</span>
        </div>
        <p class="text-sm mt-2" style="color: var(--color-text-secondary);">
          提示：对于大文件，建议使用10-20MB的分片大小
        </p>
      </div>
      <div class="form-group mt-6">
        <label class="form-label">并发控制</label>
        <div class="flex items-center gap-4">
          <input type="range" v-model.number="concurrentCount" :min="1" :max="10" :step="1"
            :disabled="uploadStatus === 'uploading'" />
          <span>{{ concurrentCount }} 个并发</span>
        </div>
        <p class="text-sm mt-2" style="color: var(--color-text-secondary);">
          提示：默认3个并发，防止把后端打崩
        </p>
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

    <!-- 内存监控 -->
    <div class="memory-monitor mb-8">
      <h2 class="text-xl font-semibold mb-4">内存监控</h2>
      <div class="memory-chart p-4 rounded-lg" style="background-color: var(--color-bg-secondary);">
        <div class="memory-grid" style="height: 100px; width: 100%; position: relative;">
          <div v-for="(memory, index) in memoryHistory" :key="index" class="memory-bar" :style="{
            position: 'absolute',
            bottom: '0',
            left: `${(index / (maxMemoryHistory - 1)) * 100}%`,
            width: `${100 / maxMemoryHistory}%`,
            height: `${Math.min(100, (memory / 104857600) * 100)}%`, // 最大100MB
            backgroundColor: 'var(--color-primary)',
            opacity: '0.7',
            borderRadius: '2px 2px 0 0',
            transition: 'height 0.3s ease'
          }"></div>
        </div>
        <div class="memory-stats mt-2 flex justify-between text-sm">
          <span>内存使用趋势 (最近60秒)</span>
          <span v-if="memoryHistory.length > 0">
            当前: {{ ((memoryHistory[memoryHistory.length - 1] || 0) / 1048576).toFixed(2) }} MB
          </span>
        </div>
      </div>
    </div>

    <!-- 上传进度条 -->
    <div class="upload-progress mb-8">
      <div class="progress-bar bg-gray-200 rounded-full h-4 overflow-hidden">
        <div class="progress-fill h-full rounded-full transition-all duration-300" :class="{
          'bg-blue-500': uploadStatus === 'uploading',
          'bg-green-500': uploadStatus === 'completed',
          'bg-yellow-500': uploadStatus === 'paused',
          'bg-red-500': uploadStatus === 'error'
        }" :style="{ width: `${uploadProgress}%` }"></div>
      </div>
    </div>

    <!-- 分片信息 -->
    <div class="chunks-info mb-8">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">分片信息</h2>
        <button class="btn btn-secondary btn-sm" @click="showChunkDetails = !showChunkDetails"
          :disabled="chunks.length === 0">
          {{ showChunkDetails ? '隐藏详情' : '显示详情' }}
        </button>
      </div>
      <div class="form-group mb-4">
        <p class="text-sm">
          总分片数: {{ chunks.length }} | 已上传: {{ uploadedChunks.size }} | 失败: {{chunks.filter(c => c.error).length}}
        </p>
      </div>
      <!-- 分片详情（可折叠） -->
      <div v-if="showChunkDetails && chunks.length > 0" class="chunks-container overflow-auto max-h-60">
        <div class="chunks-grid grid grid-cols-20 gap-1">
          <div v-for="chunk in chunks" :key="chunk.index" class="chunk-item w-3 h-3 rounded-full transition-all" :style="{
            backgroundColor: !chunk.uploaded && !chunk.error ? 'var(--color-bg-tertiary)' :
              chunk.uploaded ? 'var(--color-primary)' : 'var(--color-border)',
            boxShadow: chunk.index === currentChunk - 1 ? '0 0 0 2px var(--color-primary)' : 'none'
          }" :title="`分片 ${chunk.index + 1}: ${(chunk.size / 1024 / 1024).toFixed(2)}MB`"></div>
        </div>
      </div>
      <div v-else-if="chunks.length > 0" class="text-center py-4"
        style="background-color: var(--color-bg-secondary); border-radius: var(--radius-md);">
        <p class="text-sm" style="color: var(--color-text-secondary);">
          分片详情已隐藏，点击"显示详情"按钮查看
        </p>
      </div>
    </div>

    <!-- 控制按钮 -->
    <div class="upload-controls">
      <h2 class="text-xl font-semibold mb-4">控制</h2>
      <div class="flex gap-4">
        <button class="btn btn-primary" @click="startUpload"
          :disabled="!file || uploadStatus === 'uploading' || uploadStatus === 'completed'">
          开始上传
        </button>
        <button class="btn btn-secondary" @click="pauseUpload" :disabled="uploadStatus !== 'uploading'">
          暂停
        </button>
        <button class="btn btn-secondary" @click="resumeUpload" :disabled="uploadStatus !== 'paused'">
          恢复
        </button>
        <button class="btn btn-danger" @click="restartUpload" :disabled="!file">
          重新上传
        </button>
        <button class="btn btn-danger" @click="cancelUpload" :disabled="!file">
          取消
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

// 上传状态类型
type UploadStatus = 'idle' | 'uploading' | 'paused' | 'completed' | 'error'

// 分片信息接口
interface Chunk {
  index: number
  start: number
  end: number
  size: number
  blob?: Blob // 延迟创建blob，避免内存占用过高
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
const chunkSize = ref(1024 * 1024 * 5) // 5MB 分片
const concurrentCount = ref(3) // 并发数
const uploadedChunks = ref<Set<number>>(new Set())
const uploadSpeed = ref(0)
const estimatedTime = ref(0)
const maxFileSize = ref(1024 * 1024 * 1500) // 1.5GB 最大文件大小
const errorMessage = ref('')
const showChunkDetails = ref(false) // 控制是否显示分片详情
const memoryUsage = ref(0)
const uploadQueue = ref<Chunk[]>([])
const isProcessingQueue = ref(false)
const showTechInfo = ref(false) // 控制是否显示技术说明

// 模拟后端存储已上传分片
const serverMock = ref<Set<number>>(new Set())

// 扩展Performance接口，添加memory属性
interface PerformanceWithMemory extends Performance {
  memory: {
    usedJSHeapSize: number
    totalJSHeapSize: number
    jsHeapSizeLimit: number
  }
}

// 类型断言工具函数
const getPerformanceWithMemory = (): PerformanceWithMemory | null => {
  if ('memory' in performance) {
    return performance as PerformanceWithMemory
  }
  return null
}

// 内存监控
const memoryHistory = ref<number[]>([])
const maxMemoryHistory = 60 // 最多记录60秒的内存使用情况

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
    const selectedFile = target.files[0]

    // 检查文件大小
    if (selectedFile.size > maxFileSize.value) {
      errorMessage.value = `文件大小超过限制（最大 ${maxFileSize.value / (1024 * 1024)}MB）`
      uploadStatus.value = 'error'
      return
    }

    errorMessage.value = ''
    file.value = selectedFile
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
  errorMessage.value = ''
  memoryUsage.value = 0
  serverMock.value = new Set()
  // 保留内存历史记录，以便查看趋势
}

// 将文件分割成分片（仅创建分片信息，不立即创建blob）
const splitFileIntoChunks = () => {
  if (!file.value) return

  chunks.value = []
  uploadQueue.value = []
  const totalSize = file.value.size
  let start = 0
  let index = 0

  // 对于大文件，使用更大的分片大小
  const targetChunkSize = file.value.size > 1024 * 1024 * 200 ? Math.max(chunkSize.value, 1024 * 1024 * 10) : chunkSize.value

  // 计算安全的分片大小，确保不超过浏览器限制
  const safeChunkSize = Math.max(targetChunkSize, Math.ceil(totalSize / 2000)) // 最多2000个分片

  while (start < totalSize) {
    const end = Math.min(start + safeChunkSize, totalSize)
    const size = end - start

    const chunk = {
      index,
      start,
      end,
      size,
      uploaded: false,
      error: false
    }

    chunks.value.push(chunk)
    uploadQueue.value.push(chunk)

    start = end
    index++
  }

  // 计算预估内存使用
  memoryUsage.value = Math.min(chunks.value.length * safeChunkSize / (1024 * 1024), 500) // 限制显示的内存使用值

  console.log(`文件分片完成: ${chunks.value.length}个分片，每个分片${(safeChunkSize / 1024 / 1024).toFixed(2)}MB`)
}

// 获取分片的blob（延迟创建）
const getChunkBlob = (chunk: Chunk): Blob => {
  if (!file.value) throw new Error('No file selected')
  if (!chunk.blob) {
    chunk.blob = file.value.slice(chunk.start, chunk.end)
  }
  return chunk.blob
}

// 模拟上传分片
const uploadChunk = async (chunk: Chunk): Promise<boolean> => {
  try {
    // 模拟后端返回：这个分片是否已上传
    if (serverMock.value.has(chunk.index)) {
      console.log(`分片 ${chunk.index + 1} 已存在，秒传`)
      return true
    }

    // 延迟创建blob，避免内存占用过高
    const blob = getChunkBlob(chunk)

    // 模拟网络延迟（根据分片大小调整延迟时间）
    const delay = Math.min(500, Math.max(100, chunk.size / 1024 / 1024 * 100))
    await new Promise(resolve => setTimeout(resolve, delay))

    // 模拟上传成功（实际项目中这里应该发送HTTP请求）
    console.log(`上传分片 ${chunk.index + 1}/${totalChunks.value} (${(chunk.size / 1024 / 1024).toFixed(2)}MB)`)

    // 释放blob占用的内存
    chunk.blob = undefined

    // 模拟5%的失败率
    // if (Math.random() < 0.05) {
    //   return false
    // }

    // 模拟后端存储已上传分片
    serverMock.value.add(chunk.index)

    return true
  } catch (error) {
    console.error('分片上传失败:', error)
    return false
  }
}

// 处理单个分片上传
const processChunk = async (chunk: Chunk, startTime: number): Promise<boolean> => {
  try {
    // 检查内存使用情况
    if (memoryUsage.value > 100) {
      // 短暂暂停，让浏览器有时间进行垃圾回收
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    const success = await uploadChunk(chunk)

    if (success) {
      chunk.uploaded = true
      chunk.error = false
      uploadedChunks.value.add(chunk.index)
      currentChunk.value = chunk.index + 1

      // 基于实际已上传的分片计算总上传字节数
      const totalUploadedBytes = Array.from(uploadedChunks.value).reduce((sum, index) => {
        const c = chunks.value[index]
        return sum + (c ? c.size : 0)
      }, 0)

      // 计算上传进度
      uploadProgress.value = Math.round((totalUploadedBytes / file.value!.size) * 100)

      // 计算上传速度
      const elapsedTime = (Date.now() - startTime) / 1000
      uploadSpeed.value = Math.round(totalUploadedBytes / elapsedTime / 1024) // KB/s

      // 计算剩余时间
      const remainingBytes = file.value!.size - totalUploadedBytes
      estimatedTime.value = Math.round(remainingBytes / Math.max(1, uploadSpeed.value * 1024)) // 秒

      // 每上传5个分片，强制垃圾回收（如果浏览器支持）
      if ((chunk.index + 1) % 5 === 0 && typeof (window as any).gc === 'function') {
        try {
          (window as any).gc()
        } catch (e) {
          // 静默忽略，避免运行时报错
        }
      }

      return true
    } else {
      chunk.error = true
      return false
    }
  } catch (error) {
    console.error('处理分片失败:', error)
    chunk.error = true
    return false
  }
}

// 开始上传
const startUpload = async () => {
  if (!file.value || uploadStatus.value === 'uploading' || isProcessingQueue.value) return

  uploadStatus.value = 'uploading'
  errorMessage.value = ''
  isProcessingQueue.value = true
  const startTime = Date.now()

  try {
    // 过滤出未上传的分片
    const queue = uploadQueue.value.filter(chunk => !uploadedChunks.value.has(chunk.index) && !chunk.error)
    const pendingChunks = [...queue]

    console.log(`开始上传: ${pendingChunks.length}个分片待上传，并发数: ${concurrentCount.value}`)

    // 并发控制上传
    while (pendingChunks.length > 0 && uploadStatus.value === 'uploading') {
      // 取出当前批次的分片
      const batch = pendingChunks.splice(0, concurrentCount.value)
      console.log(`处理批次: ${batch.map(c => c.index + 1).join(', ')}`)

      // 并发处理当前批次的分片
      const batchResults = await Promise.all(
        batch.map(chunk => processChunk(chunk, startTime))
      )

      // 检查批次结果
      const allSuccess = batchResults.every(result => result)
      if (!allSuccess) {
        throw new Error('批次上传失败')
      }

      // 给浏览器一点时间处理其他任务
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    if (uploadStatus.value === 'uploading' && uploadProgress.value === 100) {
      uploadStatus.value = 'completed'
      console.log('上传完成！')
    }
  } catch (error: any) {
    console.error('上传失败:', error)
    errorMessage.value = error.message || '上传失败，请重试'
    uploadStatus.value = 'error'
  } finally {
    isProcessingQueue.value = false
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

// 内存监控定时器
let memoryMonitorInterval: number | null = null

// 监听分片大小变化，重新计算分片
watch(chunkSize, () => {
  if (file.value && uploadStatus.value === 'idle') {
    splitFileIntoChunks()
  }
}, { immediate: false })

// 组件挂载时启动内存监控
onMounted(() => {
  // 定时记录内存使用情况
  memoryMonitorInterval = window.setInterval(() => {
    const perfWithMemory = getPerformanceWithMemory()
    if (perfWithMemory) {
      memoryHistory.value.push(perfWithMemory.memory.usedJSHeapSize)
      // 保持历史记录在最大长度以内
      if (memoryHistory.value.length > maxMemoryHistory) {
        memoryHistory.value.shift()
      }
    }
  }, 1000)
})

// 组件卸载时清除定时器
onUnmounted(() => {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval)
  }
})
</script>

<style scoped>
.file-upload-container {
  max-width: 800px;
  margin: 0 auto;
  position: relative;
}

/* 技术说明图标按钮 */
.tech-info-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.2s ease;
  color: var(--color-text-secondary);
  position: relative;
  z-index: 1001;
}

.tech-info-btn:hover {
  background-color: var(--color-bg-secondary);
  color: var(--color-text-primary);
  transform: scale(1.1);
}

.tech-info-btn svg {
  width: 24px;
  height: 24px;
}

/* 技术说明气泡 */
.tech-info-popover {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  width: 800px;
  max-width: 90vw;
  max-height: 85vh;
  background-color: var(--color-bg-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: var(--radius-md);
  z-index: 1000;
  overflow: hidden;
  animation: popoverFadeIn 0.3s ease;
}

.tech-info-content {
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
}

/* 气泡动画 */
@keyframes popoverFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* 滚动条样式 */
.tech-info-content::-webkit-scrollbar {
  width: 6px;
}

.tech-info-content::-webkit-scrollbar-track {
  background: var(--color-bg-secondary);
  border-radius: 3px;
}

.tech-info-content::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.tech-info-content::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
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

.error-message {
  color: #ef4444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-upload-container {
    padding: 1rem;
  }

  .upload-controls .flex {
    flex-direction: column;
  }

  .upload-controls .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }

  .tech-info-popup {
    width: 100%;
  }
}
</style>
