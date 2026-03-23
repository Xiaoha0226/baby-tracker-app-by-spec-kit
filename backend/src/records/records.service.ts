import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BabyRecord, RecordType } from './entities/baby-record.entity';
import { CreateRecordDto } from './dto/create-record.dto';

interface FindAllOptions {
  userId: number;
  page?: number;
  limit?: number;
  type?: RecordType;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(BabyRecord)
    private recordRepository: Repository<BabyRecord>,
  ) {}

  async create(userId: number, dto: CreateRecordDto) {
    const record = this.recordRepository.create({
      userId,
      recordType: dto.record_type,
      recordTime: new Date(dto.record_time),
      details: dto.details,
    });

    await this.recordRepository.save(record);

    return this.findOne(record.id);
  }

  async findAll(options: FindAllOptions) {
    const { userId, page = 1, limit = 20, type, startDate, endDate } = options;

    const queryBuilder = this.recordRepository
      .createQueryBuilder('record')
      .where('record.userId = :userId', { userId })
      .orderBy('record.recordTime', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (type) {
      queryBuilder.andWhere('record.recordType = :type', { type });
    }

    if (startDate) {
      queryBuilder.andWhere('record.recordTime >= :startDate', { startDate });
    }

    if (endDate) {
      queryBuilder.andWhere('record.recordTime <= :endDate', { endDate });
    }

    const [records, total] = await queryBuilder.getManyAndCount();

    return {
      items: records.map((record) => this.sanitizeRecord(record)),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: number) {
    const record = await this.recordRepository.findOne({
      where: { id },
    });

    if (!record) {
      throw new NotFoundException('记录不存在');
    }

    return this.sanitizeRecord(record);
  }

  async update(userId: number, id: number, dto: Partial<CreateRecordDto>) {
    const record = await this.recordRepository.findOne({
      where: { id, userId },
    });

    if (!record) {
      throw new NotFoundException('记录不存在');
    }

    if (dto.record_type) {
      record.recordType = dto.record_type;
    }

    if (dto.record_time) {
      record.recordTime = new Date(dto.record_time);
    }

    if (dto.details) {
      record.details = dto.details;
    }

    await this.recordRepository.save(record);

    return this.findOne(id);
  }

  async remove(userId: number, id: number) {
    const record = await this.recordRepository.findOne({
      where: { id, userId },
    });

    if (!record) {
      throw new NotFoundException('记录不存在');
    }

    await this.recordRepository.remove(record);

    return { message: '记录已删除' };
  }

  private sanitizeRecord(record: BabyRecord) {
    return {
      id: record.id,
      record_type: record.recordType,
      record_time: record.recordTime,
      details: record.details,
      created_at: record.createdAt,
    };
  }
}
