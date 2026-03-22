import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum RecordType {
  FEEDING = 'feeding',
  DIAPER = 'diaper',
  POOP = 'poop',
  FOOD = 'food',
  SLEEP = 'sleep',
  OTHER = 'other',
}

@Entity('baby_record')
export class BabyRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'record_type', type: 'varchar', length: 20 })
  recordType: RecordType;

  @Column({ name: 'record_time', type: 'datetime' })
  recordTime: Date;

  @Column({ type: 'json' })
  details: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.records, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
