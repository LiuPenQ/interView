// 登录状态管理工具

// 存储token的key
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_INFO_KEY = 'user_info'

// Cookie操作工具函数
const setCookie = (name: string, value: string, days: number = 7): void => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`
}

const getCookie = (name: string): string | null => {
  const cookieValue = document.cookie
    .split('; ')  
    .find(row => row.startsWith(`${name}=`))
  return cookieValue ? cookieValue.split('=')[1] as string : null
}

const removeCookie = (name: string): void => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
}

// 获取access token
export const getAccessToken = (): string | null => {
  return getCookie(ACCESS_TOKEN_KEY)
}

// 设置access token
export const setAccessToken = (token: string): void => {
  setCookie(ACCESS_TOKEN_KEY, token, 7) // 7天过期
}

// 移除access token
export const removeAccessToken = (): void => {
  removeCookie(ACCESS_TOKEN_KEY)
}

// 获取refresh token
export const getRefreshToken = (): string | null => {
  return getCookie(REFRESH_TOKEN_KEY)
}

// 设置refresh token
export const setRefreshToken = (token: string): void => {
  setCookie(REFRESH_TOKEN_KEY, token, 14) // 14天过期
}

// 移除refresh token
export const removeRefreshToken = (): void => {
  removeCookie(REFRESH_TOKEN_KEY)
}

// 获取用户信息
export const getUserInfo = (): any | null => {
  const userInfo = localStorage.getItem(USER_INFO_KEY)
  return userInfo ? JSON.parse(userInfo) : null
}

// 设置用户信息
export const setUserInfo = (user: any): void => {
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user))
}

// 移除用户信息
export const removeUserInfo = (): void => {
  localStorage.removeItem(USER_INFO_KEY)
}

// 检查是否已登录
export const isAuthenticated = (): boolean => {
  return !!getAccessToken()
}

// 登录
export const login = (tokens: { accessToken: string; refreshToken: string }, user: any): void => {
  setAccessToken(tokens.accessToken)
  setRefreshToken(tokens.refreshToken)
  setUserInfo(user)
}

// 登出
export const logout = (): void => {
  removeAccessToken()
  removeRefreshToken()
  removeUserInfo()
}
