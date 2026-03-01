<template>
  <div class="file-upload-wrapper">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">大文件上传</h1>
        <span class="page-subtitle">支持分片上传、断点续传、Web Worker 优化</span>
      </div>
      <div class="header-right">
        <button class="info-toggle-btn" @click="showTechInfo = !showTechInfo">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>技术说明</span>
        </button>
      </div>
    </div>

    <!-- 技术说明面板 -->
    <transition name="slide-down">
      <div v-if="showTechInfo" class="tech-panel">
        <div class="tech-content">
          <div class="tech-grid">
            <div class="tech-item">
              <div class="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3>分片上传</h3>
              <p>将大文件分割成多个小块逐个上传，降低失败率</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3>断点续传</h3>
              <p>记录已上传分片，支持暂停/恢复，无需重传</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <h3>Web Worker</h3>
              <p>后台线程处理分片和Hash，不阻塞主线程</p>
            </div>
            <div class="tech-item">
              <div class="tech-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3>内存优化</h3>
              <p>延迟创建Blob，智能垃圾回收，避免内存溢出</p>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- 主内容区 - 左右布局 -->
    <div class="main-content">
      <!-- 左侧面板 -->
      <div class="left-panel">
        <!-- 文件选择卡片 -->
        <div class="card file-card">
          <div class="card-header">
            <h2 class="card-title">文件选择</h2>
          </div>
          <div class="card-body">
            <div class="file-dropzone" @click="selectFile" :class="{ 'dragging': isDragging }"
              @dragover.prevent="isDragging = true" @dragleave="isDragging = false" @drop.prevent="handleDrop">
              <input ref="fileInput" type="file" class="hidden" @change="handleFileChange" />
              <div class="dropzone-content">
                <div class="dropzone-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <p class="dropzone-text">点击或拖拽文件到此处</p>
                <p class="dropzone-hint">支持任意类型文件，最大 1.5GB</p>
              </div>
            </div>

            <!-- 文件信息 -->
            <div v-if="file" class="file-details">
              <div class="file-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="file-meta">
                <p class="file-name">{{ fileName }}</p>
                <p class="file-size">{{ fileSize }}</p>
              </div>
              <button class="file-remove" @click="cancelUpload">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Hash 显示 -->
            <div v-if="fileHash" class="hash-info">
              <span class="hash-label">文件Hash:</span>
              <code class="hash-value">{{ fileHash.substring(0, 24) }}...</code>
            </div>
            <div v-if="isCalculatingHash" class="hash-calculating">
              <span class="spinner"></span>
              <span>正在计算文件Hash...</span>
            </div>

            <!-- 错误提示 -->
            <div v-if="errorMessage" class="error-banner">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </div>

        <!-- 上传设置卡片 -->
        <div class="card settings-card">
          <div class="card-header">
            <h2 class="card-title">上传设置</h2>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div class="setting-header">
                <label class="setting-label">分片大小</label>
                <span class="setting-value">{{ chunkSize / (1024 * 1024) }} MB</span>
              </div>
              <input type="range" class="setting-range" v-model.number="chunkSize" :min="1024 * 1024"
                :max="20 * 1024 * 1024" :step="1024 * 1024" :disabled="uploadStatus === 'uploading'" />
              <p class="setting-hint">大文件建议 10-20MB</p>
            </div>

            <div class="setting-item">
              <div class="setting-header">
                <label class="setting-label">并发数</label>
                <span class="setting-value">{{ concurrentCount }} 个</span>
              </div>
              <input type="range" class="setting-range" v-model.number="concurrentCount" :min="1" :max="10" :step="1"
                :disabled="uploadStatus === 'uploading'" />
              <p class="setting-hint">过高可能压垮服务器</p>
            </div>

            <div class="setting-stats">
              <div class="stat-item">
                <span class="stat-label">总分片</span>
                <span class="stat-value">{{ chunks.length || '-' }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">预估内存</span>
                <span class="stat-value">{{ memoryUsage > 0 ? memoryUsage.toFixed(1) + ' MB' : '-' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 控制按钮卡片 -->
        <div class="card control-card">
          <div class="card-body">
            <div class="control-buttons">
              <button class="control-btn primary" @click="startUpload"
                :disabled="!file || uploadStatus === 'uploading' || uploadStatus === 'completed' || isProcessingFile">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>{{ uploadStatus === 'uploading' ? '上传中...' : '开始上传' }}</span>
              </button>
              <button class="control-btn" @click="pauseUpload" :disabled="uploadStatus !== 'uploading'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>暂停</span>
              </button>
              <button class="control-btn" @click="resumeUpload" :disabled="uploadStatus !== 'paused'">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>恢复</span>
              </button>
              <button class="control-btn warning" @click="restartUpload" :disabled="!file">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>重试</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧面板 -->
      <div class="right-panel">
        <!-- 上传状态卡片 -->
        <div class="card status-card">
          <div class="card-header">
            <h2 class="card-title">上传状态</h2>
            <span class="status-badge" :class="uploadStatus">
              {{ { idle: '就绪', uploading: '上传中', paused: '已暂停', completed: '已完成', error: '失败' }[uploadStatus] }}
            </span>
          </div>
          <div class="card-body">
            <!-- 进度环 -->
            <div class="progress-ring-wrapper">
              <svg class="progress-ring" viewBox="0 0 120 120">
                <circle class="progress-ring-bg" cx="60" cy="60" r="52" />
                <circle class="progress-ring-fill" cx="60" cy="60" r="52" :stroke-dasharray="326.7"
                  :stroke-dashoffset="326.7 - (326.7 * uploadProgress / 100)" />
              </svg>
              <div class="progress-ring-text">
                <span class="progress-value">{{ uploadProgress }}</span>
                <span class="progress-unit">%</span>
              </div>
            </div>

            <!-- 状态列表 -->
            <div class="status-list">
              <div class="status-row">
                <span class="status-label">当前分片</span>
                <span class="status-val">{{ currentChunk }} / {{ totalChunks }}</span>
              </div>
              <div class="status-row">
                <span class="status-label">上传速度</span>
                <span class="status-val">{{ uploadSpeed }} KB/s</span>
              </div>
              <div class="status-row">
                <span class="status-label">剩余时间</span>
                <span class="status-val">{{ estimatedTime || '-' }} 秒</span>
              </div>
              <div class="status-row">
                <span class="status-label">已上传</span>
                <span class="status-val">{{ uploadedChunks.size }} / {{ chunks.length }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 内存监控卡片 -->
        <div class="card memory-card">
          <div class="card-header">
            <h2 class="card-title">内存监控</h2>
            <span v-if="memoryHistory.length" class="memory-current">
              {{ ((memoryHistory[memoryHistory.length - 1] || 0) / 1048576).toFixed(1) }} MB
            </span>
          </div>
          <div class="card-body">
            <div class="memory-chart">
              <div class="chart-bars">
                <div v-for="(memory, index) in memoryHistory.slice(-60)" :key="index" class="chart-bar" :style="{
                  height: `${Math.min(100, (memory / 104857600) * 100)}%`
                }"></div>
              </div>
              <div class="chart-axis">
                <span>60秒</span>
                <span>30秒</span>
                <span>现在</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 分片详情卡片 -->
        <div class="card chunks-card">
          <div class="card-header">
            <h2 class="card-title">分片详情</h2>
            <button class="toggle-btn" @click="showChunkDetails = !showChunkDetails" :disabled="!chunks.length">
              {{ showChunkDetails ? '收起' : '展开' }}
            </button>
          </div>
          <div class="card-body" :class="{ expanded: showChunkDetails }">
            <div v-if="chunks.length" class="chunks-visual">
              <div class="chunks-grid">
                <div v-for="chunk in chunks" :key="chunk.index" class="chunk-dot" :class="{
                  'uploaded': chunk.uploaded,
                  'error': chunk.error,
                  'current': chunk.index === currentChunk - 1,
                  'pending': !chunk.uploaded && !chunk.error && chunk.index !== currentChunk - 1
                }" :title="`分片 ${chunk.index + 1}`"></div>
              </div>
              <div class="chunks-legend">
                <span class="legend-item"><span class="dot uploaded"></span>已上传</span>
                <span class="legend-item"><span class="dot pending"></span>待上传</span>
                <span class="legend-item"><span class="dot error"></span>失败</span>
                <span class="legend-item"><span class="dot current"></span>当前</span>
              </div>
            </div>
            <div v-else class="chunks-empty">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <span>选择文件后显示分片信息</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import FileWorker from '@/workers/fileWorker?worker'

// 上传状态类型
type UploadStatus = 'idle' | 'uploading' | 'paused' | 'completed' | 'error'

// 分片信息接口
interface Chunk {
  index: number
  start: number
  end: number
  size: number
  blob?: Blob
  uploaded: boolean
  error: boolean
}

// Worker 消息类型
interface ChunkResult {
  type: 'chunk'
  chunks: Array<{ index: number; start: number; end: number; size: number }>
  totalChunks: number
  chunkSize: number
}

interface HashResult {
  type: 'hash'
  hash: string
  algorithm: string
}

interface ErrorResult {
  type: 'error'
  message: string
}

// 响应式状态
const file = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadStatus = ref<UploadStatus>('idle')
const uploadProgress = ref(0)
const currentChunk = ref(0)
const chunks = ref<Chunk[]>([])
const chunkSize = ref(1024 * 1024 * 5)
const concurrentCount = ref(3)
const uploadedChunks = ref<Set<number>>(new Set())
const uploadSpeed = ref(0)
const estimatedTime = ref(0)
const maxFileSize = ref(1024 * 1024 * 1500)
const errorMessage = ref('')
const showChunkDetails = ref(false)
const memoryUsage = ref(0)
const uploadQueue = ref<Chunk[]>([])
const isProcessingQueue = ref(false)
const showTechInfo = ref(false)
const isProcessingFile = ref(false)
const isCalculatingHash = ref(false)
const fileHash = ref('')
const isDragging = ref(false)

// Web Worker 实例
let fileWorker: Worker | null = null

// 初始化 Worker
const initWorker = () => {
  if (!fileWorker) {
    fileWorker = new FileWorker()
    fileWorker.onmessage = (event: MessageEvent<ChunkResult | HashResult | ErrorResult>) => {
      const data = event.data
      if (data.type === 'chunk') {
        handleChunkResult(data as ChunkResult)
      } else if (data.type === 'hash') {
        handleHashResult(data as HashResult)
      } else if (data.type === 'error') {
        const errorResult = data as ErrorResult
        errorMessage.value = errorResult.message
        isProcessingFile.value = false
        isCalculatingHash.value = false
      }
    }
    fileWorker.onerror = (error) => {
      console.error('Worker error:', error)
      errorMessage.value = '文件处理失败'
      isProcessingFile.value = false
      isCalculatingHash.value = false
    }
  }
}

const terminateWorker = () => {
  if (fileWorker) {
    fileWorker.terminate()
    fileWorker = null
  }
}

const handleChunkResult = (result: ChunkResult) => {
  chunks.value = result.chunks.map(c => ({ ...c, uploaded: false, error: false }))
  uploadQueue.value = [...chunks.value]
  memoryUsage.value = Math.min(chunks.value.length * result.chunkSize / (1024 * 1024), 500)
  isProcessingFile.value = false
}

const handleHashResult = (result: HashResult) => {
  fileHash.value = result.hash
  isCalculatingHash.value = false
}

const splitFileWithWorker = () => {
  if (!file.value || !fileWorker) return
  isProcessingFile.value = true
  fileWorker.postMessage({ type: 'chunk', file: file.value, chunkSize: chunkSize.value })
}

const calculateHashWithWorker = () => {
  if (!file.value || !fileWorker) return
  isCalculatingHash.value = true
  fileWorker.postMessage({ type: 'hash', file: file.value })
}

const serverMock = ref<Set<number>>(new Set())

interface PerformanceWithMemory extends Performance {
  memory: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number }
}

const getPerformanceWithMemory = (): PerformanceWithMemory | null => {
  return 'memory' in performance ? performance as PerformanceWithMemory : null
}

const memoryHistory = ref<number[]>([])
const maxMemoryHistory = 60

const totalChunks = computed(() => file.value ? Math.ceil(file.value.size / chunkSize.value) : 0)
const fileName = computed(() => file.value?.name || '未选择文件')
const fileSize = computed(() => {
  if (!file.value) return '0 B'
  const size = file.value.size
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(2)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const selectedFile = target.files[0]
    if (selectedFile.size > maxFileSize.value) {
      errorMessage.value = `文件大小超过限制（最大 ${maxFileSize.value / (1024 * 1024)}MB）`
      uploadStatus.value = 'error'
      return
    }
    errorMessage.value = ''
    file.value = selectedFile
    fileHash.value = ''
    resetUpload()
    initWorker()
    splitFileWithWorker()
    calculateHashWithWorker()
  }
}

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    const selectedFile = event.dataTransfer.files[0]
    if (selectedFile.size > maxFileSize.value) {
      errorMessage.value = `文件大小超过限制（最大 ${maxFileSize.value / (1024 * 1024)}MB）`
      uploadStatus.value = 'error'
      return
    }
    errorMessage.value = ''
    file.value = selectedFile
    fileHash.value = ''
    resetUpload()
    initWorker()
    splitFileWithWorker()
    calculateHashWithWorker()
  }
}

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
}

const getChunkBlob = (chunk: Chunk): Blob => {
  if (!file.value) throw new Error('No file')
  if (!chunk.blob) chunk.blob = file.value.slice(chunk.start, chunk.end)
  return chunk.blob
}

const uploadChunk = async (chunk: Chunk): Promise<boolean> => {
  try {
    if (serverMock.value.has(chunk.index)) return true
    const blob = getChunkBlob(chunk)
    const delay = Math.min(500, Math.max(100, chunk.size / 1024 / 1024 * 100))
    await new Promise(resolve => setTimeout(resolve, delay))
    chunk.blob = undefined
    serverMock.value.add(chunk.index)
    return true
  } catch (error) {
    console.error('Upload failed:', error)
    return false
  }
}

const processChunk = async (chunk: Chunk, startTime: number): Promise<boolean> => {
  try {
    if (memoryUsage.value > 100) await new Promise(resolve => setTimeout(resolve, 500))
    const success = await uploadChunk(chunk)
    if (success) {
      chunk.uploaded = true
      chunk.error = false
      uploadedChunks.value.add(chunk.index)
      currentChunk.value = chunk.index + 1
      const totalUploaded = Array.from(uploadedChunks.value).reduce((sum, i) => sum + (chunks.value[i]?.size || 0), 0)
      uploadProgress.value = Math.round((totalUploaded / file.value!.size) * 100)
      const elapsed = (Date.now() - startTime) / 1000
      uploadSpeed.value = Math.round(totalUploaded / elapsed / 1024)
      const remaining = file.value!.size - totalUploaded
      estimatedTime.value = Math.round(remaining / Math.max(1, uploadSpeed.value * 1024))
    } else {
      chunk.error = true
    }
    return success
  } catch (error) {
    chunk.error = true
    return false
  }
}

const startUpload = async () => {
  if (!file.value || uploadStatus.value === 'uploading' || isProcessingQueue.value) return
  uploadStatus.value = 'uploading'
  errorMessage.value = ''
  isProcessingQueue.value = true
  const startTime = Date.now()
  try {
    const queue = uploadQueue.value.filter(c => !uploadedChunks.value.has(c.index) && !c.error)
    while (queue.length > 0 && uploadStatus.value === 'uploading') {
      const batch = queue.splice(0, concurrentCount.value)
      const results = await Promise.all(batch.map(c => processChunk(c, startTime)))
      if (!results.every(r => r)) throw new Error('Batch failed')
      await new Promise(resolve => setTimeout(resolve, 100))
    }
    if (uploadStatus.value === 'uploading' && uploadProgress.value === 100) {
      uploadStatus.value = 'completed'
    }
  } catch (error: any) {
    errorMessage.value = error.message || '上传失败'
    uploadStatus.value = 'error'
  } finally {
    isProcessingQueue.value = false
  }
}

const pauseUpload = () => { if (uploadStatus.value === 'uploading') uploadStatus.value = 'paused' }
const resumeUpload = () => { if (uploadStatus.value === 'paused') startUpload() }
const restartUpload = () => { resetUpload(); if (file.value) { splitFileWithWorker(); calculateHashWithWorker() } }
const selectFile = () => fileInput.value?.click()
const cancelUpload = () => { resetUpload(); file.value = null; terminateWorker() }

let memoryMonitorInterval: number | null = null

watch(chunkSize, () => {
  if (file.value && uploadStatus.value === 'idle' && !isProcessingFile.value) splitFileWithWorker()
}, { immediate: false })

onMounted(() => {
  memoryMonitorInterval = window.setInterval(() => {
    const perf = getPerformanceWithMemory()
    if (perf) {
      memoryHistory.value.push(perf.memory.usedJSHeapSize)
      if (memoryHistory.value.length > maxMemoryHistory) memoryHistory.value.shift()
    }
  }, 1000)
})

onUnmounted(() => {
  if (memoryMonitorInterval) clearInterval(memoryMonitorInterval)
  terminateWorker()
})
</script>

<style scoped>
/* 页面容器 */
.file-upload-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

.info-toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.info-toggle-btn:hover {
  background: var(--bg-tertiary);
  color: var(--color-text-primary);
}

.info-toggle-btn .icon {
  width: 18px;
  height: 18px;
}

/* 技术说明面板 */
.tech-panel {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: var(--radius-lg);
  padding: 16px;
  margin-bottom: 24px;
  box-shadow: var(--shadow-lg);
}

.tech-content {
  color: white;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.tech-item {
  text-align: center;
}

.tech-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tech-icon svg {
  width: 24px;
  height: 24px;
}

.tech-item h3 {
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 6px;
}

.tech-item p {
  font-size: 12px;
  opacity: 0.85;
  margin: 0;
  line-height: 1.4;
}

/* 主内容区 */
.main-content {
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 16px;
}

/* 卡片通用样式 */
.card {
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.card-body {
  padding: 16px;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 文件选择卡片 */
.file-dropzone {
  border: 2px dashed var(--color-border);
  border-radius: var(--radius-md);
  padding: 32px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
}

.file-dropzone:hover,
.file-dropzone.dragging {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.04);
}

.dropzone-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto 12px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dropzone-icon svg {
  width: 28px;
  height: 28px;
  color: var(--text-secondary);
}

.dropzone-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin: 0 0 4px;
}

.dropzone-hint {
  font-size: 12px;
  color: var(--text-secondary);
  margin: 0;
}

/* 文件详情 */
.file-details {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-top: 16px;
}

.file-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.file-icon svg {
  width: 20px;
  height: 20px;
  color: white;
}

.file-meta {
  flex: 1;
  min-width: 0;
}

.file-meta .file-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta .file-size {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 2px;
}

.file-remove {
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.file-remove:hover {
  background: var(--error);
  color: white;
}

.file-remove svg {
  width: 16px;
  height: 16px;
}

/* Hash 信息 */
.hash-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 12px;
}

.hash-label {
  color: var(--text-secondary);
}

.hash-value {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 11px;
  background: var(--bg-tertiary);
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-text-primary);
}

.hash-calculating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  font-size: 12px;
  color: var(--color-primary);
}

.spinner {
  width: 14px;
  height: 14px;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 错误提示 */
.error-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  margin-top: 12px;
  font-size: 13px;
  color: var(--error);
}

.error-banner svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

/* 设置卡片 */
.setting-item {
  margin-bottom: 20px;
}

.setting-item:last-child {
  margin-bottom: 0;
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.setting-label {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.setting-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.setting-range {
  width: 100%;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--bg-tertiary);
  border-radius: 3px;
  outline: none;
}

.setting-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  background: var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.setting-range::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}

.setting-range:disabled {
  opacity: 0.5;
}

.setting-hint {
  font-size: 11px;
  color: var(--text-secondary);
  margin-top: 6px;
}

.setting-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--color-border);
  margin-top: 16px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-label {
  font-size: 11px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 控制按钮 */
.control-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.control-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all 0.2s;
}

.control-btn:hover:not(:disabled) {
  background: var(--bg-tertiary);
  border-color: var(--text-secondary);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn svg {
  width: 18px;
  height: 18px;
}

.control-btn.primary {
  grid-column: span 2;
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.control-btn.primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.control-btn.warning {
  border-color: var(--warning);
  color: var(--warning);
}

.control-btn.warning:hover:not(:disabled) {
  background: rgba(245, 158, 11, 0.1);
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.idle {
  background: rgba(255, 255, 255, 0.2);
}

.status-badge.uploading {
  background: rgba(255, 255, 255, 0.3);
  animation: pulse 1.5s infinite;
}

.status-badge.paused {
  background: rgba(245, 158, 11, 0.3);
}

.status-badge.completed {
  background: rgba(16, 185, 129, 0.3);
}

.status-badge.error {
  background: rgba(239, 68, 68, 0.3);
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

/* 进度环 */
.progress-ring-wrapper {
  position: relative;
  width: 140px;
  height: 140px;
  margin: 0 auto 20px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: var(--bg-tertiary);
  stroke-width: 8;
}

.progress-ring-fill {
  fill: none;
  stroke: var(--color-primary);
  stroke-width: 8;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.3s ease;
}

.progress-ring-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.progress-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.progress-unit {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 状态列表 */
.status-list {
  display: grid;
  gap: 10px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.status-row:last-child {
  border-bottom: none;
}

.status-label {
  font-size: 13px;
  color: var(--text-secondary);
}

.status-val {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 内存监控 */
.memory-card .card-header,
.chunks-card .card-header {
  background: var(--bg-secondary);
}

.memory-current {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
}

.memory-chart {
  height: 100px;
}

.chart-bars {
  height: 80px;
  display: flex;
  align-items: flex-end;
  gap: 2px;
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, var(--color-primary), var(--color-primary-hover));
  border-radius: 2px 2px 0 0;
  min-height: 2px;
  transition: height 0.3s ease;
}

.chart-axis {
  display: flex;
  justify-content: space-between;
  padding-top: 6px;
  font-size: 10px;
  color: var(--text-secondary);
}

/* 分片详情 */
.toggle-btn {
  padding: 4px 12px;
  border: 1px solid var(--color-border);
  background: var(--bg-primar);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.toggle-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.toggle-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chunks-card .card-body {
  max-height: 120px;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.chunks-card .card-body.expanded {
  max-height: 300px;
  overflow-y: auto;
}

.chunks-visual {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.chunks-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.chunk-dot {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  transition: all 0.2s;
}

.chunk-dot.uploaded {
  background: var(--success);
}

.chunk-dot.pending {
  background: var(--bg-tertiary);
}

.chunk-dot.error {
  background: var(--error);
}

.chunk-dot.current {
  background: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary);
  animation: blink 0.8s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.chunks-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
}

.legend-item .dot {
  width: 8px;
  height: 8px;
  border-radius: 2px;
}

.legend-item .dot.uploaded {
  background: var(--success);
}

.legend-item .dot.pending {
  background: var(--bg-tertiary);
}

.legend-item .dot.error {
  background: var(--error);
}

.legend-item .dot.current {
  background: var(--color-primary);
}

.chunks-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  color: var(--text-secondary);
}

.chunks-empty svg {
  width: 32px;
  height: 32px;
  opacity: 0.5;
}

.chunks-empty span {
  font-size: 12px;
}

/* 过渡动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式 */
@media (max-width: 1024px) {
  .main-content {
    grid-template-columns: 1fr;
  }

  .tech-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .file-upload-wrapper {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .tech-grid {
    grid-template-columns: 1fr;
  }

  .control-buttons {
    grid-template-columns: 1fr;
  }

  .control-btn.primary {
    grid-column: span 1;
  }
}
</style>
