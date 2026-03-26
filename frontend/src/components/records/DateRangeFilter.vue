<template>
  <div class="date-range-filter">
    <div class="filter-label">时间范围</div>
    <div class="date-options">
      <button
        v-for="option in presetOptions"
        :key="option.value"
        class="date-option"
        :class="{ active: selectedPreset === option.value }"
        @click="selectPreset(option.value)"
      >
        {{ option.label }}
      </button>
    </div>
    <div v-if="selectedPreset === 'custom'" class="custom-date-range">
      <input
        type="date"
        :value="startDate"
        @change="updateStartDate(($event.target as HTMLInputElement).value)"
        class="date-input"
      />
      <span class="date-separator">至</span>
      <input
        type="date"
        :value="endDate"
        @change="updateEndDate(($event.target as HTMLInputElement).value)"
        class="date-input"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import dayjs from 'dayjs';

interface Props {
  startDate: string;
  endDate: string;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:startDate', value: string): void;
  (e: 'update:endDate', value: string): void;
}>();

const presetOptions = [
  { value: 'today', label: '今天' },
  { value: 'yesterday', label: '昨天' },
  { value: 'week', label: '近7天' },
  { value: 'month', label: '近30天' },
  { value: 'custom', label: '自定义' },
];

const selectedPreset = ref('today');

function selectPreset(value: string) {
  selectedPreset.value = value;
  
  const today = dayjs().format('YYYY-MM-DD');
  
  switch (value) {
    case 'today':
      emit('update:startDate', today);
      emit('update:endDate', today);
      break;
    case 'yesterday':
      const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
      emit('update:startDate', yesterday);
      emit('update:endDate', yesterday);
      break;
    case 'week':
      emit('update:startDate', dayjs().subtract(6, 'day').format('YYYY-MM-DD'));
      emit('update:endDate', today);
      break;
    case 'month':
      emit('update:startDate', dayjs().subtract(29, 'day').format('YYYY-MM-DD'));
      emit('update:endDate', today);
      break;
    case 'custom':
      // 保持当前值或设置默认值
      if (!props.startDate || !props.endDate) {
        emit('update:startDate', today);
        emit('update:endDate', today);
      }
      break;
  }
}

function updateStartDate(value: string) {
  emit('update:startDate', value);
  if (props.endDate && value > props.endDate) {
    emit('update:endDate', value);
  }
}

function updateEndDate(value: string) {
  emit('update:endDate', value);
  if (props.startDate && value < props.startDate) {
    emit('update:startDate', value);
  }
}

// 根据当前日期自动选择预设
watch(() => [props.startDate, props.endDate], ([start, end]) => {
  if (!start || !end) return;
  
  const today = dayjs().format('YYYY-MM-DD');
  const yesterday = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
  
  if (start === today && end === today) {
    selectedPreset.value = 'today';
  } else if (start === yesterday && end === yesterday) {
    selectedPreset.value = 'yesterday';
  } else if (end === today) {
    const daysDiff = dayjs(end).diff(dayjs(start), 'day');
    if (daysDiff === 6) {
      selectedPreset.value = 'week';
    } else if (daysDiff === 29) {
      selectedPreset.value = 'month';
    } else {
      selectedPreset.value = 'custom';
    }
  } else {
    selectedPreset.value = 'custom';
  }
}, { immediate: true });
</script>

<style scoped>
.date-range-filter {
  padding: var(--spacing-md);
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.date-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.date-option {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: white;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.date-option:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.date-option.active {
  border-color: var(--primary-color);
  background: var(--primary-color);
  color: white;
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.date-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 14px;
  color: var(--text-primary);
}

.date-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.date-separator {
  font-size: 13px;
  color: var(--text-secondary);
}
</style>
