import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './students.entity';
import {
  FilterOperator,
  FilterSuffix,
  PaginateQuery,
  paginate,
  Paginated,
} from 'nestjs-paginate';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentsRepository: Repository<Student>,
  ) {}

  findOne(id: number): Promise<Student | null> {
    return this.studentsRepository.findOneBy({ id });
  }

  findOneByStudentName(name: string): Promise<Student | null> {
    return this.studentsRepository.findOneBy({ student_name: name });
  }

  findOneBySerialNumber(serial_number: string): Promise<Student | null> {
    return this.studentsRepository.findOneBy({ serial_number });
  }

  createStudent(student: Student) {
    const newStudent = this.studentsRepository.create(student);
    return this.studentsRepository.save(newStudent);
  }
  // Get all students paginated data
  findAll(query: PaginateQuery): Promise<Paginated<Student>> {
    return paginate(query, this.studentsRepository, {
      defaultSortBy: [['student_name', 'DESC']],
      searchableColumns: ['student_name', 'program_name', 'serial_number'],
      select: ['id', 'student_name', 'program_name', 'serial_number'],
      filterableColumns: {
        name: [FilterOperator.EQ, FilterSuffix.NOT],
        program_name: [FilterOperator.EQ, FilterSuffix.NOT],
        serial_number: [FilterOperator.EQ, FilterSuffix.NOT],
      },
      sortableColumns: ['student_name', 'program_name', 'serial_number'],
    });
  }
  handleFileUpload(files) {
    files.forEach(async (fileBuffer) => {
      const file_ = fileBuffer['buffer'].toString();

      // convert csv data into array
      const fileString = file_.split('\n');
      fileString.forEach(async (item) => {
        const data = item.split(',');

        // create each student record
        const student = new Student();
        student.student_name = data[0] || 'N/A';
        student.program_name = data[1] || 'N/A';
        student.serial_number = data[2];
        const studentExist = await this.isStudentAlreadyExist(
          student.serial_number,
        );
        if (!studentExist) {
          this.createStudent(student);
          // log each created student
        }
      });
    });
  }

  async isStudentAlreadyExist(serial_number: string): Promise<boolean> {
    const student = await this.findOneBySerialNumber(serial_number);
    return student ? true : false;
  }
}
