import { IsEnum, IsOptional, IsDateString, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { RecordType } from '../entities/baby-record.entity';

export class RecordFilterDto {
  @IsOptional()
  @IsEnum(RecordType, { message: '记录类型无效' })
  type?: RecordType;

  @IsOptional()
  @IsDateString({}, { message: '开始日期格式不正确' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: '结束日期格式不正确' })
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码最小为1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量最小为1' })
  @Max(100, { message: '每页数量最大为100' })
  limit?: number = 20;

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: '排序方式必须是 asc 或 desc' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}
