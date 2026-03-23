import { IsEnum, IsDateString, IsObject, IsOptional } from 'class-validator';
import { RecordType } from '../entities/baby-record.entity';

export class CreateRecordDto {
  @IsEnum(RecordType, { message: '记录类型必须是 feeding, diaper, poop, food, sleep 或 other' })
  record_type: RecordType;

  @IsDateString({}, { message: '记录时间格式不正确' })
  record_time: string;

  @IsObject({ message: '详情必须是对象' })
  details: Record<string, any>;
}
