<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>记录详情</h3>
        <button class="close-btn" @click="close">×</button>
      </div>
      
      <div class="modal-body">
        <div class="record-type-header" :style="{ backgroundColor: typeColor }">
          <span class="type-emoji">{{ typeEmoji }}</span>
          <span class="type-label">{{ typeLabel }}</span>
        </div>
        
        <div class="record-info">
          <div class="info-row">
            <span class="info-label">记录时间</span>
            <span class="info-value">{{ formatDateTime(record.record_time) }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">记录内容</span>
            <span class="info-value">{{ formattedDetails }}</span>
          </div>
          
          <div v-if="rawText" class="info-row">
            <span class="info-label">原始语音</span>
            <span class="info-value raw-text">{{ rawText }}</span>
          </div>
          
          <div class="info-row">
            <span class="info-label">创建时间</span>
            <span class="info-value">{{ formatDateTime(record.created_at) }}</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="close">关闭</button>
        <button class="btn btn-danger" @click="confirmDelete">删除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import dayjs from 'dayjs';
import {
  type RecordItem,
  getRecordTypeLabel,
  getRecordTypeEmoji,
  getRecordTypeColor,
  formatRecordDetails,
} from '@/services/records';

interface Props {
  record: RecordItem;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'delete', recordId: number): void;
}>();

const typeLabel = computed(() => getRecordTypeLabel(props.record.record_type));
const typeEmoji = computed(() => getRecordTypeEmoji(props.record.record_type));
const typeColor = computed(() => getRecordTypeColor(props.record.record_type));
const formattedDetails = computed(() => 
  formatRecordDetails(props.record.record_type, props.record.details)
);

const rawText = computed(() => props.record.details._raw_text);

function formatDateTime(timeString: string): string {
  return dayjs(timeString).format('YYYY-MM-DD HH:mm:ss');
}

function close() {
  emit('close');
}

function confirmDelete() {
  if (confirm('确定要删除这条记录吗？')) {
    emit('delete', props.record.id);
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 400px;
  max-height: 80vh;
  overflow-y: auto;
  animation: modal-in 0.3s ease;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.close-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: var(--background-color);
}

.modal-body {
  padding: var(--spacing-lg);
}

.record-type-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.type-emoji {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.type-label {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

.record-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.info-value {
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
}

.raw-text {
  font-size: 13px;
  color: var(--text-secondary);
  font-style: italic;
  padding: var(--spacing-sm);
  background: var(--background-color);
  border-radius: var(--radius-md);
}

.modal-footer {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg) var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.btn {
  flex: 1;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: var(--background-color);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
}

.btn-secondary:hover {
  background: var(--border-color);
}

.btn-danger {
  background: #ff6b6b;
  border: none;
  color: white;
}

.btn-danger:hover {
  background: #ee5a5a;
}
</style>
