import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from 'src/guards/admin-jwt.guard';
import { InsertClassRequestDto } from './dto/request/InsertClassRequest.dto';
import { InsertClassCommand } from './handlers/commands/InsertClass.command';
import { UpdateClassRequestDto } from './dto/request/UpdateClassRequest.dto';
import { UpdateClassCommand } from './handlers/commands/UpdateClass.command';
import { DeleteClassCommand } from './handlers/commands/DeleteClass.command';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GetClassesQuery } from './handlers/queries/GetClasses.query';
import { GetProfile } from 'src/decorator/get-profile.decorator';
import { User } from 'src/schema/user.schema';
import { GetStudentClassesQuery } from './handlers/queries/GetStudentClasses.query';
import { StudentJwtGuard } from 'src/guards/student-jwt.guard';
import { TeacherJwtGuard } from 'src/guards/teacher-jwt.guard';
import { GetTeacherClassesQuery } from './handlers/queries/GetTeacherClasses.query';

@Controller('class')
@ApiTags('class')
export class ClassController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  insert(@Body() dto: InsertClassRequestDto) {
    return this.commandBus.execute(new InsertClassCommand(dto));
  }

  @Put('update/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  update(@Body() dto: UpdateClassRequestDto, @Param('id') classId: string) {
    return this.commandBus.execute(new UpdateClassCommand(dto, classId));
  }

  @Put('delete/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  delete(@Param('id') classId: string) {
    return this.commandBus.execute(new DeleteClassCommand(classId));
  }

  //queries

  @Get('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  adminClasses(@Query() paging: PagingDto) {
    return this.queryBus.execute(new GetClassesQuery(paging));
  }

  @Get('student')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(StudentJwtGuard)
  studentClasses(@GetProfile() user: User) {
    return this.queryBus.execute(new GetStudentClassesQuery(user));
  }

  @Get('teacher')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(TeacherJwtGuard)
  teacherClasses(@GetProfile() user: User) {
    return this.queryBus.execute(new GetTeacherClassesQuery(user));
  }
}
