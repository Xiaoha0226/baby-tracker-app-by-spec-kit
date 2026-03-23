<template>
  <div class="home-view">
    <!-- 页面头部 -->
    <header class="home-header">
      <h1 class="app-title">👶 宝宝成长记录</h1>
      <p class="app-subtitle">用语音记录宝宝的每一个瞬间</p>
    </header>

    <!-- 快捷统计卡片 -->
    <section class="stats-section">
      <div class="stats-grid">
        <div class="stat-card" @click="navigateToRecords('feeding')">
          <span class="stat-emoji">🍼</span>
          <span class="stat-label">今日喂奶</span>
          <span class="stat-value">{{ todayStats.feeding }}次</span>
        </div>
        <div class="stat-card" @click="navigateToRecords('diaper')">
          <span class="stat-emoji">👶</span>
          <span class="stat-label">今日换尿布</span>
          <span class="stat-value">{{ todayStats.diaper }}次</span>
        </div>
        <div class="stat-card" @click="navigateToRecords('sleep')">
          <span class="stat-emoji">😴</span>
          <span class="stat-label">今日睡眠</span>
          <span class="stat-value">{{ formatSleepDuration }}</span>
        </div>
      </div>
    </section>

    <!-- 语音输入区域 -->
    <section class="voice-section">
      <div class="voice-card">
        <h2 class="section-title">🎤 语音记录</h2>
        <p class="section-desc">按住按钮说话，例如："宝宝喝了150毫升奶粉"</p>
        <RecordInput @success="handleRecordSuccess" />
      </div>
    </section>

    <!-- 最近记录 -->
    <section class="recent-section">
      <div class="section-header">
        <h2 class="section-title">📝 最近记录</h2>
        <router-link to="/records" class="view-all-link">
          查看全部 →
        </router-link>
      </div>
      
      <div v-if="loading" class="loading-state">
        <span class="spinner"></span>
        <span>加载中...</span>
      </div>
      
      <div v-else-if="recentRecords.length === 0" class="empty-state">
        <span class="empty-emoji">📝</span>
        <p>还没有记录哦</p>
        <p class="empty-hint">使用上方语音按钮开始记录吧</p>
      </div>
      
      <div v-else class="recent-list">
        <div 
          v-for="record in recentRecords" 
          :key="record.id" 
          class="recent-item"
          @click="viewRecordDetail(record)"
        >
          <div class="item-icon" :style="{ backgroundColor: getRecordTypeColor(record.record_type) }">
            {{ getRecordTypeEmoji(record.record_type) }}
          </div>
          <div class="item-content">
            <div class="item-title">
              {{ getRecordTypeLabel(record.record_type) }}
            </div>
            <div class="item-detail">
              {{ formatRecordDetails(record.record_type, record.details) }}
            </div>
          </div>
          <div class="item-time">
            {{ formatTime(record.record_time) }}
          </div>
        </div>
      </div>
    </section>

    <!-- 底部导航 -->
    <nav class="bottom-nav">
      <router-link to="/" class="nav-item active">
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
      <router-link to="/profile" class="nav-item">
        <span class="nav-icon">👤</span>
        <span class="nav-label">我的</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import RecordInput from '@/components/RecordInput.vue';
import { 
  getRecords, 
  type RecordItem,
  getRecordTypeLabel,
  getRecordTypeEmoji,
  getRecordTypeColor,
  formatRecordDetails,
} from '@/services/records';

const router = useRouter();

const loading = ref(false);
const recentRecords = ref<RecordItem[]>([]);
const todayStats = ref({
  feeding: 0,
  diaper: 0,
  sleepMinutes: 0,
});

const formatSleepDuration = computed(() => {
  const hours = Math.floor(todayStats.value.sleepMinutes / 60);
  const minutes = todayStats.value.sleepMinutes % 60;
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? minutes + '分' : ''}`;
  }
  return `${minutes}分钟`;
});

// 加载最近记录
async function loadRecentRecords() {
  loading.value = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await getRecords({ 
      limit: 5,
      startDate: today,
    });
    recentRecords.value = response.items;
    
    // 计算今日统计
    calculateTodayStats(response.items);
  } catch (error) {
    console.error('加载记录失败:', error);
  } finally {
    loading.value = false;
  }
}

// 计算今日统计
function calculateTodayStats(records: RecordItem[]) {
  const stats = {
    feeding: 0,
    diaper: 0,
    sleepMinutes: 0,
  };
  
  records.forEach(record => {
    switch (record.record_type) {
      case 'feeding':
        stats.feeding++;
        break;
      case 'diaper':
        stats.diaper++;
        break;
      case 'sleep':
        stats.sleepMinutes += record.details.duration_minutes || 0;
        break;
    }
  });
  
  todayStats.value = stats;
}

// 格式化时间
function formatTime(timeString: string): string {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// 导航到记录列表
function navigateToRecords(type?: string) {
  if (type) {
    router.push(`/records?type=${type}`);
  } else {
    router.push('/records');
  }
}

// 查看记录详情
function viewRecordDetail(record: RecordItem) {
  // TODO: 实现记录详情弹窗或页面
  console.log('查看记录:', record);
}

// 记录成功回调
function handleRecordSuccess() {
  loadRecentRecords();
}

onMounted(() => {
  loadRecentRecords();
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  padding-bottom: 80px; /* 为底部导航留空间 */
  background: linear-gradient(180deg, #FFF5F7 0%, #FFFFFF 100%);
}

/* 头部 */
.home-header {
  padding: var(--spacing-xl);
  text-align: center;
}

.app-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.app-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 统计卡片 */
.stats-section {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-emoji {
  font-size: 28px;
  display: block;
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
  display: block;
  margin-bottom: 2px;
}

.stat-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 语音输入区域 */
.voice-section {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.voice-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  text-align: center;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.section-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin: 0 0 var(--spacing-md);
}

/* 最近记录 */
.recent-section {
  padding: 0 var(--spacing-lg);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.view-all-link {
  font-size: 13px;
  color: var(--primary-color);
  text-decoration: none;
}

.loading-state,
.empty-state {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: var(--spacing-sm);
  vertical-align: middle;
}

.empty-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: var(--spacing-sm);
}

.empty-hint {
  font-size: 13px;
  margin-top: var(--spacing-xs);
}

.recent-list {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.recent-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.recent-item:last-child {
  border-bottom: none;
}

.recent-item:hover {
  background-color: var(--background-color);
}

.item-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.item-content {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 2px;
}

.item-detail {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  font-size: 12px;
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-left: var(--spacing-sm);
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

/* 动画 */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
