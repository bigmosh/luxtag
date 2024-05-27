import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  ParseFilePipeBuilder,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Student } from './students.entity';
import { Paginate, PaginateQuery, Paginated } from 'nestjs-paginate';

@Controller('student')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  uploadFile(
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'csv',
        })
        .addMaxSizeValidator({
          maxSize: 5000000,
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    files: Array<Express.Multer.File>,
  ) {
    this.studentsService.handleFileUpload(files);
    return {
      message: 'File uploaded successfully',
    };
  }

  @Get('all')
  async findAll(@Paginate() query: PaginateQuery): Promise<Paginated<Student>> {
    const students = await this.studentsService.findAll(query);
    return students;
  }
}
