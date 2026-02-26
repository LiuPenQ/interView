<template>
    <div class="word-container">
        <div class="coding-section">
            <div class="coding-layout">
                <div class="problem-list">
                    <h3>题目列表</h3>
                    <div v-for="problem in codingProblems" :key="problem.id" class="problem-item"
                        :class="{ active: selectedProblemId === problem.id }" @click="selectProblem(problem.id)">
                        <h4>{{ problem.title }}</h4>
                        <p class="problem-difficulty" :class="`difficulty-${problem.difficulty}`">
                            {{ problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难' }}
                        </p>
                    </div>
                </div>

                <div class="editor-section" v-if="selectedProblem">
                    <div class="problem-info">
                        <h3>{{ selectedProblem.title }}</h3>
                        <p class="problem-description">{{ selectedProblem.description }}</p>
                        <p class="problem-input" v-if="selectedProblem.input">输入：{{ selectedProblem.input }}</p>
                        <p class="problem-output" v-if="selectedProblem.output">输出：{{ selectedProblem.output }}</p>
                    </div>
                    <div class="editor-container">
                        <textarea v-model="codeEditorContent" class="code-editor" placeholder="请在此输入代码..."
                            rows="15"></textarea>
                        <div class="editor-actions">
                            <button class="btn btn-primary" @click="submitCode">提交代码</button>
                            <button class="btn btn-secondary" @click="resetCode">重置</button>
                        </div>
                    </div>
                    <div class="code-result" v-if="codeResult">
                        <h4>运行结果：</h4>
                        <pre>{{ codeResult }}</pre>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface CodingProblem {
    id: number
    title: string
    description: string
    input?: string
    output?: string
    difficulty: 'easy' | 'medium' | 'hard'
    initialCode?: string
}

const codingProblems = ref<CodingProblem[]>([])
const selectedProblemId = ref<number | null>(null)
const codeEditorContent = ref('')
const codeResult = ref<string | null>(null)

const selectedProblem = computed(() => {
    return codingProblems.value.find(p => p.id === selectedProblemId.value) || null
})

const selectProblem = (id: number) => {
    selectedProblemId.value = id
    const problem = codingProblems.value.find(p => p.id === id)
    codeEditorContent.value = problem?.initialCode || ''
    codeResult.value = null
}

const submitCode = () => {
    if (!selectedProblem.value) return

    setTimeout(() => {
        if (selectedProblem.value) {
            codeResult.value = `代码运行成功！\n输入：${selectedProblem.value.input || '无'}\n输出：${selectedProblem.value.output || '无'}\n你的代码：${codeEditorContent.value}`
        }
    }, 500)
}

const resetCode = () => {
    if (selectedProblem.value) {
        codeEditorContent.value = selectedProblem.value.initialCode || ''
    }
    codeResult.value = null
}

onMounted(() => {
    codingProblems.value = [
        {
            id: 1,
            title: '防抖（带立即执行选项）',
            description: '实现一个防抖函数，支持立即执行选项。',
            input: 'function debounce(func, wait, immediate) {\n  // 请在此实现代码\n}',
            output: '返回一个防抖处理后的函数',
            difficulty: 'easy',
            initialCode: 'function debounce(func, wait, immediate) {\n  let timeout;\n  return function() {\n    const context = this;\n    const args = arguments;\n    // 请在此实现代码\n  };\n}'
        },
        {
            id: 2,
            title: '节流（时间戳版 + 定时器版）',
            description: '实现节流函数，包括时间戳版和定时器版。',
            input: '// 时间戳版\nfunction throttle1(func, wait) {\n  // 请在此实现代码\n}\n\n// 定时器版\nfunction throttle2(func, wait) {\n  // 请在此实现代码\n}',
            output: '返回一个节流处理后的函数',
            difficulty: 'easy',
            initialCode: '// 时间戳版\nfunction throttle1(func, wait) {\n  let previous = 0;\n  return function() {\n    const now = Date.now();\n    const context = this;\n    const args = arguments;\n    // 请在此实现代码\n  };\n}\n\n// 定时器版\nfunction throttle2(func, wait) {\n  let timeout;\n  return function() {\n    const context = this;\n    const args = arguments;\n    // 请在此实现代码\n  };\n}'
        },
        {
            id: 3,
            title: '深拷贝（考虑循环引用）',
            description: '实现一个深拷贝函数，考虑循环引用的情况。',
            input: 'function deepClone(obj) {\n  // 请在此实现代码\n}',
            output: '返回一个深拷贝后的对象',
            difficulty: 'medium',
            initialCode: 'function deepClone(obj, map = new Map()) {\n  // 请在此实现代码\n}'
        },
        {
            id: 4,
            title: 'Promise.all（手写）',
            description: '手写实现Promise.all方法。',
            input: 'function promiseAll(promises) {\n  // 请在此实现代码\n}',
            output: '返回一个Promise，当所有输入Promise都解决时解决',
            difficulty: 'medium',
            initialCode: 'function promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    // 请在此实现代码\n  });\n}'
        },
        {
            id: 5,
            title: '数组扁平化（递归 + reduce）',
            description: '实现数组扁平化，使用递归和reduce两种方法。',
            input: '// 递归法\nfunction flatten1(arr) {\n  // 请在此实现代码\n}\n\n// reduce法\nfunction flatten2(arr) {\n  // 请在此实现代码\n}',
            output: '返回一个扁平化后的数组',
            difficulty: 'easy',
            initialCode: '// 递归法\nfunction flatten1(arr) {\n  // 请在此实现代码\n}\n\n// reduce法\nfunction flatten2(arr) {\n  // 请在此实现代码\n}'
        },
        {
            id: 6,
            title: '数组去重（Set + reduce + 对象）',
            description: '实现数组去重，使用Set、reduce和对象三种方法。',
            input: '// Set法\nfunction unique1(arr) {\n  // 请在此实现代码\n}\n\n// reduce法\nfunction unique2(arr) {\n  // 请在此实现代码\n}\n\n// 对象法\nfunction unique3(arr) {\n  // 请在此实现代码\n}',
            output: '返回一个去重后的数组',
            difficulty: 'easy',
            initialCode: '// Set法\nfunction unique1(arr) {\n  // 请在此实现代码\n}\n\n// reduce法\nfunction unique2(arr) {\n  // 请在此实现代码\n}\n\n// 对象法\nfunction unique3(arr) {\n  // 请在此实现代码\n}'
        },
        {
            id: 7,
            title: '类型判断（typeof + instanceof + Object.prototype.toString）',
            description: '实现一个更准确的类型判断函数。',
            input: 'function getType(value) {\n  // 请在此实现代码\n}',
            output: '返回值的具体类型字符串',
            difficulty: 'easy',
            initialCode: 'function getType(value) {\n  // 请在此实现代码\n}'
        },
        {
            id: 8,
            title: '事件总线（Event Bus，on/emit/off）',
            description: '实现一个事件总线，支持on、emit、off方法。',
            input: 'class EventBus {\n  constructor() {\n    // 请在此实现代码\n  }\n  \n  on(event, callback) {\n    // 请在此实现代码\n  }\n  \n  emit(event, ...args) {\n    // 请在此实现代码\n  }\n  \n  off(event, callback) {\n    // 请在此实现代码\n  }\n}',
            output: '返回一个事件总线实例',
            difficulty: 'easy',
            initialCode: 'class EventBus {\n  constructor() {\n    // 请在此实现代码\n  }\n  \n  on(event, callback) {\n    // 请在此实现代码\n  }\n  \n  emit(event, ...args) {\n    // 请在此实现代码\n  }\n  \n  off(event, callback) {\n    // 请在此实现代码\n  }\n}'
        },
        {
            id: 9,
            title: '柯里化（sum(1)(2)(3)）',
            description: '实现一个柯里化函数，支持sum(1)(2)(3)的调用方式。',
            input: 'function curry(func) {\n  // 请在此实现代码\n}\n\n// 测试\nconst sum = curry((a, b, c) => a + b + c);\nsum(1)(2)(3); // 6',
            output: '返回一个柯里化后的函数',
            difficulty: 'medium',
            initialCode: 'function curry(func) {\n  // 请在此实现代码\n}\n\n// 测试\nconst sum = curry((a, b, c) => a + b + c);\nsum(1)(2)(3); // 6'
        },
        {
            id: 10,
            title: '寄生组合继承（ES5）',
            description: '使用ES5实现寄生组合继承。',
            input: '// 父类\nfunction Parent(name) {\n  this.name = name;\n}\n\nParent.prototype.sayName = function() {\n  console.log(this.name);\n};\n\n// 子类\nfunction Child(name, age) {\n  Parent.call(this, name);\n  this.age = age;\n}\n\n// 请实现寄生组合继承\n// 使Child继承Parent的原型方法',
            output: 'Child继承Parent的属性和方法',
            difficulty: 'medium',
            initialCode: '// 父类\nfunction Parent(name) {\n  this.name = name;\n}\n\nParent.prototype.sayName = function() {\n  console.log(this.name);\n};\n\n// 子类\nfunction Child(name, age) {\n  Parent.call(this, name);\n  this.age = age;\n}\n\n// 请实现寄生组合继承\n// 使Child继承Parent的原型方法'
        }
    ]

    if (codingProblems.value.length > 0 && codingProblems.value[0]) {
        selectProblem(codingProblems.value[0].id)
    }
})
</script>

<style scoped>
.word-container {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.coding-section {
    min-height: 600px;
}

.coding-layout {
    display: grid;
    grid-template-columns: 300px 1fr;
    gap: var(--spacing-lg);
}

.problem-list {
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    max-height: 600px;
    overflow-y: auto;
}

.problem-list::-webkit-scrollbar {
    width: 6px;
}

.problem-list::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
    border-radius: var(--radius-sm);
}

.problem-list::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-sm);
}

.problem-list::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover);
}

.problem-list h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-md);
    color: var(--color-text-primary);
}

.problem-item {
    background-color: var(--color-bg-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-sm);
    border: 1px solid var(--color-border);
    margin-bottom: var(--spacing-sm);
    cursor: pointer;
    transition: all 0.2s ease;
}

.problem-item:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.problem-item.active {
    border-color: var(--color-primary);
    background-color: rgba(59, 130, 246, 0.05);
}

.problem-item h4 {
    font-size: var(--font-size-base);
    font-weight: 500;
    margin-bottom: var(--spacing-xs);
    color: var(--color-text-primary);
}

.problem-difficulty {
    font-size: var(--font-size-xs);
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    display: inline-block;
    font-weight: 500;
}

.difficulty-easy {
    background-color: #d1fae5;
    color: #065f46;
}

.difficulty-medium {
    background-color: #fef3c7;
    color: #92400e;
}

.difficulty-hard {
    background-color: #fee2e2;
    color: #991b1b;
}

.editor-section {
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
}

.problem-info {
    margin-bottom: var(--spacing-lg);
}

.problem-info h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
}

.problem-description {
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-secondary);
    line-height: 1.5;
}

.problem-input,
.problem-output {
    font-size: var(--font-size-sm);
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-xs);
}

.editor-container {
    margin-bottom: var(--spacing-lg);
}

.code-editor {
    width: 100%;
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-family: 'Courier New', Courier, monospace;
    font-size: var(--font-size-sm);
    line-height: 1.5;
    background-color: var(--color-bg-primary);
    resize: vertical;
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
}

.code-editor::-webkit-scrollbar {
    width: 6px;
}

.code-editor::-webkit-scrollbar-track {
    background: var(--color-bg-secondary);
    border-radius: var(--radius-sm);
}

.code-editor::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-sm);
}

.code-editor::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover);
}

.code-editor:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.editor-actions {
    display: flex;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-sm);
}

.code-result {
    background-color: var(--color-bg-primary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
    margin-top: var(--spacing-lg);
}

.code-result h4 {
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
}

.code-result pre {
    font-family: 'Courier New', Courier, monospace;
    font-size: var(--font-size-sm);
    line-height: 1.5;
    color: var(--color-text-secondary);
    white-space: pre-wrap;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
}

.code-result pre::-webkit-scrollbar {
    width: 6px;
}

.code-result pre::-webkit-scrollbar-track {
    background: var(--color-bg-primary);
    border-radius: var(--radius-sm);
}

.code-result pre::-webkit-scrollbar-thumb {
    background: var(--color-border);
    border-radius: var(--radius-sm);
}

.code-result pre::-webkit-scrollbar-thumb:hover {
    background: var(--color-border-hover);
}

.btn {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-normal);
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.btn-primary {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.btn-primary:hover {
    background-color: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
}

.btn-primary:active {
    background-color: var(--color-primary-focus);
    border-color: var(--color-primary-focus);
}

.btn-secondary {
    background-color: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-color: var(--color-border);
}

.btn-secondary:hover {
    background-color: var(--color-border);
    border-color: var(--color-border-hover);
}

.btn-secondary:active {
    background-color: var(--color-border-hover);
    border-color: var(--color-border-hover);
}

@media (max-width: 768px) {
    .coding-layout {
        grid-template-columns: 1fr;
    }

    .problem-list {
        order: 2;
    }

    .editor-section {
        order: 1;
    }

    .word-container {
        padding: var(--spacing-md);
    }

    .coding-layout {
        gap: var(--spacing-md);
    }
}
</style>
