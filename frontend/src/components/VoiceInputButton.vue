<template>
  <div class="voice-input-wrapper">
    <!-- 录音按钮 -->
    <button
      class="voice-button"
      :class="{
        'is-recording': isRecording,
        'is-processing': isProcessing,
      }"
      :disabled="!canRecord && !isRecording"
      @touchstart.prevent="handleTouchStart"
      @touchend.prevent="handleTouchEnd"
      @mousedown="handleMouseDown"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseLeave"
    >
      <div class="voice-button__inner">
        <span v-if="isRecording" class="recording-icon">
          <span class="recording-wave"></span>
          <span class="recording-wave"></span>
          <span class="recording-wave"></span>
        </span>
        <span v-else-if="isProcessing" class="processing-icon">
          <span class="spinner"></span>
        </span>
        <span v-else class="microphone-icon">🎤</span>
      </div>
      
      <!-- 录音时长 -->
      <span v-if="isRecording" class="recording-time">
        {{ formatDuration }}
      </span>
    </button>

    <!-- 录音提示文字 -->
    <p class="voice-hint">
      <template v-if="isRecording">松开结束录音</template>
      <template v-else-if="isProcessing">正在识别...</template>
      <template v-else>按住说话</template>
    </p>

    <!-- 录音中遮罩和动画 -->
    <Transition name="fade">
      <div v-if="isRecording" class="recording-overlay">
        <div class="recording-dialog">
          <div class="recording-animation">
            <div class="sound-wave">
              <span v-for="i in 5" :key="i" :style="{ animationDelay: `${i * 0.1}s` }"></span>
            </div>
          </div>
          <p class="recording-text">正在录音...</p>
          <p class="recording-tip">松开手指完成录音</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useVoiceRecorder, RecordingState } from '@/composables/useVoiceRecorder';

interface Props {
  maxDuration?: number;
}

interface Emits {
  (e: 'record', audioBlob: Blob): void;
  (e: 'error', message: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxDuration: 60,
});

const emit = defineEmits<Emits>();

const {
  state,
  isRecording,
  isProcessing,
  canRecord,
  formatDuration,
  startRecording,
  stopRecording,
  cancelRecording,
} = useVoiceRecorder({
  maxDuration: props.maxDuration,
  onError: (message) => emit('error', message),
});

// 触摸/鼠标事件处理
let isPressed = false;

function handleTouchStart() {
  if (!canRecord.value) return;
  isPressed = true;
  startRecording();
}

function handleTouchEnd() {
  if (!isPressed) return;
  isPressed = false;
  
  const audioBlob = stopRecording();
  if (audioBlob) {
    emit('record', audioBlob);
  }
}

function handleMouseDown() {
  if (!canRecord.value) return;
  isPressed = true;
  startRecording();
}

function handleMouseUp() {
  if (!isPressed) return;
  isPressed = false;
  
  const audioBlob = stopRecording();
  if (audioBlob) {
    emit('record', audioBlob);
  }
}

function handleMouseLeave() {
  if (isPressed) {
    isPressed = false;
    cancelRecording();
  }
}
</script>

<style scoped>
.voice-input-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.voice-button {
  position: relative;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  box-shadow: 0 4px 15px rgba(255, 182, 193, 0.4);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.voice-button:active:not(:disabled) {
  transform: scale(0.95);
}

.voice-button.is-recording {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  animation: pulse 1s infinite;
}

.voice-button.is-processing {
  background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
  cursor: not-allowed;
}

.voice-button:disabled:not(.is-recording):not(.is-processing) {
  opacity: 0.6;
  cursor: not-allowed;
}

.voice-button__inner {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.microphone-icon {
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.recording-icon {
  display: flex;
  align-items: center;
  gap: 3px;
}

.recording-wave {
  width: 4px;
  height: 20px;
  background: white;
  border-radius: 2px;
  animation: wave 0.5s ease-in-out infinite;
}

.recording-wave:nth-child(2) {
  animation-delay: 0.1s;
}

.recording-wave:nth-child(3) {
  animation-delay: 0.2s;
}

.recording-time {
  position: absolute;
  bottom: -20px;
  font-size: 12px;
  color: var(--text-secondary);
  font-family: monospace;
}

.processing-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.voice-hint {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 录音中遮罩 */
.recording-overlay {
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
}

.recording-dialog {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  min-width: 200px;
}

.recording-animation {
  margin-bottom: var(--spacing-md);
}

.sound-wave {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 40px;
}

.sound-wave span {
  width: 6px;
  background: linear-gradient(180deg, var(--primary-color) 0%, var(--secondary-color) 100%);
  border-radius: 3px;
  animation: sound-wave 0.5s ease-in-out infinite;
}

.recording-text {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs);
}

.recording-tip {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

/* 动画 */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
  }
  50% {
    box-shadow: 0 4px 30px rgba(255, 107, 107, 0.6);
  }
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(1);
  }
  50% {
    transform: scaleY(0.5);
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes sound-wave {
  0%, 100% {
    height: 10px;
  }
  50% {
    height: 30px;
  }
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
