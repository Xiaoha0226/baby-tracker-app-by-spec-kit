import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '@/api/client'

interface User {
  id: number
  email: string | null
  phone: string | null
}

interface Tokens {
  access_token: string
  refresh_token: string
  expires_in: number
}

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // Actions
  async function login(account: string, password: string) {
    const response = await apiClient.post('/auth/login', {
      account,
      password,
    })

    const { user: userData, tokens } = response.data.data
    user.value = userData

    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)

    return userData
  }

  async function register(email: string | null, phone: string | null, password: string) {
    const response = await apiClient.post('/auth/register', {
      email,
      phone,
      password,
    })

    const { user: userData, tokens } = response.data.data
    user.value = userData

    localStorage.setItem('access_token', tokens.access_token)
    localStorage.setItem('refresh_token', tokens.refresh_token)

    return userData
  }

  async function logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      user.value = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }

  async function fetchUser() {
    try {
      const token = localStorage.getItem('access_token')
      if (!token) return null

      // Note: This endpoint would need to be implemented in backend
      // For now, we'll just check if token exists
      return user.value
    } catch (error) {
      console.error('Fetch user error:', error)
      return null
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    fetchUser,
  }
})
