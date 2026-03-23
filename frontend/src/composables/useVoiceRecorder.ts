import { ref, computed } from 'vue';

export enum RecordingState {
  IDLE = 'idle',
  REQUESTING = 'requesting',
  RECORDING = 'recording',
  PROCESSING = 'processing',
}

export interface UseVoiceRecorderOptions {
  maxDuration?: number; // 最大录音时长（秒）
  onError?: (error: string) => void;
}

export function useVoiceRecorder(options: UseVoiceRecorderOptions = {}) {
  const { maxDuration = 60, onError } = options;

  const state = ref<RecordingState>(RecordingState.IDLE);
  const mediaRecorder = ref<MediaRecorder | null>(null);
  const audioChunks = ref<Blob[]>([]);
  const recordingDuration = ref(0);
  const recordingTimer = ref<number | null>(null);

  const isRecording = computed(() => state.value === RecordingState.RECORDING);
  const isProcessing = computed(() => state.value === RecordingState.PROCESSING);
  const canRecord = computed(() => state.value === RecordingState.IDLE);

  // 开始录音
  async function startRecording(): Promise<void> {
    if (state.value !== RecordingState.IDLE) return;

    try {
      state.value = RecordingState.REQUESTING;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // 检测支持的 MIME 类型
      const mimeType = getSupportedMimeType();
      
      mediaRecorder.value = new MediaRecorder(stream, { mimeType });
      audioChunks.value = [];

      mediaRecorder.value.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data);
        }
      };

      mediaRecorder.value.onstop = () => {
        // 停止所有音轨
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.value.onerror = () => {
        handleError('录音出现错误');
      };

      mediaRecorder.value.start(100); // 每100ms收集一次数据
      state.value = RecordingState.RECORDING;
      
      // 开始计时
      recordingDuration.value = 0;
      recordingTimer.value = window.setInterval(() => {
        recordingDuration.value++;
        
        // 达到最大时长自动停止
        if (recordingDuration.value >= maxDuration) {
          stopRecording();
        }
      }, 1000);

    } catch (error) {
      handleError(getErrorMessage(error));
    }
  }

  // 停止录音
  function stopRecording(): Blob | null {
    if (!mediaRecorder.value || state.value !== RecordingState.RECORDING) {
      return null;
    }

    // 清除计时器
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }

    mediaRecorder.value.stop();
    state.value = RecordingState.IDLE;

    // 合并音频数据
    if (audioChunks.value.length > 0) {
      const mimeType = mediaRecorder.value.mimeType;
      const audioBlob = new Blob(audioChunks.value, { type: mimeType });
      return audioBlob;
    }

    return null;
  }

  // 取消录音
  function cancelRecording(): void {
    if (!mediaRecorder.value) return;

    // 清除计时器
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }

    // 停止录音但不返回数据
    mediaRecorder.value.ondataavailable = null;
    mediaRecorder.value.stop();
    
    // 停止所有音轨
    if (mediaRecorder.value.stream) {
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    }

    audioChunks.value = [];
    recordingDuration.value = 0;
    state.value = RecordingState.IDLE;
    mediaRecorder.value = null;
  }

  // 获取支持的 MIME 类型
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

  // 处理错误
  function handleError(message: string): void {
    state.value = RecordingState.IDLE;
    
    // 清除计时器
    if (recordingTimer.value) {
      clearInterval(recordingTimer.value);
      recordingTimer.value = null;
    }

    // 停止所有音轨
    if (mediaRecorder.value?.stream) {
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    }

    mediaRecorder.value = null;
    audioChunks.value = [];
    recordingDuration.value = 0;

    if (onError) {
      onError(message);
    }
  }

  // 获取错误信息
  function getErrorMessage(error: unknown): string {
    if (error instanceof DOMException) {
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
    return '录音初始化失败';
  }

  // 格式化时长显示
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return {
    state,
    isRecording,
    isProcessing,
    canRecord,
    recordingDuration,
    formatDuration: computed(() => formatDuration(recordingDuration.value)),
    startRecording,
    stopRecording,
    cancelRecording,
  };
}
