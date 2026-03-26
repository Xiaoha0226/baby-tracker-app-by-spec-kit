<template>
  <div class="voice-input-wrapper">
    <button
      class="voice-button"
      :class="{ 'is-recording': isRecording }"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchcancel="onTouchCancel"
      @mousedown="onMouseDown"
      @mouseup="onMouseUp"
      @mouseleave="onMouseLeave"
    >
      <div class="voice-button__inner">
        <span v-if="isRecording" class="recording-icon">
          <span class="recording-wave"></span>
          <span class="recording-wave"></span>
          <span class="recording-wave"></span>
        </span>
        <span v-else class="microphone-icon">🎤</span>
      </div>
      <span v-if="isRecording" class="recording-time">{{ formatDuration }}</span>
    </button>

    <p class="voice-hint">
      <template v-if="isRecording">松开结束录音</template>
      <template v-else>按住说话</template>
    </p>

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
import { useVoiceRecorder } from '@/composables/useVoiceRecorder';

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
  isRecording,
  canRecord,
  formatDuration,
  startRecording,
  stopRecording,
} = useVoiceRecorder({
  maxDuration: props.maxDuration,
  onError: (message) => emit('error', message),
  onRecordComplete: (audioBlob) => emit('record', audioBlob),
});

function onTouchStart(event: TouchEvent) {
  if (!canRecord.value) return;
  startRecording();
}

function onTouchEnd(event: TouchEvent) {
  if (isRecording.value) {
    stopRecording();
  }
}

function onTouchCancel(event: TouchEvent) {
  if (isRecording.value) {
    stopRecording();
  }
}

function onMouseDown(event: MouseEvent) {
  if (!canRecord.value) return;
  startRecording();
}

function onMouseUp(event: MouseEvent) {
  if (isRecording.value) {
    stopRecording();
  }
}

function onMouseLeave(event: MouseEvent) {
  if (isRecording.value) {
    stopRecording();
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

.voice-button:active {
  transform: scale(0.95);
}

.voice-button.is-recording {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a5a 100%);
  animation: pulse 1s infinite;
}

.voice-button__inner {
  font-size: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
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

.voice-hint {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}

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

@keyframes sound-wave {
  0%, 100% {
    height: 10px;
  }
  50% {
    height: 30px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
