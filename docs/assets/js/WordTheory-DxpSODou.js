import{An as s,Ct as t,Dt as b,En as p,Et as w,Lt as r,Pt as j,Qt as l,St as d,bt as e,dt as k,qt as S,ut as x,vt as m,yt as _,zt as f}from"./index-Bqvbeewj.js";var P={class:"word-container"},C={class:"word-header"},T={class:"category-tabs"},O=["onClick"],M={class:"theory-section"},E={class:"theory-list"},D=["onClick"],V={class:"theory-header-left"},N={class:"theory-title"},W={key:0,class:"theory-stars"},R={class:"theory-content"},A={key:0,class:"theory-answer"},U=b({__name:"WordTheory",setup(B){const g=[{key:"vue",label:"Vue"},{key:"js",label:"JavaScript"},{key:"project",label:"项目"},{key:"code",label:"手写题"},{key:"engineering",label:"工程化"},{key:"browser",label:"浏览器"},{key:"ts",label:"TypeScript"},{key:"design",label:"设计模式"}],c=l("vue"),a=l(new Set),y=o=>{a.value.has(o)?a.value.delete(o):a.value.add(o)},u=l([]),v=_(()=>u.value.filter(o=>o.category===c.value));return j(()=>{u.value=[{id:101,title:"Vue2 响应式原理",content:"Object.defineProperty 怎么实现？数组怎么处理？缺点？",answer:`Vue2响应式原理（Object.defineProperty）：

1. 使用Object.defineProperty遍历对象的每个属性
2. 为每个属性添加getter和setter
3. 当访问属性时触发getter，进行依赖收集
4. 当修改属性时触发setter，通知依赖更新

数组处理：
- Vue2重写了数组的7个方法（push、pop、shift、unshift、splice、sort、reverse）
- 当调用这些方法时，会触发视图更新

缺点：
1. 无法检测对象新增属性
2. 无法检测对象删除属性
3. 无法检测数组索引变化
4. 无法检测数组长度变化`,category:"vue",stars:5},{id:102,title:"Vue3 响应式原理",content:"Proxy 比 defineProperty 好在哪里？懒代理是什么？",answer:`Vue3响应式原理（Proxy）：

Proxy的优势：
1. 可以检测对象新增属性
2. 可以检测对象删除属性
3. 可以检测数组索引和长度变化
4. 性能更好
5. 支持更多数据类型（Map、Set、WeakMap、WeakSet）

懒代理：
- Vue3的Proxy是懒代理，只有当访问到属性时才会进行代理
- 相比Vue2的一上来就递归遍历所有属性，性能更好`,category:"vue",stars:5},{id:103,title:"依赖收集与派发更新",content:"Dep 和 Watcher 的关系？",answer:`Dep 和 Watcher 的关系：

Dep（Dependency）：
- 依赖收集器，负责收集依赖
- 每个响应式属性都有一个Dep实例
- 内部维护一个subs数组，存储Watcher实例

Watcher：
- 观察者，负责订阅Dep
- 当响应式数据变化时，Dep会通知所有Watcher
- Watcher接收到通知后，执行相应的更新操作

关系：
1. 数据读取时，getter触发，Dep收集当前的Watcher
2. 数据更新时，setter触发，Dep通知所有收集的Watcher
3. Watcher收到通知，执行更新`,category:"vue",stars:4},{id:104,title:"nextTick 原理",content:"有什么用？怎么实现的？微任务还是宏任务？",answer:`nextTick原理：

作用：
- 在DOM更新后执行回调函数
- 确保获取到最新的DOM状态

实现原理：
1. 内部使用异步队列实现
2. 优先使用微任务（Promise.then）
3. 降级方案：MutationObserver、setImmediate、setTimeout

执行时机：
- 将回调函数推入队列，在下一次事件循环的微任务阶段执行
- 此时DOM已经更新完成

使用场景：
- 在created钩子中操作DOM
- 数据更新后立即获取DOM尺寸
- 响应式数据修改后，需要立即操作更新后的DOM`,category:"vue",stars:4},{id:105,title:"虚拟 DOM 和 diff 算法",content:"Vue2 和 Vue3 diff 区别？key 的作用？为什么不能用 index？",answer:`虚拟 DOM 和 diff 算法：

虚拟DOM：
1. 用JavaScript对象模拟DOM结构
2. 减少直接操作DOM的次数
3. 提高渲染性能

Vue2 vs Vue3 diff区别：
Vue2：
- 双端比较
- 有头尾指针
- 复杂度较高

Vue3：
- 单端比较
- 最长递增子序列
- 性能更好

key的作用：
1. 用于标识每个节点的唯一性
2. 帮助Vue的虚拟DOM算法识别哪些元素被添加、修改或删除
3. 提高DOM更新的性能
4. 避免因元素复用导致的状态混乱

为什么不能用index：
1. 当数组插入或删除元素时，index会变化
2. 导致不必要的DOM操作
3. 可能导致元素状态混乱`,category:"vue",stars:4},{id:106,title:"生命周期",content:"各阶段做什么？父子组件执行顺序？",answer:`生命周期：

Vue2生命周期：
1. beforeCreate：实例刚创建，data和methods还未初始化
2. created：实例创建完成，data和methods已初始化，可访问data
3. beforeMount：挂载前，模板已编译但未渲染
4. mounted：挂载完成，DOM已渲染
5. beforeUpdate：数据更新前
6. updated：数据更新完成
7. beforeDestroy：实例销毁前
8. destroyed：实例销毁完成

Vue3生命周期：
1. setup()：组合式API入口
2. onBeforeMount：挂载前
3. onMounted：挂载完成
4. onBeforeUpdate：更新前
5. onUpdated：更新完成
6. onBeforeUnmount：卸载前
7. onUnmounted：卸载完成

父子组件执行顺序：
挂载阶段：
父beforeCreate → 父created → 父beforeMount → 子beforeCreate → 子created → 子beforeMount → 子mounted → 父mounted

更新阶段：
父beforeUpdate → 子beforeUpdate → 子updated → 父updated

卸载阶段：
父beforeUnmount → 子beforeUnmount → 子unmounted → 父unmounted`,category:"vue",stars:5},{id:107,title:"computed 和 watch",content:"区别？计算属性为什么有缓存？",answer:`computed 和 watch的区别：

computed：
1. 计算属性，依赖于响应式数据
2. 有缓存，只有依赖变化时才会重新计算
3. 适合用于计算衍生值
4. 不能直接修改计算属性的值
5. 默认深度监听
6. 必须有返回值

watch：
1. 监听器，监听响应式数据的变化
2. 无缓存，数据变化时立即执行回调
3. 适合用于执行副作用操作（如API调用）
4. 可以修改其他数据
5. 默认浅监听，需要深度监听时需设置deep: true
6. 不需要返回值

为什么计算属性有缓存：
1. 基于响应式依赖进行缓存
2. 只有相关依赖发生改变时才会重新计算
3. 避免不必要的计算，提高性能
4. 适合多次访问但依赖不变的场景`,category:"vue",stars:5},{id:108,title:"组件通信",content:"8 种方式分别适用场景？兄弟组件怎么通信？",answer:`组件通信8种方式：

1. props / emit
   - 适用：父子组件通信
   - 父传子：props
   - 子传父：emit

2. $parent / $children
   - 适用：父子组件通信
   - 直接访问父子组件实例

3. $refs
   - 适用：父组件访问子组件实例
   - 可调用子组件方法和访问数据

4. provide / inject
   - 适用：祖先组件向后代组件注入依赖
   - 跨层级组件通信

5. eventBus
   - 适用：任意组件通信
   - 事件总线，发布订阅模式

6. Vuex/Pinia
   - 适用：全局状态共享
   - 大型应用状态管理

7. slot
   - 适用：父组件向子组件传递内容
   - 内容分发

8. attrs / listeners
   - 适用：透传属性和事件
   - 父组件向孙组件传递

兄弟组件通信：
1. eventBus
2. Vuex/Pinia
3. 通过共同父组件中转（子→父→子）`,category:"vue",stars:5},{id:109,title:"v-model 原理",content:"语法糖怎么实现？组件上怎么用多个 v-model？",answer:`v-model原理：

语法糖实现：
Vue2：
- :value="value" + @input="value = $event"

Vue3：
- :modelValue="value" + @update:modelValue="value = $event"

组件上多个v-model：
Vue3支持在组件上使用多个v-model：

\`\`\`vue
<ChildComponent
  v-model:title="pageTitle"
  v-model:content="pageContent"
/>

<!-- 相当于 -->
<ChildComponent
  :title="pageTitle"
  @update:title="pageTitle = $event"
  :content="pageContent"
  @update:content="pageContent = $event"
/>
\`\`\`

子组件接收：
\`\`\`vue
props: ['title', 'content'],
emits: ['update:title', 'update:content']
\`\`\``,category:"vue",stars:4},{id:110,title:"keep-alive",content:"作用？生命周期？",answer:`keep-alive：

作用：
1. 缓存组件实例，避免重复渲染
2. 保持组件状态
3. 提高性能

生命周期：
激活：
- activated：组件被激活时调用

停用：
- deactivated：组件被停用时调用

props：
- include：字符串或正则，只有名称匹配的组件会被缓存
- exclude：字符串或正则，名称匹配的组件不会被缓存
- max：数字，最多可以缓存多少组件实例

使用场景：
1. 表单填写，切换后保留内容
2. 列表详情页，返回保留滚动位置
3. Tab切换，保持各Tab状态`,category:"vue",stars:3},{id:111,title:"自定义指令",content:"用过吗？钩子函数？",answer:`自定义指令：

钩子函数：
Vue2：
- bind：指令第一次绑定到元素时调用
- inserted：被绑定元素插入父节点时调用
- update：所在组件的 VNode 更新时调用
- componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用
- unbind：指令与元素解绑时调用

Vue3：
- created：在绑定元素的 attribute 或事件监听器被应用之前调用
- beforeMount：当指令第一次绑定到元素并且在挂载父组件之前调用
- mounted：在绑定元素的父组件被挂载后调用
- beforeUpdate：在更新包含组件的 VNode 之前调用
- updated：在包含组件的 VNode 及其子组件的 VNode 更新后调用
- beforeUnmount：在卸载绑定元素的父组件之前调用
- unmounted：当指令与元素解除绑定且父组件已卸载时调用

常用自定义指令：
- v-loading：加载状态
- v-clickoutside：点击外部
- v-copy：复制
- v-debounce：防抖
- v-throttle：节流`,category:"vue",stars:2},{id:112,title:"Vue Router",content:"路由模式区别？导航守卫？懒加载原理？",answer:`Vue Router：

路由模式区别：
1. hash模式
   - URL带#号
   - 通过hashchange事件监听
   - 兼容性好
   - 不需要服务器配置

2. history模式
   - URL不带#号
   - 通过history.pushState和replaceState
   - 需要服务器配置支持
   - 更美观

导航守卫：
1. 全局守卫：beforeEach、beforeResolve、afterEach
2. 路由独享守卫：beforeEnter
3. 组件内守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave

执行顺序：
beforeEach → beforeEnter → beforeRouteEnter → beforeResolve → afterEach

懒加载原理：
1. 动态import()语法
2. Webpack会将动态import的代码单独打包
3. 路由访问时才加载对应的代码
4. 减小首屏加载体积`,category:"vue",stars:3},{id:113,title:"Vuex / Pinia",content:"核心概念？为什么需要 mutation？刷新数据丢失怎么办？",answer:`Vuex / Pinia：

Vuex核心概念：
1. State：状态
2. Getters：计算属性
3. Mutations：同步修改state
4. Actions：异步操作
5. Modules：模块化

Pinia核心概念：
1. State：状态
2. Getters：计算属性
3. Actions：同步和异步操作

为什么Vuex需要mutation：
1. 统一修改state的入口
2. 便于追踪状态变化
3. DevTools可以记录每次mutation
4. 保证状态变更可追踪

刷新数据丢失怎么办：
1. localStorage/sessionStorage
2. Vuex-persistedstate插件
3. 接口重新获取
4. URL参数保存`,category:"vue",stars:4},{id:201,title:"原型链",content:"__proto__ 和 prototype 区别？手写 instanceof？",answer:`原型链：

__proto__ 和 prototype 区别：
- __proto__：对象的原型
- prototype：构造函数的原型对象
- 关系：实例.__proto__ === 构造函数.prototype

原型链：
1. 每个对象都有一个原型对象__proto__
2. 原型对象也是一个对象，它也有自己的原型
3. 形成一个链式结构，直到Object.prototype
4. Object.prototype的原型是null

手写instanceof：
\`\`\`javascript
function myInstanceOf(obj, constructor) {
  let proto = obj.__proto__
  while (proto) {
    if (proto === constructor.prototype) {
      return true
    }
    proto = proto.__proto__
  }
  return false
}
\`\`\``,category:"js",stars:5},{id:202,title:"闭包",content:"定义？应用场景？内存泄漏怎么避免？",answer:`闭包：

定义：
闭包是指有权访问另一个函数作用域中变量的函数

特点：
1. 可以访问函数内部的变量
2. 变量不会被垃圾回收机制回收
3. 可以实现私有变量

应用场景：
1. 模块化开发
2. 防抖节流
3. 函数柯里化
4. 封装私有变量和方法
5. 循环中绑定事件

内存泄漏怎么避免：
1. 不再使用的闭包，及时解除引用
2. 避免在闭包中引用大对象
3. 使用弱引用（WeakMap、WeakSet）
4. 及时清除定时器和事件监听`,category:"js",stars:4},{id:203,title:"this 指向",content:"4 种绑定规则？箭头函数 this？",answer:`this指向：

4种绑定规则（优先级从高到低）：

1. 新绑定（new）
   - 使用new关键字调用构造函数时
   - this指向新创建的对象

2. 显式绑定（call/apply/bind）
   - 使用call、apply、bind方法
   - this指向传入的第一个参数

3. 隐式绑定
   - 通过对象调用方法时
   - this指向调用该方法的对象

4. 默认绑定
   - 在全局作用域或函数内部
   - this指向全局对象（浏览器中是window，Node.js中是global）

箭头函数this：
1. 没有自己的this
2. 继承外层作用域的this
3. 绑定后不可改变
4. 不能作为构造函数
5. 不能使用call/apply/bind改变this`,category:"js",stars:5},{id:204,title:"事件循环",content:"宏任务/微任务顺序？async/await 怎么执行？",answer:`事件循环：

宏任务vs微任务：

宏任务：
- setTimeout、setInterval
- I/O操作
- DOM事件
- requestAnimationFrame
- setImmediate（Node.js）

微任务：
- Promise.then/catch/finally
- async/await
- process.nextTick（Node.js）
- MutationObserver

执行顺序：
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 再次执行所有微任务
5. 循环...

async/await执行：
1. async函数返回Promise
2. await会暂停async函数执行
3. await后面的代码会被放入微任务队列
4. Promise解决后继续执行`,category:"js",stars:5},{id:205,title:"作用域",content:"词法作用域？块级作用域？",answer:`作用域：

词法作用域（静态作用域）：
- 函数的作用域在函数定义时就确定了
- 不是在调用时确定
- 由代码的书写位置决定

块级作用域：
- let和const声明的变量具有块级作用域
- 只在{}内有效
- 避免变量污染

作用域链：
- 用于变量查找
- 由词法作用域决定
- 从内向外查找，直到全局作用域`,category:"js",stars:3},{id:206,title:"ES6+ 常用特性",content:"let/const 区别？解构？Set/Map？",answer:`ES6+常用特性：

let/const/var区别：
- var：函数作用域，允许重复声明，变量提升
- let：块级作用域，不允许重复声明，暂时性死区
- const：块级作用域，不允许重复声明，声明后不可修改

解构赋值：
\`\`\`javascript
// 数组解构
const [a, b] = [1, 2]

// 对象解构
const { name, age } = { name: '张三', age: 18 }
\`\`\`

Set：
- 类似数组，但成员都是唯一的
- 没有重复值
- 常用于数组去重

Map：
- 键值对集合
- 键可以是任意类型
- 比Object更灵活

其他特性：
- 箭头函数
- Promise
- async/await
- 模板字符串
- 展开运算符
- 剩余参数
- 类（class）
- 模块（import/export）`,category:"js",stars:4},{id:207,title:"Promise",content:"手写 Promise.all / race？错误处理？",answer:`Promise：

Promise.all手写：
\`\`\`javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let count = 0
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        result[index] = value
        count++
        if (count === promises.length) {
          resolve(result)
        }
      }).catch(reject)
    })
  })
}
\`\`\`

Promise.race手写：
\`\`\`javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject)
    })
  })
}
\`\`\`

错误处理：
- catch()：捕获错误
- try/catch：配合async/await使用
- Promise.allSettled()：等待所有promise完成，无论成功失败`,category:"js",stars:5},{id:208,title:"async/await",content:"怎么转成 Promise？",answer:`async/await：

怎么转成Promise：

async函数本身就返回Promise：
\`\`\`javascript
async function fn() {
  return 123
}
fn() // 返回Promise {<fulfilled>: 123}
\`\`\`

try/catch捕获错误：
\`\`\`javascript
async function fn() {
  try {
    const result = await someAsync()
    return result
  } catch (error) {
    console.error(error)
  }
}
\`\`\`

await底层：
1. await后面的表达式会被包装成Promise
2. 暂停执行，等待Promise解决
3. Promise解决后继续执行
4. 相当于Promise.then的语法糖`,category:"js",stars:3},{id:209,title:"深拷贝 vs 浅拷贝",content:"手写深拷贝（考虑循环引用）",answer:`深拷贝vs浅拷贝：

浅拷贝：
- 只复制对象的引用
- 修改新对象会影响原对象
- 方法：Object.assign、展开运算符、Array.prototype.slice()

深拷贝：
- 完全复制对象及其嵌套对象
- 修改新对象不影响原对象
- 方法：JSON.parse(JSON.stringify())、递归复制

手写深拷贝（考虑循环引用）：
\`\`\`javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (map.has(obj)) {
    return map.get(obj)
  }
  let clone = Array.isArray(obj) ? [] : {}
  map.set(obj, clone)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map)
    }
  }
  return clone
}
\`\`\`

注意：
- WeakMap处理循环引用
- 特殊对象需要单独处理（Date、RegExp、Function等）`,category:"js",stars:5},{id:210,title:"防抖与节流",content:"手写？区别？应用场景？",answer:`防抖与节流：

防抖（debounce）：
- 在事件触发n秒后再执行回调
- 如果在n秒内又触发，则重新计时

手写防抖：
\`\`\`javascript
function debounce(func, wait, immediate) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
\`\`\`

节流（throttle）：
- 规定在一个单位时间内，只能触发一次
- 如果单位时间内多次触发，只执行一次

手写节流：
\`\`\`javascript
// 时间戳版
function throttle1(func, wait) {
  let previous = 0
  return function() {
    const now = Date.now()
    const context = this
    const args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}

// 定时器版
function throttle2(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
\`\`\`

应用场景：
防抖：
- 搜索框输入
- 窗口大小调整
- 表单验证

节流：
- 滚动加载
- 鼠标移动
- 按钮点击`,category:"js",stars:5},{id:211,title:"数组方法",content:"map/forEach/filter/reduce 区别？手写 reduce？",answer:`数组方法：

区别：
- map：返回新数组，每个元素是回调返回值
- forEach：遍历数组，无返回值
- filter：返回新数组，包含满足条件的元素
- reduce：累加器，返回单个值

手写reduce：
\`\`\`javascript
Array.prototype.myReduce = function(callback, initialValue) {
  let accumulator = initialValue !== undefined ? initialValue : this[0]
  let startIndex = initialValue !== undefined ? 0 : 1
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this)
  }
  return accumulator
}
\`\`\``,category:"js",stars:3},{id:212,title:"类型判断",content:"typeof 和 instanceof 局限性？Object.prototype.toString？",answer:`类型判断：

typeof：
- 返回字符串，表示类型
- 局限性：
  - null返回"object"
  - 数组返回"object"
  - 大部分对象都返回"object"

instanceof：
- 检查原型链
- 局限性：
  - 只能判断对象类型
  - 不能判断基本类型
  - 跨iframe不生效

Object.prototype.toString.call()：
- 最准确的类型判断
- 返回"[object Type]"格式

常用：
\`\`\`javascript
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}
\`\`\``,category:"js",stars:3},{id:301,title:"大文件上传（分片续传）",content:"分片逻辑、hash 计算（Web Worker）、断点续传、并发控制、暂停恢复",answer:`大文件上传：

准备方向：背景 → 难点 → 方案 → 成果（量化）

分片逻辑：
1. 将大文件按固定大小切片（如5MB）
2. 每个分片计算hash值
3. 并发上传多个分片
4. 服务端合并分片

hash计算：
1. 使用Web Worker避免阻塞主线程
2. spark-md5库计算
3. 可以抽样计算提高速度

断点续传：
1. 上传前查询服务端已上传的分片
2. 只上传未上传的分片
3. 本地保存上传进度

并发控制：
1. 限制同时上传的分片数量（如3个）
2. 一个完成后开始下一个
3. 避免并发过多导致卡顿

暂停恢复：
1. 暂停时取消当前请求
2. 保存已上传分片列表
3. 恢复时从断点继续

常见追问：
- 怎么计算 hash？
- 怎么处理网络中断？
- 怎么保证秒传？`,category:"project",stars:0},{id:302,title:"WebSocket 消息推送",content:"心跳机制、断线重连（指数退避）、消息补偿、多模块分发",answer:`WebSocket消息推送：

准备方向：背景 → 难点 → 方案 → 成果（量化）

心跳机制：
1. 定时发送心跳包
2. 服务端超时判断断开
3. 避免误判

断线重连：
1. 指数退避：重连间隔递增（1s、2s、4s、8s...）
2. 最大间隔限制
3. 手动重连选项

消息补偿：
1. 服务端保存未读消息
2. 重连后同步消息
3. 消息id去重

多模块分发：
1. 消息类型分类
2. 不同模块订阅不同消息
3. 消息队列管理

常见追问：
- 怎么防止误判？
- 断线期间消息怎么补？`,category:"project",stars:0},{id:303,title:"OpenLayers 地图优化",content:"点聚合、按需加载、热力图原理、10万点渲染优化",answer:`OpenLayers地图优化：

准备方向：背景 → 难点 → 方案 → 成果（量化）

点聚合：
1. 按缩放级别聚合相近的点
2. 减少渲染数量
3. 提高性能

按需加载：
1. 视口内加载
2. 分页或分片
3. 减少数据量

热力图原理：
1. 基于点密度计算
2. 颜色渐变表示热度
3. canvas绘制

10万点渲染优化：
1. WebGL渲染
2. 聚合显示
3. 视口裁剪
4. LOD（细节层次）

常见追问：
- 10万个点怎么渲染？
- 热力图原理是什么？`,category:"project",stars:0},{id:304,title:"低代码平台渲染器",content:"动态组件、JSON Schema、事件绑定、组件通信",answer:`低代码平台渲染器：

准备方向：背景 → 难点 → 方案 → 成果（量化）

动态组件：
1. component :is
2. 动态渲染
3. 组件注册

JSON Schema：
1. 描述页面结构
2. 组件配置
3. 属性绑定

事件绑定：
1. 事件配置
2. 动态绑定
3. 事件处理函数

组件通信：
1. 全局状态
2. 事件总线
3. props/emit

常见追问：
- 怎么设计页面渲染器？
- 怎么实现组件间通信？`,category:"project",stars:0},{id:305,title:"iframe 嵌套 + 通信",content:"为什么选 iframe、postMessage、样式隔离、高度自适应、路由同步",answer:`iframe嵌套+通信：

准备方向：背景 → 难点 → 方案 → 成果（量化）

为什么选iframe：
1. 样式隔离
2. JS隔离
3. 独立环境
4. 微前端方案

postMessage：
1. 跨域通信
2. origin验证
3. 消息序列化

样式隔离：
1. iframe天然隔离
2. 沙箱环境
3. 样式不污染

高度自适应：
1. postMessage通信高度
2. resize监听
3. 动态设置iframe高度

路由同步：
1. 主路由和子路由同步
2. history.pushState
3. hash变化监听

常见追问：
- 样式怎么隔离？
- 怎么传参？
- 怎么同步路由？`,category:"project",stars:0},{id:306,title:"虚拟滚动（树/列表）",content:"拍平树结构、可视区域计算、buffer、不定高度处理",answer:`虚拟滚动：

准备方向：背景 → 难点 → 方案 → 成果（量化）

拍平树结构：
1. 树形转扁平数组
2. 展开状态管理
3. 层级信息保留

可视区域计算：
1. 滚动位置
2. 元素高度
3. 起始结束索引

buffer：
1. 上下各多渲染几个
2. 防止滚动白屏
3. 提高体验

不定高度处理：
1. 预估高度
2. 实际高度缓存
3. 动态调整

常见追问：
- 怎么计算起始结束索引？
- 不定高度怎么处理？`,category:"project",stars:0},{id:307,title:"双 Token 无感续期",content:"请求队列、状态锁、刷新 token、并发请求处理",answer:`双Token无感续期：

准备方向：背景 → 难点 → 方案 → 成果（量化）

请求队列：
1. 401时暂存请求
2. token刷新后重试
3. 保证请求不丢失

状态锁：
1. 防止多次刷新token
2. 刷新中标记
3. 避免重复请求

刷新token：
1. access token + refresh token
2. access过期用refresh刷新
3. refresh过期重新登录

并发请求处理：
1. 多个401只刷新一次
2. 刷新后重试所有队列
3. 避免并发刷新

常见追问：
- 怎么避免多次刷新？
- refresh_token过期怎么处理？`,category:"project",stars:0},{id:401,title:"防抖",content:"immediate 参数、clearTimeout、this 指向",answer:`防抖手写：

关键点：
1. immediate参数：是否立即执行
2. clearTimeout：清除定时器
3. this指向：保证正确的this

代码：
\`\`\`javascript
function debounce(func, wait, immediate) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (timeout) clearTimeout(timeout)
    if (immediate) {
      const callNow = !timeout
      timeout = setTimeout(() => {
        timeout = null
      }, wait)
      if (callNow) func.apply(context, args)
    } else {
      timeout = setTimeout(() => {
        func.apply(context, args)
      }, wait)
    }
  }
}
\`\`\``,category:"code",stars:0},{id:402,title:"节流",content:"时间戳 + 定时器、remaining 计算",answer:`节流手写：

关键点：
1. 时间戳版：立即执行
2. 定时器版：延迟执行
3. remaining：剩余时间

时间戳版：
\`\`\`javascript
function throttle(func, wait) {
  let previous = 0
  return function() {
    const now = Date.now()
    const context = this
    const args = arguments
    if (now - previous > wait) {
      func.apply(context, args)
      previous = now
    }
  }
}
\`\`\`

定时器版：
\`\`\`javascript
function throttle(func, wait) {
  let timeout
  return function() {
    const context = this
    const args = arguments
    if (!timeout) {
      timeout = setTimeout(() => {
        timeout = null
        func.apply(context, args)
      }, wait)
    }
  }
}
\`\`\``,category:"code",stars:0},{id:403,title:"深拷贝",content:"WeakMap 解决循环引用、特殊对象（Date/RegExp）",answer:`深拷贝手写：

关键点：
1. WeakMap：解决循环引用
2. 特殊对象：Date、RegExp等单独处理
3. 递归：深度复制

代码：
\`\`\`javascript
function deepClone(obj, map = new WeakMap()) {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj)
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags)
  }
  if (map.has(obj)) {
    return map.get(obj)
  }
  let clone = Array.isArray(obj) ? [] : {}
  map.set(obj, clone)
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = deepClone(obj[key], map)
    }
  }
  return clone
}
\`\`\``,category:"code",stars:0},{id:404,title:"Promise.all",content:"计数器、结果顺序、错误处理",answer:`Promise.all手写：

关键点：
1. 计数器：计数完成的Promise
2. 结果顺序：按输入顺序保存
3. 错误处理：任一失败就失败

代码：
\`\`\`javascript
function promiseAll(promises) {
  return new Promise((resolve, reject) => {
    let result = []
    let count = 0
    promises.forEach((promise, index) => {
      Promise.resolve(promise).then(value => {
        result[index] = value
        count++
        if (count === promises.length) {
          resolve(result)
        }
      }).catch(reject)
    })
  })
}
\`\`\``,category:"code",stars:0},{id:405,title:"Promise.race",content:"谁快就听谁的",answer:`Promise.race手写：

关键点：
1. 谁先完成就用谁的结果
2. 任一成功或失败都返回

代码：
\`\`\`javascript
function promiseRace(promises) {
  return new Promise((resolve, reject) => {
    promises.forEach(promise => {
      Promise.resolve(promise).then(resolve).catch(reject)
    })
  })
}
\`\`\``,category:"code",stars:0},{id:406,title:"事件总线（Event Bus）",content:"on/emit/off/once、filter 要赋值",answer:`事件总线手写：

关键点：
1. on：注册事件
2. emit：触发事件
3. off：取消事件
4. once：只执行一次

代码：
\`\`\`javascript
class EventBus {
  constructor() {
    this.events = {}
  }
  
  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }
  
  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach(callback => {
        callback(...args)
      })
    }
  }
  
  off(event, callback) {
    if (this.events[event]) {
      if (callback) {
        this.events[event] = this.events[event].filter(cb => cb !== callback)
      } else {
        delete this.events[event]
      }
    }
  }
  
  once(event, callback) {
    const onceCallback = (...args) => {
      callback(...args)
      this.off(event, onceCallback)
    }
    this.on(event, onceCallback)
  }
}
\`\`\``,category:"code",stars:0},{id:407,title:"数组扁平化",content:"reduce + 递归、控制深度",answer:`数组扁平化手写：

关键点：
1. reduce + 递归
2. 控制深度

代码：
\`\`\`javascript
function flatten(arr, depth = 1) {
  return arr.reduce((result, item) => {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flatten(item, depth - 1))
    } else {
      result.push(item)
    }
    return result
  }, [])
}
\`\`\``,category:"code",stars:0},{id:408,title:"new 操作符",content:"创建对象、原型链、返回值判断",answer:`new操作符手写：

关键点：
1. 创建新对象
2. 原型链连接
3. this绑定
4. 返回值判断

代码：
\`\`\`javascript
function myNew(constructor, ...args) {
  const obj = Object.create(constructor.prototype)
  const result = constructor.apply(obj, args)
  return result && typeof result === 'object' ? result : obj
}
\`\`\``,category:"code",stars:0},{id:409,title:"call/apply/bind",content:"手写、参数处理",answer:`call/apply/bind手写：

call：
\`\`\`javascript
Function.prototype.myCall = function(context, ...args) {
  context = context || window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}
\`\`\`

apply：
\`\`\`javascript
Function.prototype.myApply = function(context, args) {
  context = context || window
  context.fn = this
  const result = context.fn(...args)
  delete context.fn
  return result
}
\`\`\`

bind：
\`\`\`javascript
Function.prototype.myBind = function(context, ...args) {
  const fn = this
  return function(...innerArgs) {
    return fn.apply(context, [...args, ...innerArgs])
  }
}
\`\`\``,category:"code",stars:0},{id:410,title:"instanceof",content:"原型链查找",answer:`instanceof手写：

关键点：
1. 原型链查找
2. 直到null

代码：
\`\`\`javascript
function myInstanceOf(obj, constructor) {
  let proto = obj.__proto__
  while (proto) {
    if (proto === constructor.prototype) {
      return true
    }
    proto = proto.__proto__
  }
  return false
}
\`\`\``,category:"code",stars:0},{id:411,title:"Object.create",content:"手写",answer:`Object.create手写：

代码：
\`\`\`javascript
function create(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
\`\`\``,category:"code",stars:0},{id:412,title:"函数柯里化",content:"add(1)(2)(3)",answer:`函数柯里化手写：

关键点：
1. 参数收集
2. 递归返回函数
3. 满足条件执行

代码：
\`\`\`javascript
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...moreArgs) {
        return curried.apply(this, [...args, ...moreArgs])
      }
    }
  }
}

// 或简单版
function add(a) {
  return function(b) {
    return function(c) {
      return a + b + c
    }
  }
}
\`\`\``,category:"code",stars:0},{id:501,title:"Webpack 核心概念",content:"loader 和 plugin 区别？常用 loader/plugin 有哪些？",answer:`Webpack核心概念：

loader和plugin区别：

loader：
- 模块转换器
- 将非JS文件转换为webpack能处理的模块
- 在module.rules中配置
- 链式调用，从右向左执行

常用loader：
- babel-loader：转译ES6+
- css-loader：处理CSS
- style-loader：注入style标签
- less/sass-loader：预处理CSS
- file-loader：文件处理
- url-loader：base64转换

plugin：
- 扩展器
- 在整个编译周期中执行
- 可以访问compiler和compilation
- 功能更强大

常用plugin：
- HtmlWebpackPlugin：生成HTML
- MiniCssExtractPlugin：提取CSS
- CleanWebpackPlugin：清理目录
- DefinePlugin：定义全局变量`,category:"engineering",stars:4},{id:502,title:"打包优化",content:"代码分割、Tree Shaking、Gzip、图片压缩、CDN 怎么配置？",answer:`打包优化：

代码分割：
1. splitChunks：提取公共代码
2. 动态import：按需加载
3. 减少首屏体积

Tree Shaking：
1. 消除未使用的代码
2. ES6模块静态分析
3. sideEffects配置

Gzip压缩：
1. CompressionWebpackPlugin
2. 服务端配合
3. 减小传输体积

图片压缩：
1. image-webpack-loader
2. 转WebP格式
3. 按需选择

CDN配置：
1. externals：排除第三方库
2. html-webpack-cdn-plugin
3. 公共资源CDN`,category:"engineering",stars:4},{id:503,title:"Vite 原理",content:"为什么快？ESM、esbuild、按需编译",answer:`Vite原理：

为什么快：

1. ESM（ES Module）
- 浏览器原生支持ES模块
- 不需要打包成bundle
- 按需加载模块

2. esbuild
- 使用Go语言编写
- 比JS快10-100倍
- 预构建依赖

3. 按需编译
- 只编译当前用到的模块
- 不是全量编译
- 开发模式极快

4. HMR（热更新）
- 基于ESM
- 速度不随项目变大而变慢

5. 生产环境
- 使用Rollup打包
- Tree Shaking更彻底`,category:"engineering",stars:4},{id:504,title:"Babel",content:"作用？preset 和 plugin 区别？preset-env 是什么？",answer:`Babel：

作用：
- 将ES6+代码转译为ES5
- 语法转换
- polyfill填充

preset和plugin区别：

plugin：
- 单个功能
- 比如@babel/plugin-transform-arrow-functions

preset：
- 插件集合
- 预设一组插件
- 比如@babel/preset-env

preset-env：
- 智能预设
- 根据目标浏览器自动选择需要的插件
- 配合browserslist使用
- useBuiltIns配置polyfill`,category:"engineering",stars:3},{id:505,title:"Tree Shaking",content:"条件？sideEffects 怎么配？",answer:`Tree Shaking：

条件：
1. ES6模块（import/export）
2. 生产模式
3. 纯函数（无副作用）
4. usedExports: true

sideEffects配置：
\`\`\`json
{
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/utils/side-effect.js"
  ]
}
\`\`\`

说明：
- false：所有文件都无副作用，可安全删除
- 数组：列出有副作用的文件
- 未列出的可tree shaking`,category:"engineering",stars:3},{id:506,title:"代码分割",content:"动态 import、splitChunks",answer:`代码分割：

动态import：
\`\`\`javascript
const Component = () => import('./Component.vue')
\`\`\`

splitChunks配置：
\`\`\`javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendors: {
        test: /[\\\\/]node_modules[\\\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      common: {
        name: 'common',
        minChunks: 2,
        chunks: 'all'
      }
    }
  }
}
\`\`\``,category:"engineering",stars:3},{id:507,title:"Source Map",content:"作用？开发/生产用哪种？",answer:`Source Map：

作用：
- 映射打包后的代码到源代码
- 方便调试
- 错误定位

类型：
- eval：最快，开发用
- cheap-source-map：较快
- cheap-module-source-map：推荐开发
- source-map：完整，生产可配置

开发环境：
- cheap-module-source-map

生产环境：
- source-map（如果需要）
- hidden-source-map（只有错误报告）
- 或不生成`,category:"engineering",stars:2},{id:508,title:"环境变量",content:"process.env、DefinePlugin",answer:`环境变量：

process.env：
- Node.js环境变量
- webpack中可访问

DefinePlugin：
\`\`\`javascript
new webpack.DefinePlugin({
  'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
  'process.env.API_BASE': JSON.stringify(process.env.API_BASE)
})
\`\`\`

Vite环境变量：
- .env文件
- import.meta.env
- VITE_前缀`,category:"engineering",stars:2},{id:509,title:"Git",content:"常用命令、冲突解决、rebase 和 merge 区别",answer:`Git：

常用命令：
- git clone：克隆
- git add：添加
- git commit：提交
- git push：推送
- git pull：拉取
- git branch：分支
- git checkout：切换
- git merge：合并
- git rebase：变基
- git log：日志
- git status：状态
- git reset：重置
- git stash：暂存

冲突解决：
1. 查看冲突文件
2. 手动编辑冲突标记
3. git add标记解决
4. git commit完成

rebase vs merge：

merge：
- 合并分支
- 产生merge commit
- 保留完整历史

rebase：
- 变基
- 线性历史
- 更整洁`,category:"engineering",stars:2},{id:601,title:"事件循环",content:"宏任务/微任务顺序、async/await 执行",answer:`事件循环（浏览器）：

执行顺序：
1. 执行同步代码
2. 执行所有微任务
3. 执行一个宏任务
4. 再次执行所有微任务
5. 渲染
6. 循环...

宏任务：
- setTimeout、setInterval
- requestAnimationFrame
- I/O
- DOM事件

微任务：
- Promise.then/catch/finally
- async/await
- MutationObserver`,category:"browser",stars:5},{id:602,title:"HTTP 缓存",content:"强缓存、协商缓存、Cache-Control、ETag",answer:`HTTP缓存：

强缓存：
- Cache-Control：max-age=3600
- Expires：过期时间
- 200 (from memory/disk cache)
- 不请求服务器

协商缓存：
- ETag：资源标识
- Last-Modified：最后修改
- 304 Not Modified
- 请求服务器验证

Cache-Control：
- max-age：缓存时间
- no-cache：协商缓存
- no-store：不缓存
- public：可被代理缓存
- private：仅浏览器缓存`,category:"browser",stars:4},{id:603,title:"跨域",content:"CORS、JSONP、代理、postMessage",answer:`跨域：

同源策略：
- 协议、域名、端口都相同
- 保护用户安全

解决方案：

1. CORS（推荐）
- 服务端设置Access-Control-Allow-Origin
- 简单请求和复杂请求
- 预检请求OPTIONS

2. JSONP
- 利用script标签跨域
- 只能GET
- 安全性较差

3. 代理
- 开发环境proxy
- Nginx反向代理

4. postMessage
- iframe通信
- 父子窗口通信`,category:"browser",stars:4},{id:604,title:"XSS / CSRF",content:"原理、防御措施（CSP、Token、SameSite）",answer:`XSS/CSRF：

XSS（跨站脚本攻击）：
原理：
- 注入恶意脚本
- 盗取Cookie
- 执行恶意操作

防御：
1. 输入输出转义
2. CSP内容安全策略
3. HttpOnly Cookie
4. 白名单过滤

CSRF（跨站请求伪造）：
原理：
- 利用用户登录态
- 伪造用户请求
- 用户不知情

防御：
1. CSRF Token
2. SameSite Cookie
3. 验证Referer
4. 验证码`,category:"browser",stars:4},{id:605,title:"浏览器渲染流程",content:"重绘、重排、合成层",answer:`浏览器渲染流程：

流程：
1. 解析HTML，构建DOM树
2. 解析CSS，构建CSSOM树
3. 合并为Render树
4. 布局（Layout）：计算位置和尺寸
5. 绘制（Paint）：像素渲染
6. 合成（Composite）：层合并

重排（Reflow）：
- 元素尺寸、位置变化
- 触发布局
- 成本高

重绘（Repaint）：
- 颜色等样式变化
- 不触发布局
- 成本较低

合成层：
- transform、opacity
- 不触发重排重绘
- 直接合成
- 性能最好`,category:"browser",stars:3},{id:606,title:"性能优化",content:"首屏优化、懒加载、虚拟滚动、资源压缩",answer:`性能优化：

首屏优化：
1. 代码分割
2. 路由懒加载
3. 组件懒加载
4. 预加载
5. SSR服务端渲染

懒加载：
1. 图片懒加载
2. 组件懒加载
3. 路由懒加载
4. IntersectionObserver

虚拟滚动：
1. 只渲染可视区域
2. 大数据列表
3. 减少DOM数量

资源压缩：
1. Gzip压缩
2. 图片压缩
3. Tree Shaking
4. 代码压缩

其他：
- CDN
- 缓存策略
- 减少HTTP请求
- 预连接`,category:"browser",stars:4},{id:607,title:"WebSocket",content:"与 HTTP 区别、心跳、重连",answer:`WebSocket：

与HTTP区别：
- 全双工通信
- 长连接
- 实时性好
- 基于TCP
- HTTP握手建立连接

心跳机制：
- 定时发送心跳包
- 保持连接活跃
- 检测连接状态

重连机制：
- 断线自动重连
- 指数退避
- 最大重连次数`,category:"browser",stars:3},{id:608,title:"Cookie / localStorage / sessionStorage",content:"区别？存储大小？安全性？",answer:`Cookie/localStorage/sessionStorage：

区别：

Cookie：
- 大小：4KB
- 过期时间：可设置
- 发送请求：自动携带
- 用途：会话管理
- 安全性：HttpOnly、Secure

localStorage：
- 大小：5MB
- 过期时间：永久
- 发送请求：不携带
- 用途：本地存储
- 安全性：XSS风险

sessionStorage：
- 大小：5MB
- 过期时间：标签页关闭
- 发送请求：不携带
- 用途：临时存储
- 安全性：XSS风险`,category:"browser",stars:3},{id:701,title:"基础类型",content:"any、unknown、never 区别",answer:`TypeScript基础类型：

any：
- 任意类型
- 绕过类型检查
- 不推荐使用

unknown：
- 未知类型
- 类型安全的any
- 需要类型断言或缩小

never：
- 永不存在的值
- 函数抛出错误
- 函数无限循环
- 类型守卫`,category:"ts",stars:0},{id:702,title:"接口 vs 类型别名",content:"区别、扩展、合并",answer:`接口vs类型别名：

区别：

interface（接口）：
- 描述对象结构
- 可以声明合并
- 可以extends
- 更面向对象

type（类型别名）：
- 任意类型别名
- 联合类型、交叉类型
- 不能声明合并
- 更灵活

扩展：
\`\`\`typescript
// interface extends
interface A extends B {}

// type 交叉
type C = A & B
\`\`\`

声明合并：
\`\`\`typescript
// 可以合并
interface User {
  name: string
}
interface User {
  age: number
}
\`\`\``,category:"ts",stars:0},{id:703,title:"泛型",content:"简单泛型函数、泛型约束",answer:`TypeScript泛型：

简单泛型函数：
\`\`\`typescript
function identity<T>(arg: T): T {
  return arg
}

const result = identity<string>('hello')
\`\`\`

泛型约束：
\`\`\`typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): number {
  return arg.length
}
\`\`\``,category:"ts",stars:0},{id:704,title:"工具类型",content:"Partial、Pick、Omit、Record",answer:`TypeScript工具类型：

Partial：
- 所有属性可选
\`\`\`typescript
type PartialUser = Partial<User>
\`\`\`

Pick：
- 选取部分属性
\`\`\`typescript
type UserName = Pick<User, 'name' | 'age'>
\`\`\`

Omit：
- 排除部分属性
\`\`\`typescript
type UserWithoutAge = Omit<User, 'age'>
\`\`\`

Record：
- 构造对象类型
\`\`\`typescript
type UserMap = Record<string, User>
\`\`\`

其他：
- Required：所有属性必选
- Readonly：只读
- Exclude：排除类型
- Extract：提取类型`,category:"ts",stars:0},{id:705,title:"类型守卫",content:"typeof、instanceof、自定义守卫",answer:`TypeScript类型守卫：

typeof：
\`\`\`typescript
function isString(x: any): x is string {
  return typeof x === 'string'
}
\`\`\`

instanceof：
\`\`\`typescript
function isDate(x: any): x is Date {
  return x instanceof Date
}
\`\`\`

自定义守卫：
\`\`\`typescript
interface Cat { meow(): void }
interface Dog { bark(): void }

function isCat(animal: Cat | Dog): animal is Cat {
  return 'meow' in animal
}
\`\`\``,category:"ts",stars:0},{id:801,title:"设计模式",content:"观察者、发布订阅、单例、工厂（知道概念和应用）",answer:`设计模式：

观察者模式：
- 一对多依赖
- 目标对象变化通知观察者
- Vue响应式原理

发布订阅模式：
- 发布者和订阅者解耦
- 事件总线
- EventBus

单例模式：
- 全局唯一实例
- 避免重复创建
- 状态管理

工厂模式：
- 创建对象
- 隐藏创建逻辑
- 灵活性高

其他常见：
- 策略模式
- 装饰器模式
- 适配器模式
- 代理模式`,category:"design",stars:0},{id:802,title:"简单算法",content:"数组去重、排序、斐波那契、回文判断",answer:`简单算法：

数组去重：
\`\`\`javascript
// Set
const unique = [...new Set(arr)]

// reduce
const unique = arr.reduce((result, item) => {
  if (!result.includes(item)) {
    result.push(item)
  }
  return result
}, [])
\`\`\`

排序：
- 冒泡排序
- 快速排序
- 数组sort

斐波那契：
\`\`\`javascript
function fib(n) {
  if (n <= 1) return n
  return fib(n - 1) + fib(n - 2)
}
\`\`\`

回文判断：
\`\`\`javascript
function isPalindrome(str) {
  return str === str.split('').reverse().join('')
}
\`\`\``,category:"design",stars:0}]}),(o,i)=>(r(),t("div",P,[e("div",C,[e("div",T,[(r(),t(m,null,f(g,n=>e("button",{key:n.key,class:p(["category-btn",{active:c.value===n.key}]),onClick:h=>c.value=n.key},s(n.label),11,O)),64))])]),e("div",M,[e("div",E,[(r(!0),t(m,null,f(v.value,n=>(r(),t("div",{key:n.id,class:"theory-item"},[e("div",{class:"theory-header",onClick:h=>y(n.id)},[e("div",V,[e("h3",N,s(n.title),1),n.stars?(r(),t("span",W,s("⭐".repeat(n.stars)),1)):d("",!0)]),(r(),t("svg",{class:p(["theory-arrow",{rotated:a.value.has(n.id)}]),xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor"},[...i[0]||(i[0]=[e("path",{"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M19 9l-7 7-7-7"},null,-1)])],2))],8,D),e("div",R,s(n.content),1),w(k,{name:"expand"},{default:S(()=>[n.answer&&a.value.has(n.id)?(r(),t("div",A,[i[1]||(i[1]=e("h4",null,"答案：",-1)),e("div",null,s(n.answer),1)])):d("",!0)]),_:2},1024)]))),128))])])]))}}),L=x(U,[["__scopeId","data-v-03c04f77"]]);export{L as default};
