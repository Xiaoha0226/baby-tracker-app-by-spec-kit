import api from './api';

export type RecordType = 'feeding' | 'diaper' | 'poop' | 'food' | 'sleep' | 'other';

export interface RecordItem {
  id: number;
  record_type: RecordType;
  record_time: string;
  details: Record<string, any>;
  created_at: string;
}

export interface CreateRecordData {
  record_type: RecordType;
  record_time: string;
  details: Record<string, any>;
}

export interface RecordsResponse {
  items: RecordItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RecordsQuery {
  page?: number;
  limit?: number;
  type?: RecordType;
  startDate?: string;
  endDate?: string;
}

// 记录类型配置
export const RECORD_TYPE_CONFIG: Record<RecordType, { label: string; emoji: string; color: string }> = {
  feeding: { label: '喂奶', emoji: '🍼', color: '#FFB6C1' },
  diaper: { label: '换尿布', emoji: '👶', color: '#87CEEB' },
  poop: { label: '便便', emoji: '💩', color: '#DDA0DD' },
  food: { label: '辅食', emoji: '🥄', color: '#98D8C8' },
  sleep: { label: '睡眠', emoji: '😴', color: '#B19CD9' },
  other: { label: '其他', emoji: '📝', color: '#D3D3D3' },
};

/**
 * 获取记录列表
 */
export async function getRecords(query: RecordsQuery = {}): Promise<RecordsResponse> {
  const params = new URLSearchParams();
  
  if (query.page) params.append('page', query.page.toString());
  if (query.limit) params.append('limit', query.limit.toString());
  if (query.type) params.append('type', query.type);
  if (query.startDate) params.append('startDate', query.startDate);
  if (query.endDate) params.append('endDate', query.endDate);

  const response = await api.get(`/records?${params.toString()}`);
  return response.data;
}

/**
 * 获取单条记录
 */
export async function getRecord(id: number): Promise<RecordItem> {
  const response = await api.get(`/records/${id}`);
  return response.data;
}

/**
 * 创建记录
 */
export async function createRecord(data: CreateRecordData): Promise<RecordItem> {
  const response = await api.post('/records', data);
  return response.data;
}

/**
 * 更新记录
 */
export async function updateRecord(id: number, data: Partial<CreateRecordData>): Promise<RecordItem> {
  const response = await api.patch(`/records/${id}`, data);
  return response.data;
}

/**
 * 删除记录
 */
export async function deleteRecord(id: number): Promise<{ message: string }> {
  const response = await api.delete(`/records/${id}`);
  return response.data;
}

/**
 * 获取记录类型标签
 */
export function getRecordTypeLabel(type: RecordType): string {
  return RECORD_TYPE_CONFIG[type]?.label || type;
}

/**
 * 获取记录类型表情
 */
export function getRecordTypeEmoji(type: RecordType): string {
  return RECORD_TYPE_CONFIG[type]?.emoji || '📝';
}

/**
 * 获取记录类型颜色
 */
export function getRecordTypeColor(type: RecordType): string {
  return RECORD_TYPE_CONFIG[type]?.color || '#D3D3D3';
}

/**
 * 格式化记录详情为可读文本
 */
export function formatRecordDetails(type: RecordType, details: Record<string, any>): string {
  switch (type) {
    case 'feeding':
      const milkTypeMap: Record<string, string> = {
        breast: '母乳',
        formula: '奶粉',
        mixed: '混合',
      };
      const milkType = milkTypeMap[details.milk_type] || details.milk_type || '';
      const amount = details.amount_ml ? `${details.amount_ml}ml` : '';
      return [milkType, amount].filter(Boolean).join(' · ');

    case 'diaper':
      const diaperTypeMap: Record<string, string> = {
        wet: '嘘嘘',
        dirty: '便便',
        both: '都有',
      };
      return diaperTypeMap[details.type] || details.type || '换尿布';

    case 'poop':
      const colorMap: Record<string, string> = {
        yellow: '黄色',
        green: '绿色',
        brown: '棕色',
        black: '黑色',
        red: '红色',
        white: '白色',
      };
      const color = colorMap[details.color] || details.color || '';
      const texture = details.texture || '';
      const poopAmount = details.amount ? `量${details.amount}` : '';
      return [color, texture, poopAmount].filter(Boolean).join(' · ');

    case 'food':
      if (details.food_items && Array.isArray(details.food_items)) {
        return details.food_items.map((item: { name: string; amount?: string }) => 
          item.amount ? `${item.name} ${item.amount}` : item.name
        ).join('、');
      }
      return details.note || '辅食';

    case 'sleep':
      const duration = details.duration_minutes 
        ? `${Math.floor(details.duration_minutes / 60)}小时${details.duration_minutes % 60}分钟`
        : '';
      return duration || '睡眠记录';

    case 'other':
    default:
      return details.note || '其他记录';
  }
}
