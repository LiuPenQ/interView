// 使用 @ts-ignore 绕过 vuex 类型声明解析问题
// @ts-ignore
import { createStore } from 'vuex'
import user from './modules/user'

// Vuex 根状态接口
interface RootState {
  appName: string
  version: string
}

// 创建 Vuex store
export default createStore({
  // 根状态
  state: {
    appName: 'Vuex 示例应用',
    version: '1.0.0'
  } as RootState,

  // Getters - 计算属性
  getters: {
    // 获取应用信息
    appInfo: (state: RootState) => {
      return `${state.appName} v${state.version}`
    }
  },

  // Mutations - 同步修改状态
  mutations: {
    // 更新应用名称
    UPDATE_APP_NAME(state: RootState, name: string) {
      state.appName = name
    },

    // 更新版本号
    UPDATE_VERSION(state: RootState, version: string) {
      state.version = version
    }
  },

  // Actions - 异步操作
  actions: {
    // 异步更新应用信息
    async updateAppInfo({ commit }: any, { name }: { name: string }, { version }: { version: string }) {
      // 模拟异步操作
      await new Promise(resolve => setTimeout(resolve, 500))
      
      commit('UPDATE_APP_NAME', name)
      commit('UPDATE_VERSION', version)
    }
  },

  // 模块
  modules: {
    user
  }
})
