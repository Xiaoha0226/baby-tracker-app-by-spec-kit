<template>
  <form class="login-form" @submit.prevent="handleSubmit">
    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <div class="form-group">
      <label for="account">账号</label>
      <input
        id="account"
        v-model="form.account"
        type="text"
        class="input"
        placeholder="请输入邮箱或手机号"
        required
      />
    </div>

    <div class="form-group">
      <label for="password">密码</label>
      <input
        id="password"
        v-model="form.password"
        type="password"
        class="input"
        placeholder="请输入密码"
        required
        minlength="8"
      />
    </div>

    <button type="submit" class="btn btn-primary" :disabled="loading">
      <span v-if="loading" class="loading-spinner">⏳</span>
      <span v-else>登录</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Props {
  loading?: boolean
  error?: string
}

interface Emits {
  (e: 'submit', data: { account: string; password: string }): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = reactive({
  account: '',
  password: '',
})

function handleSubmit() {
  emit('submit', {
    account: form.account,
    password: form.password,
  })
}
</script>

<style scoped>
.login-form {
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
