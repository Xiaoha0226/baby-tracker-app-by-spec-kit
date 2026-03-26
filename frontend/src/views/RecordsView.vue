<template>
  <div class="stats-view">
    <header class="page-header">
      <h1>📊 数据统计</h1>
      <p>查看宝宝的成长数据</p>
    </header>
    
    <div class="placeholder">
      <span class="emoji">📈</span>
      <p>统计功能开发中...</p>
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
      <router-link to="/stats" class="nav-item active">
        <span class="nav-icon">📊</span>
        <span class="nav-label">统计</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-label">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<style scoped>
.stats-view {
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

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
}

.emoji {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
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
