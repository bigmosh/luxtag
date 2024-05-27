import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('students')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  student_name: string;

  @Column()
  program_name: string;

  @Column()
  serial_number: string;
}
