<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="email">邮箱（选填）</label>
      <input
        id="email"
        v-model="form.email"
        type="email"
        class="input"
        placeholder="请输入邮箱"
      />
    </div>

    <div class="form-group">
      <label for="phone">手机号（选填）</label>
      <input
        id="phone"
        v-model="form.phone"
        type="tel"
        class="input"
        placeholder="请输入手机号"
      />
    </div>

    <div class="form-group">
      <label for="password">密码</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        class="input"
        placeholder="请输入密码（至少8位）"
        required
        minlength="8"
      />
    </div>

    <div class="form-group">
      <label for="confirmPassword">确认密码</label>
      <input
        id="confirmPassword"
        v-model="form.confirmPassword"
        type="password"
        class="input"
        placeholder="请再次输入密码"
        required
      />
    </div>

    <button type="submit" class="btn btn-primary" :disabled="loading || !isValid">
      <span v-if="loading" class="loading-spinner">⏳</span>
      <span v-else>注册</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue'

interface Props {
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'submit', data: { email: string; phone: string; password: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
})

const isValid = computed(() => {
  const hasAccount = form.email || form.phone
  const passwordMatch = form.password === form.confirmPassword
  const passwordLength = form.password.length >= 8
  return hasAccount && passwordMatch && passwordLength
})

function handleSubmit() {
  if (!isValid.value) return

  emit('submit', {
    email: form.email,
    phone: form.phone,
    password: form.password,
  })
}
</script>

<style scoped>
.register-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.error-message {
  background: #ffebee;
  color: #c62828;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 14px;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

label {
  font-size: 14px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.btn {
  margin-top: var(--spacing-sm);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
