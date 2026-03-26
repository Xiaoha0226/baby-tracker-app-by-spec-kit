<template>
  <div class="type-filter">
    <div class="filter-label">类型筛选</div>
    <div class="type-options">
      <button
        v-for="type in recordTypes"
        :key="type.value"
        class="type-option"
        :class="{ active: modelValue === type.value }"
        :style="{ '--type-color': type.color }"
        @click="selectType(type.value)"
      >
        <span class="type-emoji">{{ type.emoji }}</span>
        <span class="type-label">{{ type.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { RecordType } from '@/services/records';

interface TypeOption {
  value: RecordType | '';
  label: string;
  emoji: string;
  color: string;
}

interface Props {
  modelValue: RecordType | '';
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: RecordType | ''): void;
}>();

const recordTypes: TypeOption[] = [
  { value: '', label: '全部', emoji: '📋', color: '#999' },
  { value: 'feeding', label: '喂奶', emoji: '🍼', color: '#FFB6C1' },
  { value: 'diaper', label: '换尿布', emoji: '👶', color: '#87CEEB' },
  { value: 'poop', label: '便便', emoji: '💩', color: '#DDA0DD' },
  { value: 'food', label: '辅食', emoji: '🥄', color: '#98D8C8' },
  { value: 'sleep', label: '睡眠', emoji: '😴', color: '#B19CD9' },
  { value: 'other', label: '其他', emoji: '📝', color: '#D3D3D3' },
];

function selectType(value: RecordType | '') {
  emit('update:modelValue', value);
}
</script>

<style scoped>
.type-filter {
  padding: var(--spacing-md);
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.type-options {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.type-option {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-full);
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.type-option:hover {
  border-color: var(--type-color);
  background: rgba(var(--type-color-rgb), 0.05);
}

.type-option.active {
  border-color: var(--type-color);
  background: var(--type-color);
  color: white;
}

.type-emoji {
  font-size: 16px;
}

.type-label {
  font-size: 13px;
  font-weight: 500;
}
</style>
