import { RecordType } from '../entities/baby-record.entity';

export class RecordResponseDto {
  id: number;
  record_type: RecordType;
  record_time: Date;
  details: Record<string, any>;
  created_at: Date;
}
