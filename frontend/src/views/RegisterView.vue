<template>
  <div class="register-view">
    <div class="register-container">
      <div class="header">
        <router-link to="/login" class="back-link">← 返回登录</router-link>
        <h1>创建账号</h1>
        <p class="subtitle">开始记录宝宝的成长旅程</p>
      </div>

      <RegisterForm @submit="handleRegister" :loading="loading" :error="error" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import RegisterForm from '@/components/auth/RegisterForm.vue'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

async function handleRegister(data: { email: string; phone: string; password: string }) {
  loading.value = true
  error.value = ''

  try {
    await authStore.register(data.email || null, data.phone || null, data.password)
    router.push('/')
  } catch (err: any) {
    error.value = err.response?.data?.error?.message || '注册失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #faf8f5 0%, #f0fff4 100%);
  padding: var(--spacing-md);
}

.register-container {
  width: 100%;
  max-width: 360px;
}

.header {
  text-align: center;
  margin-bottom: var(--spacing-xl);
  position: relative;
}

.back-link {
  position: absolute;
  left: 0;
  top: 0;
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: 14px;
}

.back-link:hover {
  color: var(--color-primary-dark);
}

h1 {
  font-size: 24px;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
  font-weight: 600;
  margin-top: var(--spacing-lg);
}

.subtitle {
  font-size: 14px;
  color: var(--color-text-secondary);
}
</style>
