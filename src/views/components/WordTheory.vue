<template>
    <div class="word-container">
        <div class="word-header">
            <div class="category-tabs">
                <button v-for="category in categories" :key="category.key" class="category-btn"
                    :class="{ active: activeCategory === category.key }" @click="activeCategory = category.key">
                    {{ category.label }}
                </button>
            </div>
        </div>

        <div class="theory-section">
            <div class="theory-list">
                <div v-for="item in filteredTheoryItems" :key="item.id" class="theory-item">
                    <div class="theory-header" @click="toggleAnswer(item.id)">
                        <div class="theory-header-left">
                            <h3 class="theory-title">{{ item.title }}</h3>
                            <span v-if="item.stars" class="theory-stars">{{ '⭐'.repeat(item.stars) }}</span>
                        </div>
                        <svg class="theory-arrow" :class="{ 'rotated': expandedItems.has(item.id) }"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <div class="theory-content">{{ item.content }}</div>
                    <transition name="expand">
                        <div class="theory-answer" v-if="item.answer && expandedItems.has(item.id)">
                            <h4>答案：</h4>
                            <div>{{ item.answer }}</div>
                        </div>
                    </transition>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const categories = [
    { key: 'vue', label: 'Vue' },
    { key: 'js', label: 'JavaScript' },
    { key: 'project', label: '项目' },
    { key: 'code', label: '手写题' },
    { key: 'engineering', label: '工程化' },
    { key: 'browser', label: '浏览器' },
    { key: 'ts', label: 'TypeScript' },
    { key: 'design', label: '设计模式' }
]

const activeCategory = ref('vue')
const expandedItems = ref<Set<number>>(new Set())

const toggleAnswer = (id: number) => {
    if (expandedItems.value.has(id)) {
        expandedItems.value.delete(id)
    } else {
        expandedItems.value.add(id)
    }
}

interface TheoryItem {
    id: number
    title: string
    content: string
    answer: string
    category: string
    stars?: number
}

const theoryItems = ref<TheoryItem[]>([])

const filteredTheoryItems = computed(() => {
    return theoryItems.value.filter(item => item.category === activeCategory.value)
})

onMounted(() => {
    theoryItems.value = [
        {
            id: 101,
            title: 'Vue2 响应式原理',
            content: 'Object.defineProperty 怎么实现？数组怎么处理？缺点？',
            answer: 'Vue2响应式原理（Object.defineProperty）：\n\n1. 使用Object.defineProperty遍历对象的每个属性\n2. 为每个属性添加getter和setter\n3. 当访问属性时触发getter，进行依赖收集\n4. 当修改属性时触发setter，通知依赖更新\n\n数组处理：\n- Vue2重写了数组的7个方法（push、pop、shift、unshift、splice、sort、reverse）\n- 当调用这些方法时，会触发视图更新\n\n缺点：\n1. 无法检测对象新增属性\n2. 无法检测对象删除属性\n3. 无法检测数组索引变化\n4. 无法检测数组长度变化',
            category: 'vue',
            stars: 5
        },
        {
            id: 102,
            title: 'Vue3 响应式原理',
            content: 'Proxy 比 defineProperty 好在哪里？懒代理是什么？',
            answer: 'Vue3响应式原理（Proxy）：\n\nProxy的优势：\n1. 可以检测对象新增属性\n2. 可以检测对象删除属性\n3. 可以检测数组索引和长度变化\n4. 性能更好\n5. 支持更多数据类型（Map、Set、WeakMap、WeakSet）\n\n懒代理：\n- Vue3的Proxy是懒代理，只有当访问到属性时才会进行代理\n- 相比Vue2的一上来就递归遍历所有属性，性能更好',
            category: 'vue',
            stars: 5
        },
        {
            id: 103,
            title: '依赖收集与派发更新',
            content: 'Dep 和 Watcher 的关系？',
            answer: 'Dep 和 Watcher 的关系：\n\nDep（Dependency）：\n- 依赖收集器，负责收集依赖\n- 每个响应式属性都有一个Dep实例\n- 内部维护一个subs数组，存储Watcher实例\n\nWatcher：\n- 观察者，负责订阅Dep\n- 当响应式数据变化时，Dep会通知所有Watcher\n- Watcher接收到通知后，执行相应的更新操作\n\n关系：\n1. 数据读取时，getter触发，Dep收集当前的Watcher\n2. 数据更新时，setter触发，Dep通知所有收集的Watcher\n3. Watcher收到通知，执行更新',
            category: 'vue',
            stars: 4
        },
        {
            id: 104,
            title: 'nextTick 原理',
            content: '有什么用？怎么实现的？微任务还是宏任务？',
            answer: 'nextTick原理：\n\n作用：\n- 在DOM更新后执行回调函数\n- 确保获取到最新的DOM状态\n\n实现原理：\n1. 内部使用异步队列实现\n2. 优先使用微任务（Promise.then）\n3. 降级方案：MutationObserver、setImmediate、setTimeout\n\n执行时机：\n- 将回调函数推入队列，在下一次事件循环的微任务阶段执行\n- 此时DOM已经更新完成\n\n使用场景：\n- 在created钩子中操作DOM\n- 数据更新后立即获取DOM尺寸\n- 响应式数据修改后，需要立即操作更新后的DOM',
            category: 'vue',
            stars: 4
        },
        {
            id: 105,
            title: '虚拟 DOM 和 diff 算法',
            content: 'Vue2 和 Vue3 diff 区别？key 的作用？为什么不能用 index？',
            answer: '虚拟 DOM 和 diff 算法：\n\n虚拟DOM：\n1. 用JavaScript对象模拟DOM结构\n2. 减少直接操作DOM的次数\n3. 提高渲染性能\n\nVue2 vs Vue3 diff区别：\nVue2：\n- 双端比较\n- 有头尾指针\n- 复杂度较高\n\nVue3：\n- 单端比较\n- 最长递增子序列\n- 性能更好\n\nkey的作用：\n1. 用于标识每个节点的唯一性\n2. 帮助Vue的虚拟DOM算法识别哪些元素被添加、修改或删除\n3. 提高DOM更新的性能\n4. 避免因元素复用导致的状态混乱\n\n为什么不能用index：\n1. 当数组插入或删除元素时，index会变化\n2. 导致不必要的DOM操作\n3. 可能导致元素状态混乱',
            category: 'vue',
            stars: 4
        },
        {
            id: 106,
            title: '生命周期',
            content: '各阶段做什么？父子组件执行顺序？',
            answer: '生命周期：\n\nVue2生命周期：\n1. beforeCreate：实例刚创建，data和methods还未初始化\n2. created：实例创建完成，data和methods已初始化，可访问data\n3. beforeMount：挂载前，模板已编译但未渲染\n4. mounted：挂载完成，DOM已渲染\n5. beforeUpdate：数据更新前\n6. updated：数据更新完成\n7. beforeDestroy：实例销毁前\n8. destroyed：实例销毁完成\n\nVue3生命周期：\n1. setup()：组合式API入口\n2. onBeforeMount：挂载前\n3. onMounted：挂载完成\n4. onBeforeUpdate：更新前\n5. onUpdated：更新完成\n6. onBeforeUnmount：卸载前\n7. onUnmounted：卸载完成\n\n父子组件执行顺序：\n挂载阶段：\n父beforeCreate → 父created → 父beforeMount → 子beforeCreate → 子created → 子beforeMount → 子mounted → 父mounted\n\n更新阶段：\n父beforeUpdate → 子beforeUpdate → 子updated → 父updated\n\n卸载阶段：\n父beforeUnmount → 子beforeUnmount → 子unmounted → 父unmounted',
            category: 'vue',
            stars: 5
        },
        {
            id: 107,
            title: 'computed 和 watch',
            content: '区别？计算属性为什么有缓存？',
            answer: 'computed 和 watch的区别：\n\ncomputed：\n1. 计算属性，依赖于响应式数据\n2. 有缓存，只有依赖变化时才会重新计算\n3. 适合用于计算衍生值\n4. 不能直接修改计算属性的值\n5. 默认深度监听\n6. 必须有返回值\n\nwatch：\n1. 监听器，监听响应式数据的变化\n2. 无缓存，数据变化时立即执行回调\n3. 适合用于执行副作用操作（如API调用）\n4. 可以修改其他数据\n5. 默认浅监听，需要深度监听时需设置deep: true\n6. 不需要返回值\n\n为什么计算属性有缓存：\n1. 基于响应式依赖进行缓存\n2. 只有相关依赖发生改变时才会重新计算\n3. 避免不必要的计算，提高性能\n4. 适合多次访问但依赖不变的场景',
            category: 'vue',
            stars: 5
        },
        {
            id: 108,
            title: '组件通信',
            content: '8 种方式分别适用场景？兄弟组件怎么通信？',
            answer: '组件通信8种方式：\n\n1. props / emit\n   - 适用：父子组件通信\n   - 父传子：props\n   - 子传父：emit\n\n2. $parent / $children\n   - 适用：父子组件通信\n   - 直接访问父子组件实例\n\n3. $refs\n   - 适用：父组件访问子组件实例\n   - 可调用子组件方法和访问数据\n\n4. provide / inject\n   - 适用：祖先组件向后代组件注入依赖\n   - 跨层级组件通信\n\n5. eventBus\n   - 适用：任意组件通信\n   - 事件总线，发布订阅模式\n\n6. Vuex/Pinia\n   - 适用：全局状态共享\n   - 大型应用状态管理\n\n7. slot\n   - 适用：父组件向子组件传递内容\n   - 内容分发\n\n8. attrs / listeners\n   - 适用：透传属性和事件\n   - 父组件向孙组件传递\n\n兄弟组件通信：\n1. eventBus\n2. Vuex/Pinia\n3. 通过共同父组件中转（子→父→子）',
            category: 'vue',
            stars: 5
        },
        {
            id: 109,
            title: 'v-model 原理',
            content: '语法糖怎么实现？组件上怎么用多个 v-model？',
            answer: 'v-model原理：\n\n语法糖实现：\nVue2：\n- :value="value" + @input="value = $event"\n\nVue3：\n- :modelValue="value" + @update:modelValue="value = $event"\n\n组件上多个v-model：\nVue3支持在组件上使用多个v-model：\n\n```vue\n<ChildComponent\n  v-model:title="pageTitle"\n  v-model:content="pageContent"\n/>\n\n<!-- 相当于 -->\n<ChildComponent\n  :title="pageTitle"\n  @update:title="pageTitle = $event"\n  :content="pageContent"\n  @update:content="pageContent = $event"\n/>\n```\n\n子组件接收：\n```vue\nprops: [\'title\', \'content\'],\nemits: [\'update:title\', \'update:content\']\n```',
            category: 'vue',
            stars: 4
        },
        {
            id: 110,
            title: 'keep-alive',
            content: '作用？生命周期？',
            answer: 'keep-alive：\n\n作用：\n1. 缓存组件实例，避免重复渲染\n2. 保持组件状态\n3. 提高性能\n\n生命周期：\n激活：\n- activated：组件被激活时调用\n\n停用：\n- deactivated：组件被停用时调用\n\nprops：\n- include：字符串或正则，只有名称匹配的组件会被缓存\n- exclude：字符串或正则，名称匹配的组件不会被缓存\n- max：数字，最多可以缓存多少组件实例\n\n使用场景：\n1. 表单填写，切换后保留内容\n2. 列表详情页，返回保留滚动位置\n3. Tab切换，保持各Tab状态',
            category: 'vue',
            stars: 3
        },
        {
            id: 111,
            title: '自定义指令',
            content: '用过吗？钩子函数？',
            answer: '自定义指令：\n\n钩子函数：\nVue2：\n- bind：指令第一次绑定到元素时调用\n- inserted：被绑定元素插入父节点时调用\n- update：所在组件的 VNode 更新时调用\n- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用\n- unbind：指令与元素解绑时调用\n\nVue3：\n- created：在绑定元素的 attribute 或事件监听器被应用之前调用\n- beforeMount：当指令第一次绑定到元素并且在挂载父组件之前调用\n- mounted：在绑定元素的父组件被挂载后调用\n- beforeUpdate：在更新包含组件的 VNode 之前调用\n- updated：在包含组件的 VNode 及其子组件的 VNode 更新后调用\n- beforeUnmount：在卸载绑定元素的父组件之前调用\n- unmounted：当指令与元素解除绑定且父组件已卸载时调用\n\n常用自定义指令：\n- v-loading：加载状态\n- v-clickoutside：点击外部\n- v-copy：复制\n- v-debounce：防抖\n- v-throttle：节流',
            category: 'vue',
            stars: 2
        },
        {
            id: 112,
            title: 'Vue Router',
            content: '路由模式区别？导航守卫？懒加载原理？',
            answer: 'Vue Router：\n\n路由模式区别：\n1. hash模式\n   - URL带#号\n   - 通过hashchange事件监听\n   - 兼容性好\n   - 不需要服务器配置\n\n2. history模式\n   - URL不带#号\n   - 通过history.pushState和replaceState\n   - 需要服务器配置支持\n   - 更美观\n\n导航守卫：\n1. 全局守卫：beforeEach、beforeResolve、afterEach\n2. 路由独享守卫：beforeEnter\n3. 组件内守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave\n\n执行顺序：\nbeforeEach → beforeEnter → beforeRouteEnter → beforeResolve → afterEach\n\n懒加载原理：\n1. 动态import()语法\n2. Webpack会将动态import的代码单独打包\n3. 路由访问时才加载对应的代码\n4. 减小首屏加载体积',
            category: 'vue',
            stars: 3
        },
        {
            id: 113,
            title: 'Vuex / Pinia',
            content: '核心概念？为什么需要 mutation？刷新数据丢失怎么办？',
            answer: 'Vuex / Pinia：\n\nVuex核心概念：\n1. State：状态\n2. Getters：计算属性\n3. Mutations：同步修改state\n4. Actions：异步操作\n5. Modules：模块化\n\nPinia核心概念：\n1. State：状态\n2. Getters：计算属性\n3. Actions：同步和异步操作\n\n为什么Vuex需要mutation：\n1. 统一修改state的入口\n2. 便于追踪状态变化\n3. DevTools可以记录每次mutation\n4. 保证状态变更可追踪\n\n刷新数据丢失怎么办：\n1. localStorage/sessionStorage\n2. Vuex-persistedstate插件\n3. 接口重新获取\n4. URL参数保存',
            category: 'vue',
            stars: 4
        },
        {
            id: 201,
            title: '原型链',
            content: '__proto__ 和 prototype 区别？手写 instanceof？',
            answer: '原型链：\n\n__proto__ 和 prototype 区别：\n- __proto__：对象的原型\n- prototype：构造函数的原型对象\n- 关系：实例.__proto__ === 构造函数.prototype\n\n原型链：\n1. 每个对象都有一个原型对象__proto__\n2. 原型对象也是一个对象，它也有自己的原型\n3. 形成一个链式结构，直到Object.prototype\n4. Object.prototype的原型是null\n\n手写instanceof：\n```javascript\nfunction myInstanceOf(obj, constructor) {\n  let proto = obj.__proto__\n  while (proto) {\n    if (proto === constructor.prototype) {\n      return true\n    }\n    proto = proto.__proto__\n  }\n  return false\n}\n```',
            category: 'js',
            stars: 5
        },
        {
            id: 202,
            title: '闭包',
            content: '定义？应用场景？内存泄漏怎么避免？',
            answer: '闭包：\n\n定义：\n闭包是指有权访问另一个函数作用域中变量的函数\n\n特点：\n1. 可以访问函数内部的变量\n2. 变量不会被垃圾回收机制回收\n3. 可以实现私有变量\n\n应用场景：\n1. 模块化开发\n2. 防抖节流\n3. 函数柯里化\n4. 封装私有变量和方法\n5. 循环中绑定事件\n\n内存泄漏怎么避免：\n1. 不再使用的闭包，及时解除引用\n2. 避免在闭包中引用大对象\n3. 使用弱引用（WeakMap、WeakSet）\n4. 及时清除定时器和事件监听',
            category: 'js',
            stars: 4
        },
        {
            id: 203,
            title: 'this 指向',
            content: '4 种绑定规则？箭头函数 this？',
            answer: 'this指向：\n\n4种绑定规则（优先级从高到低）：\n\n1. 新绑定（new）\n   - 使用new关键字调用构造函数时\n   - this指向新创建的对象\n\n2. 显式绑定（call/apply/bind）\n   - 使用call、apply、bind方法\n   - this指向传入的第一个参数\n\n3. 隐式绑定\n   - 通过对象调用方法时\n   - this指向调用该方法的对象\n\n4. 默认绑定\n   - 在全局作用域或函数内部\n   - this指向全局对象（浏览器中是window，Node.js中是global）\n\n箭头函数this：\n1. 没有自己的this\n2. 继承外层作用域的this\n3. 绑定后不可改变\n4. 不能作为构造函数\n5. 不能使用call/apply/bind改变this',
            category: 'js',
            stars: 5
        },
        {
            id: 204,
            title: '事件循环',
            content: '宏任务/微任务顺序？async/await 怎么执行？',
            answer: '事件循环：\n\n宏任务vs微任务：\n\n宏任务：\n- setTimeout、setInterval\n- I/O操作\n- DOM事件\n- requestAnimationFrame\n- setImmediate（Node.js）\n\n微任务：\n- Promise.then/catch/finally\n- async/await\n- process.nextTick（Node.js）\n- MutationObserver\n\n执行顺序：\n1. 执行同步代码\n2. 执行所有微任务\n3. 执行一个宏任务\n4. 再次执行所有微任务\n5. 循环...\n\nasync/await执行：\n1. async函数返回Promise\n2. await会暂停async函数执行\n3. await后面的代码会被放入微任务队列\n4. Promise解决后继续执行',
            category: 'js',
            stars: 5
        },
        {
            id: 205,
            title: '作用域',
            content: '词法作用域？块级作用域？',
            answer: '作用域：\n\n词法作用域（静态作用域）：\n- 函数的作用域在函数定义时就确定了\n- 不是在调用时确定\n- 由代码的书写位置决定\n\n块级作用域：\n- let和const声明的变量具有块级作用域\n- 只在{}内有效\n- 避免变量污染\n\n作用域链：\n- 用于变量查找\n- 由词法作用域决定\n- 从内向外查找，直到全局作用域',
            category: 'js',
            stars: 3
        },
        {
            id: 206,
            title: 'ES6+ 常用特性',
            content: 'let/const 区别？解构？Set/Map？',
            answer: 'ES6+常用特性：\n\nlet/const/var区别：\n- var：函数作用域，允许重复声明，变量提升\n- let：块级作用域，不允许重复声明，暂时性死区\n- const：块级作用域，不允许重复声明，声明后不可修改\n\n解构赋值：\n```javascript\n// 数组解构\nconst [a, b] = [1, 2]\n\n// 对象解构\nconst { name, age } = { name: \'张三\', age: 18 }\n```\n\nSet：\n- 类似数组，但成员都是唯一的\n- 没有重复值\n- 常用于数组去重\n\nMap：\n- 键值对集合\n- 键可以是任意类型\n- 比Object更灵活\n\n其他特性：\n- 箭头函数\n- Promise\n- async/await\n- 模板字符串\n- 展开运算符\n- 剩余参数\n- 类（class）\n- 模块（import/export）',
            category: 'js',
            stars: 4
        },
        {
            id: 207,
            title: 'Promise',
            content: '手写 Promise.all / race？错误处理？',
            answer: 'Promise：\n\nPromise.all手写：\n```javascript\nfunction promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    let result = []\n    let count = 0\n    promises.forEach((promise, index) => {\n      Promise.resolve(promise).then(value => {\n        result[index] = value\n        count++\n        if (count === promises.length) {\n          resolve(result)\n        }\n      }).catch(reject)\n    })\n  })\n}\n```\n\nPromise.race手写：\n```javascript\nfunction promiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    promises.forEach(promise => {\n      Promise.resolve(promise).then(resolve).catch(reject)\n    })\n  })\n}\n```\n\n错误处理：\n- catch()：捕获错误\n- try/catch：配合async/await使用\n- Promise.allSettled()：等待所有promise完成，无论成功失败',
            category: 'js',
            stars: 5
        },
        {
            id: 208,
            title: 'async/await',
            content: '怎么转成 Promise？',
            answer: 'async/await：\n\n怎么转成Promise：\n\nasync函数本身就返回Promise：\n```javascript\nasync function fn() {\n  return 123\n}\nfn() // 返回Promise {<fulfilled>: 123}\n```\n\ntry/catch捕获错误：\n```javascript\nasync function fn() {\n  try {\n    const result = await someAsync()\n    return result\n  } catch (error) {\n    console.error(error)\n  }\n}\n```\n\nawait底层：\n1. await后面的表达式会被包装成Promise\n2. 暂停执行，等待Promise解决\n3. Promise解决后继续执行\n4. 相当于Promise.then的语法糖',
            category: 'js',
            stars: 3
        },
        {
            id: 209,
            title: '深拷贝 vs 浅拷贝',
            content: '手写深拷贝（考虑循环引用）',
            answer: '深拷贝vs浅拷贝：\n\n浅拷贝：\n- 只复制对象的引用\n- 修改新对象会影响原对象\n- 方法：Object.assign、展开运算符、Array.prototype.slice()\n\n深拷贝：\n- 完全复制对象及其嵌套对象\n- 修改新对象不影响原对象\n- 方法：JSON.parse(JSON.stringify())、递归复制\n\n手写深拷贝（考虑循环引用）：\n```javascript\nfunction deepClone(obj, map = new WeakMap()) {\n  if (obj === null || typeof obj !== \'object\') {\n    return obj\n  }\n  if (map.has(obj)) {\n    return map.get(obj)\n  }\n  let clone = Array.isArray(obj) ? [] : {}\n  map.set(obj, clone)\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      clone[key] = deepClone(obj[key], map)\n    }\n  }\n  return clone\n}\n```\n\n注意：\n- WeakMap处理循环引用\n- 特殊对象需要单独处理（Date、RegExp、Function等）',
            category: 'js',
            stars: 5
        },
        {
            id: 210,
            title: '防抖与节流',
            content: '手写？区别？应用场景？',
            answer: '防抖与节流：\n\n防抖（debounce）：\n- 在事件触发n秒后再执行回调\n- 如果在n秒内又触发，则重新计时\n\n手写防抖：\n```javascript\nfunction debounce(func, wait, immediate) {\n  let timeout\n  return function() {\n    const context = this\n    const args = arguments\n    if (timeout) clearTimeout(timeout)\n    if (immediate) {\n      const callNow = !timeout\n      timeout = setTimeout(() => {\n        timeout = null\n      }, wait)\n      if (callNow) func.apply(context, args)\n    } else {\n      timeout = setTimeout(() => {\n        func.apply(context, args)\n      }, wait)\n    }\n  }\n}\n```\n\n节流（throttle）：\n- 规定在一个单位时间内，只能触发一次\n- 如果单位时间内多次触发，只执行一次\n\n手写节流：\n```javascript\n// 时间戳版\nfunction throttle1(func, wait) {\n  let previous = 0\n  return function() {\n    const now = Date.now()\n    const context = this\n    const args = arguments\n    if (now - previous > wait) {\n      func.apply(context, args)\n      previous = now\n    }\n  }\n}\n\n// 定时器版\nfunction throttle2(func, wait) {\n  let timeout\n  return function() {\n    const context = this\n    const args = arguments\n    if (!timeout) {\n      timeout = setTimeout(() => {\n        timeout = null\n        func.apply(context, args)\n      }, wait)\n    }\n  }\n}\n```\n\n应用场景：\n防抖：\n- 搜索框输入\n- 窗口大小调整\n- 表单验证\n\n节流：\n- 滚动加载\n- 鼠标移动\n- 按钮点击',
            category: 'js',
            stars: 5
        },
        {
            id: 211,
            title: '数组方法',
            content: 'map/forEach/filter/reduce 区别？手写 reduce？',
            answer: '数组方法：\n\n区别：\n- map：返回新数组，每个元素是回调返回值\n- forEach：遍历数组，无返回值\n- filter：返回新数组，包含满足条件的元素\n- reduce：累加器，返回单个值\n\n手写reduce：\n```javascript\nArray.prototype.myReduce = function(callback, initialValue) {\n  let accumulator = initialValue !== undefined ? initialValue : this[0]\n  let startIndex = initialValue !== undefined ? 0 : 1\n  for (let i = startIndex; i < this.length; i++) {\n    accumulator = callback(accumulator, this[i], i, this)\n  }\n  return accumulator\n}\n```',
            category: 'js',
            stars: 3
        },
        {
            id: 212,
            title: '类型判断',
            content: 'typeof 和 instanceof 局限性？Object.prototype.toString？',
            answer: '类型判断：\n\ntypeof：\n- 返回字符串，表示类型\n- 局限性：\n  - null返回"object"\n  - 数组返回"object"\n  - 大部分对象都返回"object"\n\ninstanceof：\n- 检查原型链\n- 局限性：\n  - 只能判断对象类型\n  - 不能判断基本类型\n  - 跨iframe不生效\n\nObject.prototype.toString.call()：\n- 最准确的类型判断\n- 返回"[object Type]"格式\n\n常用：\n```javascript\nfunction getType(value) {\n  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()\n}\n```',
            category: 'js',
            stars: 3
        },
        {
            id: 301,
            title: '大文件上传（分片续传）',
            content: '分片逻辑、hash 计算（Web Worker）、断点续传、并发控制、暂停恢复',
            answer: '大文件上传：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n分片逻辑：\n1. 将大文件按固定大小切片（如5MB）\n2. 每个分片计算hash值\n3. 并发上传多个分片\n4. 服务端合并分片\n\nhash计算：\n1. 使用Web Worker避免阻塞主线程\n2. spark-md5库计算\n3. 可以抽样计算提高速度\n\n断点续传：\n1. 上传前查询服务端已上传的分片\n2. 只上传未上传的分片\n3. 本地保存上传进度\n\n并发控制：\n1. 限制同时上传的分片数量（如3个）\n2. 一个完成后开始下一个\n3. 避免并发过多导致卡顿\n\n暂停恢复：\n1. 暂停时取消当前请求\n2. 保存已上传分片列表\n3. 恢复时从断点继续\n\n常见追问：\n- 怎么计算 hash？\n- 怎么处理网络中断？\n- 怎么保证秒传？',
            category: 'project',
            stars: 0
        },
        {
            id: 302,
            title: 'WebSocket 消息推送',
            content: '心跳机制、断线重连（指数退避）、消息补偿、多模块分发',
            answer: 'WebSocket消息推送：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n心跳机制：\n1. 定时发送心跳包\n2. 服务端超时判断断开\n3. 避免误判\n\n断线重连：\n1. 指数退避：重连间隔递增（1s、2s、4s、8s...）\n2. 最大间隔限制\n3. 手动重连选项\n\n消息补偿：\n1. 服务端保存未读消息\n2. 重连后同步消息\n3. 消息id去重\n\n多模块分发：\n1. 消息类型分类\n2. 不同模块订阅不同消息\n3. 消息队列管理\n\n常见追问：\n- 怎么防止误判？\n- 断线期间消息怎么补？',
            category: 'project',
            stars: 0
        },
        {
            id: 303,
            title: 'OpenLayers 地图优化',
            content: '点聚合、按需加载、热力图原理、10万点渲染优化',
            answer: 'OpenLayers地图优化：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n点聚合：\n1. 按缩放级别聚合相近的点\n2. 减少渲染数量\n3. 提高性能\n\n按需加载：\n1. 视口内加载\n2. 分页或分片\n3. 减少数据量\n\n热力图原理：\n1. 基于点密度计算\n2. 颜色渐变表示热度\n3. canvas绘制\n\n10万点渲染优化：\n1. WebGL渲染\n2. 聚合显示\n3. 视口裁剪\n4. LOD（细节层次）\n\n常见追问：\n- 10万个点怎么渲染？\n- 热力图原理是什么？',
            category: 'project',
            stars: 0
        },
        {
            id: 304,
            title: '低代码平台渲染器',
            content: '动态组件、JSON Schema、事件绑定、组件通信',
            answer: '低代码平台渲染器：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n动态组件：\n1. component :is\n2. 动态渲染\n3. 组件注册\n\nJSON Schema：\n1. 描述页面结构\n2. 组件配置\n3. 属性绑定\n\n事件绑定：\n1. 事件配置\n2. 动态绑定\n3. 事件处理函数\n\n组件通信：\n1. 全局状态\n2. 事件总线\n3. props/emit\n\n常见追问：\n- 怎么设计页面渲染器？\n- 怎么实现组件间通信？',
            category: 'project',
            stars: 0
        },
        {
            id: 305,
            title: 'iframe 嵌套 + 通信',
            content: '为什么选 iframe、postMessage、样式隔离、高度自适应、路由同步',
            answer: 'iframe嵌套+通信：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n为什么选iframe：\n1. 样式隔离\n2. JS隔离\n3. 独立环境\n4. 微前端方案\n\npostMessage：\n1. 跨域通信\n2. origin验证\n3. 消息序列化\n\n样式隔离：\n1. iframe天然隔离\n2. 沙箱环境\n3. 样式不污染\n\n高度自适应：\n1. postMessage通信高度\n2. resize监听\n3. 动态设置iframe高度\n\n路由同步：\n1. 主路由和子路由同步\n2. history.pushState\n3. hash变化监听\n\n常见追问：\n- 样式怎么隔离？\n- 怎么传参？\n- 怎么同步路由？',
            category: 'project',
            stars: 0
        },
        {
            id: 306,
            title: '虚拟滚动（树/列表）',
            content: '拍平树结构、可视区域计算、buffer、不定高度处理',
            answer: '虚拟滚动：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n拍平树结构：\n1. 树形转扁平数组\n2. 展开状态管理\n3. 层级信息保留\n\n可视区域计算：\n1. 滚动位置\n2. 元素高度\n3. 起始结束索引\n\nbuffer：\n1. 上下各多渲染几个\n2. 防止滚动白屏\n3. 提高体验\n\n不定高度处理：\n1. 预估高度\n2. 实际高度缓存\n3. 动态调整\n\n常见追问：\n- 怎么计算起始结束索引？\n- 不定高度怎么处理？',
            category: 'project',
            stars: 0
        },
        {
            id: 307,
            title: '双 Token 无感续期',
            content: '请求队列、状态锁、刷新 token、并发请求处理',
            answer: '双Token无感续期：\n\n准备方向：背景 → 难点 → 方案 → 成果（量化）\n\n请求队列：\n1. 401时暂存请求\n2. token刷新后重试\n3. 保证请求不丢失\n\n状态锁：\n1. 防止多次刷新token\n2. 刷新中标记\n3. 避免重复请求\n\n刷新token：\n1. access token + refresh token\n2. access过期用refresh刷新\n3. refresh过期重新登录\n\n并发请求处理：\n1. 多个401只刷新一次\n2. 刷新后重试所有队列\n3. 避免并发刷新\n\n常见追问：\n- 怎么避免多次刷新？\n- refresh_token过期怎么处理？',
            category: 'project',
            stars: 0
        },
        {
            id: 401,
            title: '防抖',
            content: 'immediate 参数、clearTimeout、this 指向',
            answer: '防抖手写：\n\n关键点：\n1. immediate参数：是否立即执行\n2. clearTimeout：清除定时器\n3. this指向：保证正确的this\n\n代码：\n```javascript\nfunction debounce(func, wait, immediate) {\n  let timeout\n  return function() {\n    const context = this\n    const args = arguments\n    if (timeout) clearTimeout(timeout)\n    if (immediate) {\n      const callNow = !timeout\n      timeout = setTimeout(() => {\n        timeout = null\n      }, wait)\n      if (callNow) func.apply(context, args)\n    } else {\n      timeout = setTimeout(() => {\n        func.apply(context, args)\n      }, wait)\n    }\n  }\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 402,
            title: '节流',
            content: '时间戳 + 定时器、remaining 计算',
            answer: '节流手写：\n\n关键点：\n1. 时间戳版：立即执行\n2. 定时器版：延迟执行\n3. remaining：剩余时间\n\n时间戳版：\n```javascript\nfunction throttle(func, wait) {\n  let previous = 0\n  return function() {\n    const now = Date.now()\n    const context = this\n    const args = arguments\n    if (now - previous > wait) {\n      func.apply(context, args)\n      previous = now\n    }\n  }\n}\n```\n\n定时器版：\n```javascript\nfunction throttle(func, wait) {\n  let timeout\n  return function() {\n    const context = this\n    const args = arguments\n    if (!timeout) {\n      timeout = setTimeout(() => {\n        timeout = null\n        func.apply(context, args)\n      }, wait)\n    }\n  }\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 403,
            title: '深拷贝',
            content: 'WeakMap 解决循环引用、特殊对象（Date/RegExp）',
            answer: '深拷贝手写：\n\n关键点：\n1. WeakMap：解决循环引用\n2. 特殊对象：Date、RegExp等单独处理\n3. 递归：深度复制\n\n代码：\n```javascript\nfunction deepClone(obj, map = new WeakMap()) {\n  if (obj === null || typeof obj !== \'object\') {\n    return obj\n  }\n  if (obj instanceof Date) {\n    return new Date(obj)\n  }\n  if (obj instanceof RegExp) {\n    return new RegExp(obj.source, obj.flags)\n  }\n  if (map.has(obj)) {\n    return map.get(obj)\n  }\n  let clone = Array.isArray(obj) ? [] : {}\n  map.set(obj, clone)\n  for (let key in obj) {\n    if (obj.hasOwnProperty(key)) {\n      clone[key] = deepClone(obj[key], map)\n    }\n  }\n  return clone\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 404,
            title: 'Promise.all',
            content: '计数器、结果顺序、错误处理',
            answer: 'Promise.all手写：\n\n关键点：\n1. 计数器：计数完成的Promise\n2. 结果顺序：按输入顺序保存\n3. 错误处理：任一失败就失败\n\n代码：\n```javascript\nfunction promiseAll(promises) {\n  return new Promise((resolve, reject) => {\n    let result = []\n    let count = 0\n    promises.forEach((promise, index) => {\n      Promise.resolve(promise).then(value => {\n        result[index] = value\n        count++\n        if (count === promises.length) {\n          resolve(result)\n        }\n      }).catch(reject)\n    })\n  })\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 405,
            title: 'Promise.race',
            content: '谁快就听谁的',
            answer: 'Promise.race手写：\n\n关键点：\n1. 谁先完成就用谁的结果\n2. 任一成功或失败都返回\n\n代码：\n```javascript\nfunction promiseRace(promises) {\n  return new Promise((resolve, reject) => {\n    promises.forEach(promise => {\n      Promise.resolve(promise).then(resolve).catch(reject)\n    })\n  })\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 406,
            title: '事件总线（Event Bus）',
            content: 'on/emit/off/once、filter 要赋值',
            answer: '事件总线手写：\n\n关键点：\n1. on：注册事件\n2. emit：触发事件\n3. off：取消事件\n4. once：只执行一次\n\n代码：\n```javascript\nclass EventBus {\n  constructor() {\n    this.events = {}\n  }\n  \n  on(event, callback) {\n    if (!this.events[event]) {\n      this.events[event] = []\n    }\n    this.events[event].push(callback)\n  }\n  \n  emit(event, ...args) {\n    if (this.events[event]) {\n      this.events[event].forEach(callback => {\n        callback(...args)\n      })\n    }\n  }\n  \n  off(event, callback) {\n    if (this.events[event]) {\n      if (callback) {\n        this.events[event] = this.events[event].filter(cb => cb !== callback)\n      } else {\n        delete this.events[event]\n      }\n    }\n  }\n  \n  once(event, callback) {\n    const onceCallback = (...args) => {\n      callback(...args)\n      this.off(event, onceCallback)\n    }\n    this.on(event, onceCallback)\n  }\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 407,
            title: '数组扁平化',
            content: 'reduce + 递归、控制深度',
            answer: '数组扁平化手写：\n\n关键点：\n1. reduce + 递归\n2. 控制深度\n\n代码：\n```javascript\nfunction flatten(arr, depth = 1) {\n  return arr.reduce((result, item) => {\n    if (Array.isArray(item) && depth > 0) {\n      result.push(...flatten(item, depth - 1))\n    } else {\n      result.push(item)\n    }\n    return result\n  }, [])\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 408,
            title: 'new 操作符',
            content: '创建对象、原型链、返回值判断',
            answer: 'new操作符手写：\n\n关键点：\n1. 创建新对象\n2. 原型链连接\n3. this绑定\n4. 返回值判断\n\n代码：\n```javascript\nfunction myNew(constructor, ...args) {\n  const obj = Object.create(constructor.prototype)\n  const result = constructor.apply(obj, args)\n  return result && typeof result === \'object\' ? result : obj\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 409,
            title: 'call/apply/bind',
            content: '手写、参数处理',
            answer: 'call/apply/bind手写：\n\ncall：\n```javascript\nFunction.prototype.myCall = function(context, ...args) {\n  context = context || window\n  context.fn = this\n  const result = context.fn(...args)\n  delete context.fn\n  return result\n}\n```\n\napply：\n```javascript\nFunction.prototype.myApply = function(context, args) {\n  context = context || window\n  context.fn = this\n  const result = context.fn(...args)\n  delete context.fn\n  return result\n}\n```\n\nbind：\n```javascript\nFunction.prototype.myBind = function(context, ...args) {\n  const fn = this\n  return function(...innerArgs) {\n    return fn.apply(context, [...args, ...innerArgs])\n  }\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 410,
            title: 'instanceof',
            content: '原型链查找',
            answer: 'instanceof手写：\n\n关键点：\n1. 原型链查找\n2. 直到null\n\n代码：\n```javascript\nfunction myInstanceOf(obj, constructor) {\n  let proto = obj.__proto__\n  while (proto) {\n    if (proto === constructor.prototype) {\n      return true\n    }\n    proto = proto.__proto__\n  }\n  return false\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 411,
            title: 'Object.create',
            content: '手写',
            answer: 'Object.create手写：\n\n代码：\n```javascript\nfunction create(obj) {\n  function F() {}\n  F.prototype = obj\n  return new F()\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 412,
            title: '函数柯里化',
            content: 'add(1)(2)(3)',
            answer: '函数柯里化手写：\n\n关键点：\n1. 参数收集\n2. 递归返回函数\n3. 满足条件执行\n\n代码：\n```javascript\nfunction curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) {\n      return fn.apply(this, args)\n    } else {\n      return function(...moreArgs) {\n        return curried.apply(this, [...args, ...moreArgs])\n      }\n    }\n  }\n}\n\n// 或简单版\nfunction add(a) {\n  return function(b) {\n    return function(c) {\n      return a + b + c\n    }\n  }\n}\n```',
            category: 'code',
            stars: 0
        },
        {
            id: 501,
            title: 'Webpack 核心概念',
            content: 'loader 和 plugin 区别？常用 loader/plugin 有哪些？',
            answer: 'Webpack核心概念：\n\nloader和plugin区别：\n\nloader：\n- 模块转换器\n- 将非JS文件转换为webpack能处理的模块\n- 在module.rules中配置\n- 链式调用，从右向左执行\n\n常用loader：\n- babel-loader：转译ES6+\n- css-loader：处理CSS\n- style-loader：注入style标签\n- less/sass-loader：预处理CSS\n- file-loader：文件处理\n- url-loader：base64转换\n\nplugin：\n- 扩展器\n- 在整个编译周期中执行\n- 可以访问compiler和compilation\n- 功能更强大\n\n常用plugin：\n- HtmlWebpackPlugin：生成HTML\n- MiniCssExtractPlugin：提取CSS\n- CleanWebpackPlugin：清理目录\n- DefinePlugin：定义全局变量',
            category: 'engineering',
            stars: 4
        },
        {
            id: 502,
            title: '打包优化',
            content: '代码分割、Tree Shaking、Gzip、图片压缩、CDN 怎么配置？',
            answer: '打包优化：\n\n代码分割：\n1. splitChunks：提取公共代码\n2. 动态import：按需加载\n3. 减少首屏体积\n\nTree Shaking：\n1. 消除未使用的代码\n2. ES6模块静态分析\n3. sideEffects配置\n\nGzip压缩：\n1. CompressionWebpackPlugin\n2. 服务端配合\n3. 减小传输体积\n\n图片压缩：\n1. image-webpack-loader\n2. 转WebP格式\n3. 按需选择\n\nCDN配置：\n1. externals：排除第三方库\n2. html-webpack-cdn-plugin\n3. 公共资源CDN',
            category: 'engineering',
            stars: 4
        },
        {
            id: 503,
            title: 'Vite 原理',
            content: '为什么快？ESM、esbuild、按需编译',
            answer: 'Vite原理：\n\n为什么快：\n\n1. ESM（ES Module）\n- 浏览器原生支持ES模块\n- 不需要打包成bundle\n- 按需加载模块\n\n2. esbuild\n- 使用Go语言编写\n- 比JS快10-100倍\n- 预构建依赖\n\n3. 按需编译\n- 只编译当前用到的模块\n- 不是全量编译\n- 开发模式极快\n\n4. HMR（热更新）\n- 基于ESM\n- 速度不随项目变大而变慢\n\n5. 生产环境\n- 使用Rollup打包\n- Tree Shaking更彻底',
            category: 'engineering',
            stars: 4
        },
        {
            id: 504,
            title: 'Babel',
            content: '作用？preset 和 plugin 区别？preset-env 是什么？',
            answer: 'Babel：\n\n作用：\n- 将ES6+代码转译为ES5\n- 语法转换\n- polyfill填充\n\npreset和plugin区别：\n\nplugin：\n- 单个功能\n- 比如@babel/plugin-transform-arrow-functions\n\npreset：\n- 插件集合\n- 预设一组插件\n- 比如@babel/preset-env\n\npreset-env：\n- 智能预设\n- 根据目标浏览器自动选择需要的插件\n- 配合browserslist使用\n- useBuiltIns配置polyfill',
            category: 'engineering',
            stars: 3
        },
        {
            id: 505,
            title: 'Tree Shaking',
            content: '条件？sideEffects 怎么配？',
            answer: 'Tree Shaking：\n\n条件：\n1. ES6模块（import/export）\n2. 生产模式\n3. 纯函数（无副作用）\n4. usedExports: true\n\nsideEffects配置：\n```json\n{\n  "sideEffects": [\n    "*.css",\n    "*.scss",\n    "./src/utils/side-effect.js"\n  ]\n}\n```\n\n说明：\n- false：所有文件都无副作用，可安全删除\n- 数组：列出有副作用的文件\n- 未列出的可tree shaking',
            category: 'engineering',
            stars: 3
        },
        {
            id: 506,
            title: '代码分割',
            content: '动态 import、splitChunks',
            answer: '代码分割：\n\n动态import：\n```javascript\nconst Component = () => import(\'./Component.vue\')\n```\n\nsplitChunks配置：\n```javascript\noptimization: {\n  splitChunks: {\n    chunks: \'all\',\n    cacheGroups: {\n      vendors: {\n        test: /[\\\\/]node_modules[\\\\/]/,\n        name: \'vendors\',\n        chunks: \'all\'\n      },\n      common: {\n        name: \'common\',\n        minChunks: 2,\n        chunks: \'all\'\n      }\n    }\n  }\n}\n```',
            category: 'engineering',
            stars: 3
        },
        {
            id: 507,
            title: 'Source Map',
            content: '作用？开发/生产用哪种？',
            answer: 'Source Map：\n\n作用：\n- 映射打包后的代码到源代码\n- 方便调试\n- 错误定位\n\n类型：\n- eval：最快，开发用\n- cheap-source-map：较快\n- cheap-module-source-map：推荐开发\n- source-map：完整，生产可配置\n\n开发环境：\n- cheap-module-source-map\n\n生产环境：\n- source-map（如果需要）\n- hidden-source-map（只有错误报告）\n- 或不生成',
            category: 'engineering',
            stars: 2
        },
        {
            id: 508,
            title: '环境变量',
            content: 'process.env、DefinePlugin',
            answer: '环境变量：\n\nprocess.env：\n- Node.js环境变量\n- webpack中可访问\n\nDefinePlugin：\n```javascript\nnew webpack.DefinePlugin({\n  \'process.env.NODE_ENV\': JSON.stringify(process.env.NODE_ENV),\n  \'process.env.API_BASE\': JSON.stringify(process.env.API_BASE)\n})\n```\n\nVite环境变量：\n- .env文件\n- import.meta.env\n- VITE_前缀',
            category: 'engineering',
            stars: 2
        },
        {
            id: 509,
            title: 'Git',
            content: '常用命令、冲突解决、rebase 和 merge 区别',
            answer: 'Git：\n\n常用命令：\n- git clone：克隆\n- git add：添加\n- git commit：提交\n- git push：推送\n- git pull：拉取\n- git branch：分支\n- git checkout：切换\n- git merge：合并\n- git rebase：变基\n- git log：日志\n- git status：状态\n- git reset：重置\n- git stash：暂存\n\n冲突解决：\n1. 查看冲突文件\n2. 手动编辑冲突标记\n3. git add标记解决\n4. git commit完成\n\nrebase vs merge：\n\nmerge：\n- 合并分支\n- 产生merge commit\n- 保留完整历史\n\nrebase：\n- 变基\n- 线性历史\n- 更整洁',
            category: 'engineering',
            stars: 2
        },
        {
            id: 601,
            title: '事件循环',
            content: '宏任务/微任务顺序、async/await 执行',
            answer: '事件循环（浏览器）：\n\n执行顺序：\n1. 执行同步代码\n2. 执行所有微任务\n3. 执行一个宏任务\n4. 再次执行所有微任务\n5. 渲染\n6. 循环...\n\n宏任务：\n- setTimeout、setInterval\n- requestAnimationFrame\n- I/O\n- DOM事件\n\n微任务：\n- Promise.then/catch/finally\n- async/await\n- MutationObserver',
            category: 'browser',
            stars: 5
        },
        {
            id: 602,
            title: 'HTTP 缓存',
            content: '强缓存、协商缓存、Cache-Control、ETag',
            answer: 'HTTP缓存：\n\n强缓存：\n- Cache-Control：max-age=3600\n- Expires：过期时间\n- 200 (from memory/disk cache)\n- 不请求服务器\n\n协商缓存：\n- ETag：资源标识\n- Last-Modified：最后修改\n- 304 Not Modified\n- 请求服务器验证\n\nCache-Control：\n- max-age：缓存时间\n- no-cache：协商缓存\n- no-store：不缓存\n- public：可被代理缓存\n- private：仅浏览器缓存',
            category: 'browser',
            stars: 4
        },
        {
            id: 603,
            title: '跨域',
            content: 'CORS、JSONP、代理、postMessage',
            answer: '跨域：\n\n同源策略：\n- 协议、域名、端口都相同\n- 保护用户安全\n\n解决方案：\n\n1. CORS（推荐）\n- 服务端设置Access-Control-Allow-Origin\n- 简单请求和复杂请求\n- 预检请求OPTIONS\n\n2. JSONP\n- 利用script标签跨域\n- 只能GET\n- 安全性较差\n\n3. 代理\n- 开发环境proxy\n- Nginx反向代理\n\n4. postMessage\n- iframe通信\n- 父子窗口通信',
            category: 'browser',
            stars: 4
        },
        {
            id: 604,
            title: 'XSS / CSRF',
            content: '原理、防御措施（CSP、Token、SameSite）',
            answer: 'XSS/CSRF：\n\nXSS（跨站脚本攻击）：\n原理：\n- 注入恶意脚本\n- 盗取Cookie\n- 执行恶意操作\n\n防御：\n1. 输入输出转义\n2. CSP内容安全策略\n3. HttpOnly Cookie\n4. 白名单过滤\n\nCSRF（跨站请求伪造）：\n原理：\n- 利用用户登录态\n- 伪造用户请求\n- 用户不知情\n\n防御：\n1. CSRF Token\n2. SameSite Cookie\n3. 验证Referer\n4. 验证码',
            category: 'browser',
            stars: 4
        },
        {
            id: 605,
            title: '浏览器渲染流程',
            content: '重绘、重排、合成层',
            answer: '浏览器渲染流程：\n\n流程：\n1. 解析HTML，构建DOM树\n2. 解析CSS，构建CSSOM树\n3. 合并为Render树\n4. 布局（Layout）：计算位置和尺寸\n5. 绘制（Paint）：像素渲染\n6. 合成（Composite）：层合并\n\n重排（Reflow）：\n- 元素尺寸、位置变化\n- 触发布局\n- 成本高\n\n重绘（Repaint）：\n- 颜色等样式变化\n- 不触发布局\n- 成本较低\n\n合成层：\n- transform、opacity\n- 不触发重排重绘\n- 直接合成\n- 性能最好',
            category: 'browser',
            stars: 3
        },
        {
            id: 606,
            title: '性能优化',
            content: '首屏优化、懒加载、虚拟滚动、资源压缩',
            answer: '性能优化：\n\n首屏优化：\n1. 代码分割\n2. 路由懒加载\n3. 组件懒加载\n4. 预加载\n5. SSR服务端渲染\n\n懒加载：\n1. 图片懒加载\n2. 组件懒加载\n3. 路由懒加载\n4. IntersectionObserver\n\n虚拟滚动：\n1. 只渲染可视区域\n2. 大数据列表\n3. 减少DOM数量\n\n资源压缩：\n1. Gzip压缩\n2. 图片压缩\n3. Tree Shaking\n4. 代码压缩\n\n其他：\n- CDN\n- 缓存策略\n- 减少HTTP请求\n- 预连接',
            category: 'browser',
            stars: 4
        },
        {
            id: 607,
            title: 'WebSocket',
            content: '与 HTTP 区别、心跳、重连',
            answer: 'WebSocket：\n\n与HTTP区别：\n- 全双工通信\n- 长连接\n- 实时性好\n- 基于TCP\n- HTTP握手建立连接\n\n心跳机制：\n- 定时发送心跳包\n- 保持连接活跃\n- 检测连接状态\n\n重连机制：\n- 断线自动重连\n- 指数退避\n- 最大重连次数',
            category: 'browser',
            stars: 3
        },
        {
            id: 608,
            title: 'Cookie / localStorage / sessionStorage',
            content: '区别？存储大小？安全性？',
            answer: 'Cookie/localStorage/sessionStorage：\n\n区别：\n\nCookie：\n- 大小：4KB\n- 过期时间：可设置\n- 发送请求：自动携带\n- 用途：会话管理\n- 安全性：HttpOnly、Secure\n\nlocalStorage：\n- 大小：5MB\n- 过期时间：永久\n- 发送请求：不携带\n- 用途：本地存储\n- 安全性：XSS风险\n\nsessionStorage：\n- 大小：5MB\n- 过期时间：标签页关闭\n- 发送请求：不携带\n- 用途：临时存储\n- 安全性：XSS风险',
            category: 'browser',
            stars: 3
        },
        {
            id: 701,
            title: '基础类型',
            content: 'any、unknown、never 区别',
            answer: 'TypeScript基础类型：\n\nany：\n- 任意类型\n- 绕过类型检查\n- 不推荐使用\n\nunknown：\n- 未知类型\n- 类型安全的any\n- 需要类型断言或缩小\n\nnever：\n- 永不存在的值\n- 函数抛出错误\n- 函数无限循环\n- 类型守卫',
            category: 'ts',
            stars: 0
        },
        {
            id: 702,
            title: '接口 vs 类型别名',
            content: '区别、扩展、合并',
            answer: '接口vs类型别名：\n\n区别：\n\ninterface（接口）：\n- 描述对象结构\n- 可以声明合并\n- 可以extends\n- 更面向对象\n\ntype（类型别名）：\n- 任意类型别名\n- 联合类型、交叉类型\n- 不能声明合并\n- 更灵活\n\n扩展：\n```typescript\n// interface extends\ninterface A extends B {}\n\n// type 交叉\ntype C = A & B\n```\n\n声明合并：\n```typescript\n// 可以合并\ninterface User {\n  name: string\n}\ninterface User {\n  age: number\n}\n```',
            category: 'ts',
            stars: 0
        },
        {
            id: 703,
            title: '泛型',
            content: '简单泛型函数、泛型约束',
            answer: 'TypeScript泛型：\n\n简单泛型函数：\n```typescript\nfunction identity<T>(arg: T): T {\n  return arg\n}\n\nconst result = identity<string>(\'hello\')\n```\n\n泛型约束：\n```typescript\ninterface Lengthwise {\n  length: number\n}\n\nfunction logLength<T extends Lengthwise>(arg: T): number {\n  return arg.length\n}\n```',
            category: 'ts',
            stars: 0
        },
        {
            id: 704,
            title: '工具类型',
            content: 'Partial、Pick、Omit、Record',
            answer: 'TypeScript工具类型：\n\nPartial：\n- 所有属性可选\n```typescript\ntype PartialUser = Partial<User>\n```\n\nPick：\n- 选取部分属性\n```typescript\ntype UserName = Pick<User, \'name\' | \'age\'>\n```\n\nOmit：\n- 排除部分属性\n```typescript\ntype UserWithoutAge = Omit<User, \'age\'>\n```\n\nRecord：\n- 构造对象类型\n```typescript\ntype UserMap = Record<string, User>\n```\n\n其他：\n- Required：所有属性必选\n- Readonly：只读\n- Exclude：排除类型\n- Extract：提取类型',
            category: 'ts',
            stars: 0
        },
        {
            id: 705,
            title: '类型守卫',
            content: 'typeof、instanceof、自定义守卫',
            answer: 'TypeScript类型守卫：\n\ntypeof：\n```typescript\nfunction isString(x: any): x is string {\n  return typeof x === \'string\'\n}\n```\n\ninstanceof：\n```typescript\nfunction isDate(x: any): x is Date {\n  return x instanceof Date\n}\n```\n\n自定义守卫：\n```typescript\ninterface Cat { meow(): void }\ninterface Dog { bark(): void }\n\nfunction isCat(animal: Cat | Dog): animal is Cat {\n  return \'meow\' in animal\n}\n```',
            category: 'ts',
            stars: 0
        },
        {
            id: 801,
            title: '设计模式',
            content: '观察者、发布订阅、单例、工厂（知道概念和应用）',
            answer: '设计模式：\n\n观察者模式：\n- 一对多依赖\n- 目标对象变化通知观察者\n- Vue响应式原理\n\n发布订阅模式：\n- 发布者和订阅者解耦\n- 事件总线\n- EventBus\n\n单例模式：\n- 全局唯一实例\n- 避免重复创建\n- 状态管理\n\n工厂模式：\n- 创建对象\n- 隐藏创建逻辑\n- 灵活性高\n\n其他常见：\n- 策略模式\n- 装饰器模式\n- 适配器模式\n- 代理模式',
            category: 'design',
            stars: 0
        },
        {
            id: 802,
            title: '简单算法',
            content: '数组去重、排序、斐波那契、回文判断',
            answer: '简单算法：\n\n数组去重：\n```javascript\n// Set\nconst unique = [...new Set(arr)]\n\n// reduce\nconst unique = arr.reduce((result, item) => {\n  if (!result.includes(item)) {\n    result.push(item)\n  }\n  return result\n}, [])\n```\n\n排序：\n- 冒泡排序\n- 快速排序\n- 数组sort\n\n斐波那契：\n```javascript\nfunction fib(n) {\n  if (n <= 1) return n\n  return fib(n - 1) + fib(n - 2)\n}\n```\n\n回文判断：\n```javascript\nfunction isPalindrome(str) {\n  return str === str.split(\'\').reverse().join(\'\')\n}\n```',
            category: 'design',
            stars: 0
        }
    ]
})
</script>

<style scoped>
.word-container {
    padding: var(--spacing-lg);
    max-width: 1200px;
    margin: 0 auto;
}

.word-header {
    margin-bottom: var(--spacing-lg);
}

.category-tabs {
    display: flex;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
    flex-wrap: wrap;
}

.category-btn {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: none;
    cursor: pointer;
    font-size: var(--font-size-sm);
    transition: all 0.2s ease;
}

.category-btn:hover {
    border-color: var(--color-primary);
    color: var(--color-primary);
}

.category-btn.active {
    background-color: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
}

.theory-section {
    min-height: 600px;
}

.theory-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.theory-item {
    background-color: var(--color-bg-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    border: 1px solid var(--color-border);
}

.theory-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.theory-header:hover .theory-title {
    color: var(--color-primary);
}

.theory-header-left {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
}

.theory-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-primary);
    margin: 0;
    transition: color var(--transition-fast);
}

.theory-stars {
    font-size: var(--font-size-sm);
}

.theory-arrow {
    width: 20px;
    height: 20px;
    color: var(--color-text-secondary);
    transition: transform var(--transition-fast);
    flex-shrink: 0;
    margin-top: 2px;
}

.theory-arrow.rotated {
    transform: rotate(180deg);
}

.theory-content {
    margin-bottom: var(--spacing-md);
    color: var(--color-text-secondary);
    line-height: 1.5;
}

.theory-answer {
    margin-top: var(--spacing-md);
    padding-top: var(--spacing-md);
    border-top: 1px solid var(--color-border);
}

.theory-answer h4 {
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
    color: var(--color-text-primary);
}

.theory-answer div {
    color: var(--color-text-secondary);
    line-height: 1.6;
    white-space: pre-line;
}

.expand-enter-active,
.expand-leave-active {
    transition: all var(--transition-normal) ease;
    overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
    opacity: 0;
    max-height: 0;
    transform: translateY(-10px);
}

.expand-enter-to,
.expand-leave-from {
    opacity: 1;
    max-height: 2000px;
    transform: translateY(0);
}

@media (max-width: 768px) {
    .word-container {
        padding: var(--spacing-md);
    }

    .category-tabs {
        gap: var(--spacing-xs);
    }

    .category-btn {
        font-size: var(--font-size-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
    }
}
</style>
