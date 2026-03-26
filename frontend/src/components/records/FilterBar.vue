<template>
  <div class="filter-bar">
    <div class="filter-header">
      <button class="filter-toggle" @click="toggleFilters">
        <span class="filter-icon">🔍</span>
        <span class="filter-text">筛选</span>
        <span v-if="activeFiltersCount > 0" class="filter-badge">{{ activeFiltersCount }}</span>
        <span class="toggle-icon" :class="{ open: showFilters }">▼</span>
      </button>
      <button v-if="activeFiltersCount > 0" class="clear-btn" @click="clearFilters">
        清除
      </button>
    </div>
    
    <Transition name="slide-down">
      <div v-show="showFilters" class="filter-content">
        <TypeFilter v-model="localType" />
        <DateRangeFilter
          v-model:startDate="localStartDate"
          v-model:endDate="localEndDate"
        />
        <div class="filter-actions">
          <button class="apply-btn" @click="applyFilters">应用筛选</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import TypeFilter from './TypeFilter.vue';
import DateRangeFilter from './DateRangeFilter.vue';
import type { RecordType } from '@/services/records';

interface Props {
  type: RecordType | '';
  startDate: string;
  endDate: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:type', value: RecordType | ''): void;
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
  (e: 'apply'): void;
}>();

const showFilters = ref(false);

// 本地状态
const localType = ref<RecordType | ''>(props.type);
const localStartDate = ref(props.startDate);
const localEndDate = ref(props.endDate);

// 同步 props 到本地状态
watch(() => props.type, (val) => { localType.value = val; });
watch(() => props.startDate, (val) => { localStartDate.value = val; });
watch(() => props.endDate, (val) => { localEndDate.value = val; });

const activeFiltersCount = computed(() => {
  let count = 0;
  if (props.type) count++;
  if (props.startDate || props.endDate) count++;
  return count;
});

function toggleFilters() {
  showFilters.value = !showFilters.value;
}

function applyFilters() {
  emit('update:type', localType.value);
  emit('update:startDate', localStartDate.value);
  emit('update:endDate', localEndDate.value);
  emit('apply');
  showFilters.value = false;
}

function clearFilters() {
  localType.value = '';
  const today = new Date().toISOString().split('T')[0];
  localStartDate.value = today;
  localEndDate.value = today;
  
  emit('update:type', '');
  emit('update:startDate', today);
  emit('update:endDate', today);
  emit('apply');
}
</script>

<style scoped>
.filter-bar {
  background: white;
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
}

.filter-toggle {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: none;
  border: none;
  font-size: 15px;
  color: var(--text-primary);
  cursor: pointer;
}

.filter-icon {
  font-size: 18px;
}

.filter-text {
  font-weight: 500;
}

.filter-badge {
  background: var(--primary-color);
  color: white;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: var(--radius-full);
  min-width: 18px;
  text-align: center;
}

.toggle-icon {
  font-size: 10px;
  color: var(--text-secondary);
  transition: transform 0.2s;
  margin-left: 4px;
}

.toggle-icon.open {
  transform: rotate(180deg);
}

.clear-btn {
  font-size: 13px;
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.clear-btn:hover {
  color: var(--primary-color);
}

.filter-content {
  border-top: 1px solid var(--border-color);
}

.filter-actions {
  padding: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.apply-btn {
  width: 100%;
  padding: var(--spacing-md);
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.apply-btn:hover {
  opacity: 0.9;
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
