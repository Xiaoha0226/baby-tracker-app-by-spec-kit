<template>
  <div class="profile-view">
    <header class="page-header">
      <h1>👤 我的</h1>
      <p>个人中心</p>
    </header>

    <div class="profile-card">
      <div class="avatar">👶</div>
      <div class="user-info">
        <h3>{{ authStore.user?.email || '用户' }}</h3>
        <p>宝宝成长记录</p>
      </div>
    </div>

    <div class="menu-list">
      <div class="menu-item" @click="logout">
        <span class="menu-icon">🚪</span>
        <span class="menu-text">退出登录</span>
        <span class="menu-arrow">›</span>
      </div>
    </div>

    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">首页</span>
      </router-link>
      <router-link to="/records" class="nav-item">
        <span class="nav-icon">📝</span>
        <span class="nav-label">记录</span>
      </router-link>
      <router-link to="/stats" class="nav-item">
        <span class="nav-icon">📊</span>
        <span class="nav-label">统计</span>
      </router-link>
      <router-link to="/profile" class="nav-item active">
        <span class="nav-icon">👤</span>
        <span class="nav-label">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

async function logout() {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  padding-bottom: 80px;
  background: linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%);
}

.page-header {
  padding: var(--spacing-xl);
  text-align: center;
}

.page-header h1 {
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.page-header p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin: 0 var(--spacing-lg) var(--spacing-lg);
  padding: var(--spacing-lg);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
}

.user-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.user-info p {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

.menu-list {
  margin: 0 var(--spacing-lg);
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  cursor: pointer;
  transition: background-color 0.2s;
}

.menu-item:hover {
  background-color: var(--background-color);
}

.menu-icon {
  font-size: 20px;
  margin-right: var(--spacing-md);
}

.menu-text {
  flex: 1;
  font-size: 15px;
  color: var(--text-primary);
}

.menu-arrow {
  font-size: 20px;
  color: var(--text-secondary);
}

/* 底部导航 */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: white;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  text-decoration: none;
  color: var(--text-secondary);
  transition: color 0.2s;
}

.nav-item.active,
.nav-item:hover {
  color: var(--primary-color);
}

.nav-icon {
  font-size: 22px;
}

.nav-label {
  font-size: 11px;
}
</style>
