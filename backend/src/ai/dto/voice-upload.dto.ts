import { ApiProperty } from '@nestjs/swagger';

export class VoiceUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: '音频文件 (支持 webm, mp3, wav 格式)',
  })
  audio: any;
}

export class ParseTextDto {
  @ApiProperty({
    description: '要解析的自然语言文本',
    example: '宝宝喝了150毫升奶粉',
  })
  text: string;
}
