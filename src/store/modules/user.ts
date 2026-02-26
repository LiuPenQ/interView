// User 模块
import { getAccessToken, setAccessToken, removeAccessToken, getUserInfo, setUserInfo, removeUserInfo, setRefreshToken, getRefreshToken, removeRefreshToken } from '../../utils/auth'
import api from '../../services/api'

// 用户接口
interface User {
  id: string
  username: string
  email: string
  role: 'admin' | 'user' | 'guest'
  isLoggedIn: boolean
}

// 模块状态接口
interface UserState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// 从localStorage加载用户数据
const loadUserFromStorage = (): User | null => {
  return getUserInfo()
}

// 从cookie加载token
const loadTokenFromStorage = (): string | null => {
  return getAccessToken()
}

// 保存用户数据到localStorage
const saveUserToStorage = (user: User | null) => {
  if (user) {
    setUserInfo(user)
  } else {
    removeUserInfo()
  }
}

// 保存token到cookie
const saveTokenToStorage = (token: string | null) => {
  if (token) {
    setAccessToken(token)
  } else {
    removeAccessToken()
  }
}

// 模块状态
const state = {
  user: loadUserFromStorage(),
  token: loadTokenFromStorage(),
  loading: false,
  error: null
} as UserState

// Getters
const getters = {
  // 获取当前用户
  currentUser: (state: UserState) => state.user,
  
  // 获取token
  getToken: (state: UserState) => state.token,
  
  // 检查是否登录
  isLoggedIn: (state: UserState) => state.user?.isLoggedIn || false,
  
  // 检查是否为管理员
  isAdmin: (state: UserState) => state.user?.role === 'admin',
  
  // 获取用户加载状态
  isLoading: (state: UserState) => state.loading,
  
  // 获取错误信息
  error: (state: UserState) => state.error
}

// Mutations
const mutations = {
  // 设置加载状态
  SET_LOADING(state: UserState, loading: boolean) {
    state.loading = loading
  },
  
  // 设置错误信息
  SET_ERROR(state: UserState, error: string | null) {
    state.error = error
  },
  
  // 登录成功
  LOGIN_SUCCESS(state: UserState, { user, token }: { user: User, token: string }) {
    state.user = user
    state.token = token
    state.loading = false
    state.error = null
    
    // 保存到localStorage
    saveUserToStorage(user)
    saveTokenToStorage(token)
  },
  
  // 登出
  LOGOUT(state: UserState) {
    state.user = null
    state.token = null
    state.loading = false
    state.error = null
    
    // 从localStorage和cookie移除
    saveUserToStorage(null)
    saveTokenToStorage(null)
    removeRefreshToken()
  },
  
  // 更新用户信息
  UPDATE_USER(state: UserState, userData: Partial<User>) {
    if (state.user) {
      state.user = { ...state.user, ...userData }
      saveUserToStorage(state.user)
    }
  }
}

// Actions
const actions = {
  // 登录
  async login({ commit }: { commit: any }, { email, password }: { email: string; password: string }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // 使用实际的后端API
      const result = await api.auth.login({ username: email, password })
      
      // 登录成功
      const user: User = {
        id: result.data.user.id,
        username: result.data.user.username,
        email: result.data.user.email,
        role: result.data.user.role || 'user',
        isLoggedIn: true
      }
      
      const token: string = result.data.accessToken
      
      // 保存refresh token
      if (result.data.refreshToken) {
        setRefreshToken(result.data.refreshToken)
      }
      
      commit('LOGIN_SUCCESS', { user, token })
      return user
    } catch (error: any) {
      commit('SET_ERROR', error.response?.data?.msg || '登录失败，请检查邮箱和密码')
      commit('SET_LOADING', false)
      throw error
    }
  },
  
  // 登出
  async logout({ commit }: { commit: any }) {
    try {
      // 使用实际的后端API
      const refreshToken = getRefreshToken()
      if (refreshToken) {
        await api.auth.logout({ refreshToken })
      }
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      commit('LOGOUT')
    }
  },
  
  // 注册
  async register({ commit }: { commit: any }, { name, email, password }: { name: string; email: string; password: string }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    
    try {
      // 使用实际的后端API
      const result = await api.auth.register({ username: name, email, password })
      
      // 注册成功后，需要登录获取token
      const loginResult = await api.auth.login({ username: name, password })
      
      // 登录成功
      const user: User = {
        id: loginResult.data.user.id,
        username: loginResult.data.user.username,
        email: loginResult.data.user.email,
        role: loginResult.data.user.role || 'user',
        isLoggedIn: true
      }
      
      const token: string = loginResult.data.accessToken
      
      // 保存refresh token
      if (loginResult.data.refreshToken) {
        setRefreshToken(loginResult.data.refreshToken)
      }
      
      commit('LOGIN_SUCCESS', { user, token })
      return user
    } catch (error: any) {
      commit('SET_ERROR', error.response?.data?.msg || '注册失败，请稍后重试')
      commit('SET_LOADING', false)
      throw error
    }
  },
  
  // 更新用户信息
  async updateUserInfo({ commit }: { commit: any }, userData: Partial<User>) {
    commit('SET_LOADING', true)
    
    try {
      // 使用实际的后端API
      const result = await api.auth.getMe() // 这里假设使用getMe API获取最新用户信息
      
      if (result.status === 200) {
        const updatedUser: User = {
          id: result.data.id,
          username: result.data.username,
          email: result.data.email,
          role: result.data.role || 'user',
          isLoggedIn: true
        }
        
        commit('UPDATE_USER', updatedUser)
      }
      
      commit('SET_LOADING', false)
    } catch (error: any) {
      commit('SET_ERROR', error.response?.data?.msg || '更新用户信息失败')
      commit('SET_LOADING', false)
      throw error
    }
  }
}

export default {
  namespaced: true, // 启用命名空间
  state,
  getters,
  mutations,
  actions
}
