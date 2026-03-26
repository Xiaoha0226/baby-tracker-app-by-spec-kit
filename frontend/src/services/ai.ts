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
  data: {
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

// ParseText 返回的是 ParsedRecord 直接
export type ParseTextResult = ParsedRecord;

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

  console.log('[ai.ts] Full response:', response);
  console.log('[ai.ts] response.data:', response.data);
  console.log('[ai.ts] response.data.success:', response.data.success);
  console.log('[ai.ts] response.data.data:', response.data.data);

  // 处理嵌套的响应格式
  let result = response.data;
  // 如果response.data.data存在，说明是嵌套格式
  if (result.data && typeof result.data === 'object') {
    result = result.data;
  }

  if (!result.success) {
    throw new Error(result.message || '语音处理失败');
  }
  return result;
}

/**
 * 解析自然语言文本
 */
export async function parseText(text: string): Promise<ParseTextResult> {
  const response = await api.post('/ai/parse', { text });
  // 后端返回格式: { success: true, data: {...} }
  if (!response.data.success) {
    throw new Error(response.data.message || '文本解析失败');
  }
  return response.data.data;
}
