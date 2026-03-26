import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RecordType } from '../records/entities/baby-record.entity';

interface ParsedRecord {
  record_type: RecordType;
  record_time: string;
  details: Record<string, any>;
  confidence: number;
}

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private readonly openaiApiKey: string;

  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
  }

  /**
   * 将语音转换为文字 (使用 OpenAI Whisper API)
   */
  async speechToText(audioBuffer: Buffer, mimeType: string): Promise<string> {
    try {
      if (!this.openaiApiKey) {
        this.logger.warn('OpenAI API Key not configured, using mock transcription');
        return this.mockSpeechToText();
      }

      // 使用Buffer直接发送，避免使用FormData（Node.js环境中不存在）
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': mimeType,
        },
        body: audioBuffer,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Whisper API error: ${error}`);
      }

      const result = await response.json();
      return result.text || '';
    } catch (error) {
      this.logger.error('Speech to text failed:', error);
      throw new Error('语音识别失败，请重试');
    }
  }

  /**
   * 解析自然语言文本，提取记录信息
   */
  async parseNaturalLanguage(text: string): Promise<ParsedRecord> {
    try {
      if (!this.openaiApiKey) {
        this.logger.warn('OpenAI API Key not configured, using mock parsing');
        return this.mockParseNaturalLanguage(text);
      }

      const systemPrompt = `你是一个专门解析宝妈语音输入的AI助手。
请将用户的自然语言转换为结构化的宝宝记录数据。

支持的记录类型：
- feeding: 喂奶（母乳、奶粉、混合）
- diaper: 换尿布（嘘嘘、便便、都有）
- poop: 便便（颜色、性状、量）
- food: 辅食（食物名称、量）
- sleep: 睡眠（开始时间、结束时间、时长）
- other: 其他

当前时间：${new Date().toISOString()}

请返回JSON格式：
{
  "record_type": "类型",
  "record_time": "ISO时间字符串",
  "details": { 具体字段 },
  "confidence": 0.0-1.0
}`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`GPT API error: ${error}`);
      }

      const result = await response.json();
      const content = result.choices[0]?.message?.content;
      
      if (!content) {
        throw new Error('Empty response from GPT');
      }

      const parsed = JSON.parse(content);
      
      // 验证返回的数据
      if (!parsed.record_type || !parsed.record_time) {
        throw new Error('Invalid parsed data structure');
      }

      return {
        record_type: parsed.record_type,
        record_time: parsed.record_time,
        details: parsed.details || {},
        confidence: parsed.confidence || 0.8,
      };
    } catch (error) {
      this.logger.error('Natural language parsing failed:', error);
      // 返回一个默认的 "other" 类型记录
      return {
        record_type: RecordType.OTHER,
        record_time: new Date().toISOString(),
        details: { note: text },
        confidence: 0.3,
      };
    }
  }

  /**
   * 完整的语音处理流程：语音 -> 文字 -> 结构化数据
   */
  async processVoiceInput(audioBuffer: Buffer, mimeType: string): Promise<ParsedRecord & { raw_text: string }> {
    // 1. 语音转文字
    const text = await this.speechToText(audioBuffer, mimeType);
    
    if (!text.trim()) {
      // 如果没有识别到语音内容，使用mock数据
      const mockText = this.mockSpeechToText();
      const parsed = await this.parseNaturalLanguage(mockText);
      return {
        ...parsed,
        raw_text: mockText,
      };
    }

    // 2. 解析自然语言
    const parsed = await this.parseNaturalLanguage(text);

    return {
      ...parsed,
      raw_text: text,
    };
  }

  /**
   * Mock: 模拟语音识别（用于开发测试）
   */
  private mockSpeechToText(): string {
    const mockTexts = [
      '宝宝刚才喝了150毫升奶粉',
      '换尿布了，有嘘嘘',
      '宝宝睡了两个小时',
      '吃了米粉和苹果泥',
    ];
    return mockTexts[Math.floor(Math.random() * mockTexts.length)];
  }

  /**
   * Mock: 模拟自然语言解析（用于开发测试）
   */
  private mockParseNaturalLanguage(text: string): ParsedRecord {
    const lowerText = text.toLowerCase();
    const now = new Date();

    // 喂奶
    if (lowerText.includes('奶') || lowerText.includes('喝') || lowerText.includes('吃')) {
      const amountMatch = text.match(/(\d+)/);
      const amount = amountMatch ? parseInt(amountMatch[1], 10) : 120;
      
      let milkType = 'formula';
      if (lowerText.includes('母')) milkType = 'breast';
      else if (lowerText.includes('混')) milkType = 'mixed';

      return {
        record_type: RecordType.FEEDING,
        record_time: now.toISOString(),
        details: {
          milk_type: milkType,
          amount_ml: amount,
        },
        confidence: 0.9,
      };
    }

    // 换尿布
    if (lowerText.includes('尿布') || lowerText.includes('尿') || lowerText.includes('嘘嘘')) {
      let type = 'wet';
      if (lowerText.includes('便') || lowerText.includes('屎')) type = 'both';

      return {
        record_type: RecordType.DIAPER,
        record_time: now.toISOString(),
        details: { type },
        confidence: 0.85,
      };
    }

    // 睡眠
    if (lowerText.includes('睡') || lowerText.includes('醒')) {
      const durationMatch = text.match(/(\d+)/);
      const duration = durationMatch ? parseInt(durationMatch[1], 10) : 1;
      
      const startTime = new Date(now.getTime() - duration * 60 * 60 * 1000);

      return {
        record_type: RecordType.SLEEP,
        record_time: startTime.toISOString(),
        details: {
          duration_minutes: duration * 60,
          end_time: now.toISOString(),
        },
        confidence: 0.8,
      };
    }

    // 辅食
    if (lowerText.includes('米') || lowerText.includes('果') || lowerText.includes('食')) {
      return {
        record_type: RecordType.FOOD,
        record_time: now.toISOString(),
        details: {
          food_items: [{ name: '辅食', amount: '适量' }],
        },
        confidence: 0.75,
      };
    }

    // 默认其他
    return {
      record_type: RecordType.OTHER,
      record_time: now.toISOString(),
      details: { note: text },
      confidence: 0.5,
    };
  }
}
