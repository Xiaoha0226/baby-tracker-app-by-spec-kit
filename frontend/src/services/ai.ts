import api from './api';
import type { RecordType } from './records';

export interface ParsedRecord {
  record_type: RecordType;
  record_time: string;
  details: Record<string, any>;
  confidence: number;
}

export interface VoiceProcessResult {
  success: boolean;
  message: string;
  data?: {
    record: {
      id: number;
      record_type: RecordType;
      record_time: string;
      details: Record<string, any>;
      created_at: string;
    };
    raw_text: string;
    confidence: number;
  };
}

export interface ParseTextResult {
  success: boolean;
  message?: string;
  data?: ParsedRecord;
}

/**
 * 上传语音文件创建记录
 */
export async function processVoice(audioBlob: Blob): Promise<VoiceProcessResult> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'recording.webm');

  const response = await api.post('/ai/voice', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

/**
 * 解析自然语言文本
 */
export async function parseText(text: string): Promise<ParseTextResult> {
  const response = await api.post('/ai/parse', { text });
  return response.data;
}
