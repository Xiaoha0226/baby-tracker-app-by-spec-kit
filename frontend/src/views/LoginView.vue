<template>
  <div class="login-view">
    <div class="login-container">
      <div class="logo">
        <span class="logo-emoji">👶</span>
        <h1>宝宝成长记录</h1>
        <p class="subtitle">记录宝宝每一个珍贵时刻</p>
      </div>

      <LoginForm @submit="handleLogin" :loading="loading" :error="error" />

      <div class="register-link">
        <span>还没有账号？</span>
        <router-link to="/register" class="link">立即注册</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LoginForm from '@/components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

async function handleLogin(credentials: { account: string; password: string }) {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(credentials.account, credentials.password)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #faf8f5 0%, #fff5f5 100%);
  padding: var(--spacing-md);
}

.login-container {
  width: 100%;
  max-width: 360px;
  text-align: center;
}

.logo {
  margin-bottom: var(--spacing-xl);
}

.logo-emoji {
  font-size: 64px;
  display: block;
  margin-bottom: var(--spacing-sm);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

h1 {
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
}

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.register-link {
  margin-top: var(--spacing-lg);
  font-size: 14px;
  color: var(--color-text-secondary);
}

.link {
  color: var(--color-primary-dark);
  text-decoration: none;
  font-weight: 500;
  margin-left: var(--spacing-xs);
}

.link:hover {
  text-decoration: underline;
}
</style>
