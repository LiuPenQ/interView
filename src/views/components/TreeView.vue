<!--
企业级人员树可视化页面
用途：模拟企业级组织架构的人员树展示，实现可视化渲染和交互功能
实现：使用Vue 3 Composition API和Element Plus的Tree组件，局部引入所需组件
功能：
- 展示多层级的企业组织架构
- 支持节点展开/折叠
- 支持节点选择
- 显示节点详情信息
- 搜索和筛选功能
- 性能优化
-->
<template>
  <div class="tree-view-container p-6">
    <h1 class="text-xl font-bold mb-6">企业级人员树可视化</h1>
    
    <div class="mb-4">
      <h2 class="text-lg font-semibold mb-2">功能说明</h2>
      <p>本页面使用Element Plus的Tree组件模拟企业级组织架构的人员树展示，支持多层级数据的可视化渲染和交互操作。</p>
      <p>通过局部引入Element Plus组件，避免了全局引入带来的包体积增大问题。</p>
    </div>
    
    <div class="mb-4">
      <el-input
        v-model="searchText"
        placeholder="搜索人员或部门"
        prefix-icon="el-icon-search"
        clearable
        @input="handleSearch"
      />
    </div>
    
    <div class="flex gap-6">
      <!-- 人员树 -->
      <div class="tree-section" style="flex: 1;">
        <h3 class="text-base font-semibold mb-3">组织架构</h3>
        <el-tree
          ref="treeRef"
          :data="filteredTreeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          node-key="id"
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
          :load="loadNode"
          lazy
          show-checkbox
          style="height: 600px; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto;"
        >
          <template #default="{ node, data }">
            <div class="tree-node" :class="{
              'department-node': data.type === 'department',
              'person-node': data.type === 'person'
            }">
              <span v-if="data.type === 'department'" class="node-icon">🏢</span>
              <span v-else class="node-icon">👤</span>
              <span>{{ node.label }}</span>
              <span v-if="data.type === 'department' && data.count" class="node-count">({{ data.count }})</span>
            </div>
          </template>
        </el-tree>
      </div>
      
      <!-- 人员列表 -->
      <div class="persons-section" style="width: 300px;">
        <h3 class="text-base font-semibold mb-3">人员列表</h3>
        <div class="persons-list" style="height: 600px; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: auto;">
          <div v-if="loadingPersons" class="loading-state" style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <el-icon class="is-loading"><i class="el-icon-loading"></i></el-icon>
            <span style="margin-left: 8px;">加载中...</span>
          </div>
          <div v-else-if="personsList.length === 0" class="empty-state" style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <el-empty description="暂无人员数据" />
          </div>
          <div v-else class="person-items">
            <div 
              v-for="person in personsList" 
              :key="person.id" 
              class="person-item"
              @click="selectPersonInTree(person)"
            >
              <div class="person-name">{{ person.name }}</div>
              <div class="person-position">{{ person.position }}</div>
              <div class="person-dept">{{ getParentDepartment(person) }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 节点详情 -->
      <div class="detail-section" style="width: 300px;">
        <h3 class="text-base font-semibold mb-3">详情信息</h3>
        <div v-if="selectedNode" class="node-detail">
          <el-card :body-style="{ padding: '16px' }">
            <template #header>
              <div class="card-header">
                <span>{{ selectedNode.name }}</span>
                <el-tag :type="selectedNode.type === 'department' ? 'primary' : 'success'" size="small">
                  {{ selectedNode.type === 'department' ? '部门' : '人员' }}
                </el-tag>
              </div>
            </template>
            
            <div v-if="selectedNode.type === 'department'" class="department-info">
              <p><strong>部门ID:</strong> {{ selectedNode.id }}</p>
              <p><strong>部门名称:</strong> {{ selectedNode.name }}</p>
              <p><strong>人员数量:</strong> {{ selectedNode.count || 0 }}</p>
              <p><strong>部门层级:</strong> {{ getNodeLevel(selectedNode) }}</p>
            </div>
            
            <div v-else class="person-info">
              <p><strong>员工ID:</strong> {{ selectedNode.id }}</p>
              <p><strong>姓名:</strong> {{ selectedNode.name }}</p>
              <p><strong>职位:</strong> {{ selectedNode.position }}</p>
              <p><strong>邮箱:</strong> {{ selectedNode.email }}</p>
              <p><strong>电话:</strong> {{ selectedNode.phone }}</p>
              <p><strong>所属部门:</strong> {{ getParentDepartment(selectedNode) }}</p>
            </div>
          </el-card>
        </div>
        
        <div v-else class="empty-detail">
          <el-empty description="请选择一个节点查看详情" />
        </div>
      </div>
    </div>
    
    <!-- 性能指标 -->
    <div class="performance-metrics mt-6">
      <h3 class="text-base font-semibold mb-3">性能指标</h3>
      <div class="metrics-grid">
        <div class="metric-item">
          <span class="metric-label">总节点数:</span>
          <span class="metric-value">{{ totalNodesCount }} 个</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">部门数:</span>
          <span class="metric-value">{{ departmentCount }} 个</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">人员数:</span>
          <span class="metric-value">{{ personCount }} 个</span>
        </div>
        <div class="metric-item">
          <span class="metric-label">最大层级:</span>
          <span class="metric-value">{{ maxLevel }} 层</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElTree, ElInput, ElTag, ElCard, ElEmpty, ElIcon } from 'element-plus'


// 节点类型定义（添加isLeaf属性支持懒加载）
interface TreeNode {
  id: string
  name: string
  type: 'department' | 'person'
  children?: TreeNode[]
  isLeaf?: boolean
  count?: number // 部门人数
  position?: string // 职位
  email?: string // 邮箱
  phone?: string // 电话
}

// 树配置
const treeRef = ref()
const defaultProps = {
  children: 'children',
  label: 'name'
}

// 状态管理
const treeData = ref<TreeNode[]>([])
const filteredTreeData = ref<TreeNode[]>([])
const selectedNode = ref<TreeNode | null>(null)
const searchText = ref('')
const personsList = ref<TreeNode[]>([])
const loadingPersons = ref(false)

// 模拟生成企业级人员树数据（懒加载模式）
const generateTreeData = (): TreeNode[] => {
  // 根节点 - 公司（懒加载模式下，初始只返回根节点，不包含子节点）
  const company: TreeNode = {
    id: 'company-1',
    name: '科技有限公司',
    type: 'department',
    isLeaf: false, // 非叶子节点，可展开
    count: 0 // 后续会计算
  }
  
  return [company]
}

// 懒加载节点数据
const loadNode = (node: any, resolve: (data: TreeNode[]) => void) => {
  // 模拟异步加载
  setTimeout(() => {
    if (node.level === 0) {
      // 加载一级部门
      const departments: TreeNode[] = [
        {
          id: 'dept-1',
          name: '技术部',
          type: 'department',
          isLeaf: false,
          count: 0
        },
        {
          id: 'dept-2',
          name: '产品部',
          type: 'department',
          isLeaf: false,
          count: 0
        },
        {
          id: 'dept-3',
          name: '设计部',
          type: 'department',
          isLeaf: false,
          count: 0
        },
        {
          id: 'dept-4',
          name: '市场部',
          type: 'department',
          isLeaf: false,
          count: 0
        },
        {
          id: 'dept-5',
          name: '人力资源部',
          type: 'department',
          isLeaf: false,
          count: 0
        }
      ]
      resolve(departments)
    } else if (node.level === 1) {
      // 加载子部门
      const deptId = node.data.id
      const deptName = node.data.name
      const index = parseInt(deptId.split('-')[1], 10)
      
      const subDepts: TreeNode[] = [
        {
          id: `subdept-${index}-1`,
          name: `${deptName}一组`,
          type: 'department',
          isLeaf: false,
          count: 0
        },
        {
          id: `subdept-${index}-2`,
          name: `${deptName}二组`,
          type: 'department',
          isLeaf: false,
          count: 0
        }
      ]
      resolve(subDepts)
    } else if (node.level === 2) {
      // 加载人员
      const subDeptId = node.data.id
      const deptIndex = parseInt(subDeptId.split('-')[1], 10)
      const subIndex = parseInt(subDeptId.split('-')[2], 10)
      const deptNames = ['技术部', '产品部', '设计部', '市场部', '人力资源部']
      const deptName = deptNames[deptIndex]
      
      // 为每个子部门生成10-15个人员
      const personCount = Math.floor(Math.random() * 6) + 10
      const persons: TreeNode[] = []
      
      for (let i = 0; i < personCount; i++) {
        persons.push({
          id: `person-${deptIndex}-${subIndex}-${i}`,
          name: `员工${deptIndex}${subIndex}${i}`,
          type: 'person',
          isLeaf: true, // 人员是叶子节点
          position: getRandomPosition(deptName || ''),
          email: `employee${deptIndex}${subIndex}${i}@example.com`,
          phone: `138${Math.floor(Math.random() * 100000000)}`
        })
      }
      
      // 更新父部门的人员数量
      node.parent.data.count = persons.length
      
      resolve(persons)
    }
  }, 300) // 模拟网络延迟
}

// 获取随机职位
const getRandomPosition = (deptName: string): string => {
  const positionsMap: Record<string, string[]> = {
    '技术部': ['高级工程师', '工程师', '初级工程师', '技术主管', '架构师'],
    '产品部': ['产品经理', '产品助理', '用户研究员', '数据分析师'],
    '设计部': ['UI设计师', 'UX设计师', '视觉设计师', '动效设计师'],
    '市场部': ['市场经理', '市场专员', '品牌策划', '活动运营'],
    '人力资源部': ['HR经理', '招聘专员', '培训专员', '薪资福利专员']
  }
  
  const positions = positionsMap[deptName] || ['员工']
  const randomIndex = Math.floor(Math.random() * positions.length)
  return positions[randomIndex] || '员工'
}

// 处理节点点击
const handleNodeClick = (data: TreeNode) => {
  selectedNode.value = data
}

// 处理节点选择
const handleCheckChange = (data: TreeNode, checked: boolean, indeterminate: boolean) => {
  console.log('Check change:', data, checked, indeterminate)
}

// 处理搜索
const handleSearch = () => {
  if (!searchText.value) {
    filteredTreeData.value = treeData.value
    return
  }
  
  const searchTerm = searchText.value.toLowerCase()
  const filterTree = (nodes: TreeNode[]): TreeNode[] => {
    return nodes
      .map(node => {
        const newNode = { ...node }
        if (newNode.children) {
          const filteredChildren = filterTree(newNode.children)
          if (filteredChildren.length > 0 || newNode.name.toLowerCase().includes(searchTerm)) {
            newNode.children = filteredChildren
            return newNode
          }
        } else if (newNode.name.toLowerCase().includes(searchTerm)) {
          return newNode
        }
        return null
      })
      .filter((node): node is TreeNode => node !== null)
  }
  
  filteredTreeData.value = filterTree(treeData.value)
}

// 获取节点层级
const getNodeLevel = (node: TreeNode): number => {
  let level = 1
  let current = node
  
  // 简单实现，实际项目中可能需要通过遍历树来确定层级
  while (current.id.includes('-')) {
    level++
    break // 简化实现，实际项目中需要递归查找父节点
  }
  
  return level
}

// 获取父部门名称
const getParentDepartment = (node: TreeNode): string => {
  // 简化实现，实际项目中需要通过遍历树来确定父部门
  if (node.id.includes('-')) {
    const parts = node.id.split('-')
    if (parts.length >= 3 && parts[1]) {
      const deptIndex = parseInt(parts[1], 10)
      const depts = ['技术部', '产品部', '设计部', '市场部', '人力资源部']
      return depts[deptIndex] || '未知部门'
    }
  }
  return '未知部门'
}

// 计算性能指标
const totalNodesCount = computed(() => {
  const countNodes = (nodes: TreeNode[]): number => {
    return nodes.reduce((count, node) => {
      const childrenCount = node.children ? countNodes(node.children) : 0
      return count + 1 + childrenCount
    }, 0)
  }
  return countNodes(treeData.value)
})

const departmentCount = computed(() => {
  const countDepartments = (nodes: TreeNode[]): number => {
    return nodes.reduce((count, node) => {
      const childrenCount = node.children ? countDepartments(node.children) : 0
      return count + (node.type === 'department' ? 1 : 0) + childrenCount
    }, 0)
  }
  return countDepartments(treeData.value)
})

const personCount = computed(() => {
  const countPersons = (nodes: TreeNode[]): number => {
    return nodes.reduce((count, node) => {
      const childrenCount = node.children ? countPersons(node.children) : 0
      return count + (node.type === 'person' ? 1 : 0) + childrenCount
    }, 0)
  }
  return countPersons(treeData.value)
})

const maxLevel = computed(() => {
  const getLevel = (nodes: TreeNode[], currentLevel: number): number => {
    if (!nodes || nodes.length === 0) {
      return currentLevel
    }
    
    return Math.max(...nodes.map(node => {
      if (node.children && node.children.length > 0) {
        return getLevel(node.children, currentLevel + 1)
      }
      return currentLevel + 1
    }))
  }
  
  return getLevel(treeData.value, 0)
})

// 生成人员列表
const generatePersonsList = () => {
  loadingPersons.value = true
  // 模拟异步加载人员列表
  setTimeout(() => {
    const persons: TreeNode[] = []
    const deptNames = ['技术部', '产品部', '设计部', '市场部', '人力资源部']
    
    // 为每个部门生成人员
    for (let deptIndex = 0; deptIndex < 5; deptIndex++) {
      for (let subIndex = 0; subIndex < 2; subIndex++) {
        // 每个子部门生成10-15个人员
        const personCount = Math.floor(Math.random() * 6) + 10
        for (let i = 0; i < personCount; i++) {
          persons.push({
            id: `person-${deptIndex}-${subIndex}-${i}`,
            name: `员工${deptIndex}${subIndex}${i}`,
            type: 'person',
            isLeaf: true,
            position: getRandomPosition(deptNames[deptIndex] || ''),
            email: `employee${deptIndex}${subIndex}${i}@example.com`,
            phone: `138${Math.floor(Math.random() * 100000000)}`
          })
        }
      }
    }
    
    personsList.value = persons
    loadingPersons.value = false
  }, 500)
}

// 点击人员列表中的人员，在树中选中并展开所有父级
const selectPersonInTree = (person: TreeNode) => {
  if (!treeRef.value) return
  
  // 解析人员ID，获取部门信息
  const parts = person.id.split('-')
  if (parts.length < 4) return
  
  const deptIndex = parts[1]
  const subIndex = parts[2]
  
  // 构建父级节点ID路径
  const companyId = 'company-1'
  const deptId = `dept-${deptIndex}`
  const subDeptId = `subdept-${deptIndex}-${subIndex}`
  const personId = person.id
  
  // 展开所有父级节点并选中人员
  const expandAndSelect = async () => {
    try {
      // 1. 确保树已经初始化
      if (!treeRef.value) return
      
      // 2. 展开根节点（公司）
      const expandRoot = () => {
        return new Promise<void>((resolve) => {
          const rootNode = treeRef.value!.getNode(companyId)
          if (rootNode) {
            if (!rootNode.expanded) {
              rootNode.expanded = true
              // 等待根节点展开和数据加载
              setTimeout(resolve, 800)
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
      }
      
      // 3. 展开一级部门
      const expandDepartment = () => {
        return new Promise<void>((resolve) => {
          const deptNode = treeRef.value!.getNode(deptId)
          if (deptNode) {
            if (!deptNode.expanded) {
              deptNode.expanded = true
              // 等待部门节点展开和数据加载
              setTimeout(resolve, 800)
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
      }
      
      // 4. 展开子部门
      const expandSubDepartment = () => {
        return new Promise<void>((resolve) => {
          const subDeptNode = treeRef.value!.getNode(subDeptId)
          if (subDeptNode) {
            if (!subDeptNode.expanded) {
              subDeptNode.expanded = true
              // 等待子部门节点展开和数据加载
              setTimeout(resolve, 800)
            } else {
              resolve()
            }
          } else {
            resolve()
          }
        })
      }
      
      // 5. 按顺序执行展开操作
      await expandRoot()
      await expandDepartment()
      await expandSubDepartment()
      
      // 6. 选中人员节点
      if (treeRef.value) {
        // 选中人员节点
        treeRef.value.setCurrentKey(personId)
        
        // 滚动到选中的节点
        const personNode = treeRef.value.getNode(personId)
        if (personNode) {
          // 尝试滚动到节点
          try {
            // 对于Element Plus的Tree组件，滚动到节点的方法可能不同
            // 这里使用一种通用的方法，通过操作DOM来实现滚动
            const nodeElement = document.querySelector(`[data-node-key="${personId}"]`)
            if (nodeElement) {
              nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }
          } catch (scrollError) {
            console.error('滚动到节点失败:', scrollError)
          }
        }
      }
      
      // 7. 设置选中节点
      selectedNode.value = person
    } catch (error) {
      console.error('展开并选中节点失败:', error)
      // 即使出错，也设置选中节点，确保详情显示
      selectedNode.value = person
    }
  }
  
  expandAndSelect()
}

// 展开指定节点
const expandNode = (nodeId: string): Promise<void> => {
  return new Promise((resolve) => {
    if (treeRef.value) {
      try {
        // 尝试展开节点
        // 对于懒加载的树，使用setExpanded方法
        const node = treeRef.value.getNode(nodeId)
        if (node) {
          node.expanded = true
        }
        // 延迟一下，确保节点展开完成
        setTimeout(resolve, 400)
      } catch (error) {
        console.error('展开节点失败:', error)
        resolve()
      }
    } else {
      resolve()
    }
  })
}

// 初始化
onMounted(() => {
  treeData.value = generateTreeData()
  filteredTreeData.value = treeData.value
  // 生成人员列表
  generatePersonsList()
})

// 优化可视化渲染 - 添加加载动画和节点样式
</script>

<style scoped>
.tree-view-container {
  width: 100%;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.tree-node:hover {
  background-color: rgba(0, 122, 255, 0.1);
}

.node-count {
  font-size: 12px;
  color: var(--color-text-tertiary);
  background-color: rgba(0, 0, 0, 0.05);
  padding: 2px 6px;
  border-radius: 10px;
}

.node-icon {
  font-size: 14px;
  margin-right: 6px;
  width: 16px;
  text-align: center;
}

/* 节点图标样式 */
.el-tree-node__content {
  height: 36px;
  align-items: center;
}

.el-tree-node.is-current > .el-tree-node__content {
  background-color: rgba(0, 122, 255, 0.15);
}

.el-tree-node.is-selected > .el-tree-node__content {
  background-color: rgba(0, 122, 255, 0.2);
}

/* 加载动画样式 */
.el-tree-node__loading-icon {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 部门和人员节点的不同样式 */
.tree-node.department-node {
  font-weight: 500;
}

.tree-node.person-node {
  font-size: 14px;
}

/* 人员列表样式 */
.person-items {
  padding: 8px;
}

.person-item {
  padding: 12px;
  margin-bottom: 8px;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s ease;
}

.person-item:hover {
  background-color: rgba(0, 122, 255, 0.1);
  border-color: var(--color-primary);
}

.person-name {
  font-weight: 500;
  font-size: 14px;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.person-position {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 2px;
}

.person-dept {
  font-size: 11px;
  color: var(--color-text-tertiary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.department-info,
.person-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.performance-metrics {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
}

.metric-label {
  color: var(--color-text-secondary);
}

.metric-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-detail {
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-bg-secondary);
  border-radius: var(--radius-md);
}
</style>