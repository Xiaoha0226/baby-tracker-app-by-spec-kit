import {
  Controller,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AIService } from './ai.service';
import { RecordsService } from '../records/records.service';

@ApiTags('AI 语音处理')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AIController {
  constructor(
    private readonly aiService: AIService,
    private readonly recordsService: RecordsService,
  ) {}

  @Post('voice')
  @ApiOperation({ summary: '语音输入创建记录' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('audio'))
  async processVoice(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    const userId = req.user.userId;

    if (!file) {
      return {
        success: false,
        message: '请上传音频文件',
      };
    }

    try {
      // 处理语音输入
      const result = await this.aiService.processVoiceInput(file.buffer, file.mimetype);

      // 如果置信度太低，返回识别结果但不创建记录
      if (result.confidence < 0.5) {
        return {
          success: false,
          message: '识别置信度较低，请重新描述或手动输入',
          data: {
            raw_text: result.raw_text,
            parsed: {
              record_type: result.record_type,
              details: result.details,
            },
            confidence: result.confidence,
          },
        };
      }

      // 创建记录
      const record = await this.recordsService.create(userId, {
        record_type: result.record_type,
        record_time: result.record_time,
        details: {
          ...result.details,
          _raw_text: result.raw_text,
          _confidence: result.confidence,
        },
      });

      return {
        success: true,
        message: '记录创建成功',
        data: {
          record,
          raw_text: result.raw_text,
          confidence: result.confidence,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '处理失败',
      };
    }
  }

  @Post('parse')
  @ApiOperation({ summary: '解析自然语言文本' })
  async parseText(@Body('text') text: string): Promise<{ success: boolean; message?: string; data?: any }> {
    if (!text || !text.trim()) {
      return {
        success: false,
        message: '请输入文本内容',
      };
    }

    try {
      const result = await this.aiService.parseNaturalLanguage(text);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || '解析失败',
      };
    }
  }
}
