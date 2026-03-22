<template>
  <div class="home-view">
    <header class="header">
      <h1>宝宝成长记录</h1>
      <button @click="handleLogout" class="logout-btn">退出</button>
    </header>

    <main class="main">
      <div class="welcome-card">
        <span class="emoji">👋</span>
        <h2>欢迎回来！</h2>
        <p>开始记录宝宝的每一个珍贵时刻</p>
      </div>

      <div class="feature-grid">
        <div class="feature-card" @click="$router.push('/stats')">
          <span class="feature-emoji">📊</span>
          <span class="feature-title">数据统计</span>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function handleLogout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: var(--color-bg);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background: white;
  box-shadow: var(--shadow-sm);
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
}

.logout-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
}

.logout-btn:hover {
  color: var(--color-primary-dark);
}

.main {
  padding: var(--spacing-md);
}

.welcome-card {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, white 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  margin-bottom: var(--spacing-lg);
}

.emoji {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.welcome-card h2 {
  font-size: 20px;
  margin-bottom: var(--spacing-xs);
}

.welcome-card p {
  color: var(--color-text-secondary);
  font-size: 14px;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.feature-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.feature-emoji {
  font-size: 32px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.feature-title {
  font-size: 14px;
  color: var(--color-text);
  font-weight: 500;
}
</style>
