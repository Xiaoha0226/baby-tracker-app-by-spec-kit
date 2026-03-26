import { ref, computed } from 'vue';

export enum RecordingState {
  IDLE = 'idle',
  RECORDING = 'recording',
}

export interface UseVoiceRecorderOptions {
  maxDuration?: number;
  onError?: (error: string) => void;
  onRecordComplete?: (audioBlob: Blob) => void;
}

export function useVoiceRecorder(options: UseVoiceRecorderOptions = {}) {
  const { maxDuration = 60, onError, onRecordComplete } = options;

  const state = ref<RecordingState>(RecordingState.IDLE);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const recordingDuration = ref(0);
  const recordingTimer = ref<number | null>(null);
  const stream = ref<MediaStream | null>(null);

  const isRecording = computed(() => state.value === RecordingState.RECORDING);
  const canRecord = computed(() => state.value === RecordingState.IDLE);

  async function startRecording(): Promise<void> {
    console.log('[useVoiceRecorder] startRecording called, state:', state.value);
    
    if (state.value !== RecordingState.IDLE) {
      console.log('[useVoiceRecorder] not in IDLE state, returning');
      return;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('[useVoiceRecorder] got media stream');
      stream.value = mediaStream;

      const mimeType = getSupportedMimeType();
      const recorder = new MediaRecorder(mediaStream, { mimeType });
      mediaRecorder.value = recorder;
      audioChunks.value = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
        }
      };

      recorder.onstop = () => {
        console.log('[useVoiceRecorder] recorder onstop triggered');
        if (stream.value) {
          stream.value.getTracks().forEach(track => track.stop());
          stream.value = null;
        }

        if (onRecordComplete) {
          if (audioChunks.value.length > 0) {
            const type = recorder.mimeType || 'audio/webm';
            const blob = new Blob(audioChunks.value, { type });
            console.log('[useVoiceRecorder] calling onRecordComplete with blob size:', blob.size);
            onRecordComplete(blob);
          } else {
            // 即使没有数据，也调用回调以避免UI卡住
            console.log('[useVoiceRecorder] no audio chunks, creating empty blob');
            const blob = new Blob([], { type: 'audio/webm' });
            onRecordComplete(blob);
          }
        }

        audioChunks.value = [];
        recordingDuration.value = 0;
        state.value = RecordingState.IDLE;
        mediaRecorder.value = null;
      };

      recorder.onerror = (error) => {
        console.error('[useVoiceRecorder] recorder error:', error);
        cleanup();
        if (onError) {
          onError('录音出现错误');
        }
      };

      recorder.start(100);
      console.log('[useVoiceRecorder] recorder started, state:', recorder.state);
      state.value = RecordingState.RECORDING;

      recordingDuration.value = 0;
      recordingTimer.value = window.setInterval(() => {
        recordingDuration.value++;
        if (recordingDuration.value >= maxDuration) {
          stopRecording();
        }
      }, 1000);
    } catch (error) {
      console.error('[useVoiceRecorder] startRecording error:', error);
      cleanup();
      const message = error instanceof DOMException ? getErrorMessage(error) : '录音初始化失败';
      if (onError) {
        onError(message);
      }
    }
  }

  function stopRecording(): void {
    console.log('[useVoiceRecorder] stopRecording called, state:', state.value, 'hasRecorder:', !!mediaRecorder.value);
    
    if (!mediaRecorder.value || state.value !== RecordingState.RECORDING) {
      console.log('[useVoiceRecorder] stopRecording: not recording, returning');
      return;
    }

    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }

    console.log('[useVoiceRecorder] stopping recorder, state:', mediaRecorder.value.state);
    mediaRecorder.value.stop();
  }

  function cancelRecording(): void {
    cleanup();
  }

  function cleanup(): void {
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }

    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop());
      stream.value = null;
    }

    if (mediaRecorder.value) {
      mediaRecorder.value.ondataavailable = null;
      mediaRecorder.value.onstop = null;
      mediaRecorder.value.onerror = null;
      if (mediaRecorder.value.state !== 'inactive') {
        mediaRecorder.value.stop();
      }
      mediaRecorder.value = null;
    }

    audioChunks.value = [];
    recordingDuration.value = 0;
    state.value = RecordingState.IDLE;
  }

  function getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/ogg;codecs=opus',
      'audio/ogg',
      'audio/wav',
      'audio/mpeg',
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm';
  }

  function getErrorMessage(error: DOMException): string {
    switch (error.name) {
      case 'NotAllowedError':
      case 'PermissionDeniedError':
        return '麦克风权限被拒绝，请在浏览器设置中允许访问麦克风';
      case 'NotFoundError':
        return '未找到麦克风设备';
      case 'NotReadableError':
        return '麦克风被其他应用占用';
      default:
        return `录音错误: ${error.message}`;
    }
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return {
    state,
    isRecording,
    canRecord,
    recordingDuration,
    formatDuration: computed(() => formatDuration(recordingDuration.value)),
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
