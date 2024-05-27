import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Student } from 'src/students/students.entity';

export default registerAs(
  'db',
  (): TypeOrmModuleOptions => ({
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [Student],
    synchronize: true,
    logging: 'all',
    type: 'mysql',
  }),
);
