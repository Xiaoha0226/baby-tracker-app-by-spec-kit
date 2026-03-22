import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity';
import { BabyRecord } from './records/entities/baby-record.entity';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.DATABASE_URL || './data/baby-tracker.db',
  entities: [User, BabyRecord],
  synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
