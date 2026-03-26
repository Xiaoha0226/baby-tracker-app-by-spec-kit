<template>
  <div class="record-list" ref="listContainer">
    <div v-if="loading && records.length === 0" class="loading-state">
      <span class="spinner"></span>
      <span>加载中...</span>
    </div>
    
    <div v-else-if="records.length === 0" class="empty-state">
      <span class="empty-emoji">📝</span>
      <p>暂无记录</p>
      <p class="empty-hint">尝试调整筛选条件或添加新记录</p>
    </div>
    
    <div v-else class="records-container">
      <div
        v-for="record in records"
        :key="record.id"
        class="record-item"
        @click="viewDetail(record)"
      >
        <div
          class="record-icon"
          :style="{ backgroundColor: getRecordTypeColor(record.record_type) }"
        >
          {{ getRecordTypeEmoji(record.record_type) }}
        </div>
        <div class="record-content">
          <div class="record-header">
            <span class="record-type">{{ getRecordTypeLabel(record.record_type) }}</span>
            <span class="record-time">{{ formatDateTime(record.record_time) }}</span>
          </div>
          <div class="record-detail">
            {{ formatRecordDetails(record.record_type, record.details) }}
          </div>
        </div>
        <div class="record-arrow">›</div>
      </div>
      
      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more">
        <button
          v-if="!loadingMore"
          class="load-more-btn"
          @click="loadMore"
        >
          加载更多
        </button>
        <span v-else class="loading-more">
          <span class="spinner-small"></span>
          加载中...
        </span>
      </div>
      
      <div v-else-if="records.length > 0" class="no-more">
        没有更多记录了
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
  type RecordItem,
  getRecordTypeLabel,
  getRecordTypeEmoji,
  getRecordTypeColor,
  formatRecordDetails,
} from '@/services/records';
import dayjs from 'dayjs';

interface Props {
  records: RecordItem[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'loadMore'): void;
  (e: 'viewDetail', record: RecordItem): void;
}>();

const listContainer = ref<HTMLElement | null>(null);

function formatDateTime(timeString: string): string {
  const date = dayjs(timeString);
  const now = dayjs();
  
  if (date.isSame(now, 'day')) {
    return date.format('HH:mm');
  } else if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return `昨天 ${date.format('HH:mm')}`;
  } else if (date.isSame(now, 'year')) {
    return date.format('MM-DD HH:mm');
  } else {
    return date.format('YYYY-MM-DD HH:mm');
  }
}

function viewDetail(record: RecordItem) {
  emit('viewDetail', record);
}

function loadMore() {
  emit('loadMore');
}

// 无限滚动
let scrollHandler: (() => void) | null = null;

onMounted(() => {
  scrollHandler = () => {
    if (!listContainer.value || props.loadingMore || !props.hasMore) return;
    
    const container = listContainer.value;
    const scrollBottom = container.scrollTop + container.clientHeight;
    const threshold = container.scrollHeight - 100;
    
    if (scrollBottom >= threshold) {
      emit('loadMore');
    }
  };
  
  listContainer.value?.addEventListener('scroll', scrollHandler);
});

onUnmounted(() => {
  if (scrollHandler && listContainer.value) {
    listContainer.value.removeEventListener('scroll', scrollHandler);
  }
});
</script>

<style scoped>
.record-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  text-align: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-md);
}

.empty-emoji {
  font-size: 64px;
  margin-bottom: var(--spacing-md);
}

.empty-hint {
  font-size: 13px;
  margin-top: var(--spacing-xs);
}

.records-container {
  background: white;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.record-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  transition: background-color 0.2s;
}

.record-item:last-child {
  border-bottom: none;
}

.record-item:hover {
  background-color: var(--background-color);
}

.record-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
}

.record-content {
  flex: 1;
  min-width: 0;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.record-type {
  font-size: 15px;
  font-weight: 500;
  color: var(--text-primary);
}

.record-time {
  font-size: 12px;
  color: var(--text-secondary);
}

.record-detail {
  font-size: 13px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.record-arrow {
  font-size: 20px;
  color: var(--text-secondary);
  margin-left: var(--spacing-sm);
}

.load-more,
.no-more {
  padding: var(--spacing-lg);
  text-align: center;
}

.load-more-btn {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--background-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.load-more-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  font-size: 14px;
  color: var(--text-secondary);
}

.spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-more {
  font-size: 13px;
  color: var(--text-secondary);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
