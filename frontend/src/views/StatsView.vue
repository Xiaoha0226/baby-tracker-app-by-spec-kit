<template>
  <div class="stats-view">
    <header class="header">
      <button @click="$router.back()" class="back-btn">← 返回</button>
      <h1>数据统计</h1>
      <div class="placeholder"></div>
    </header>

    <main class="main">
      <div class="stats-card">
        <span class="emoji">📊</span>
        <p>数据统计功能即将上线</p>
        <p class="subtitle">敬请期待...</p>
      </div>
    </main>
  </div>
</template>

<style scoped>
.stats-view {
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

.back-btn {
  background: none;
  border: none;
  color: var(--color-text);
  font-size: 16px;
  cursor: pointer;
}

.header h1 {
  font-size: 18px;
  font-weight: 600;
}

.placeholder {
  width: 40px;
}

.main {
  padding: var(--spacing-md);
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 60px);
}

.stats-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.emoji {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-md);
}

.stats-card p {
  color: var(--color-text);
  font-size: 16px;
  margin-bottom: var(--spacing-xs);
}

.subtitle {
  color: var(--color-text-secondary) !important;
  font-size: 14px !important;
}
</style>
