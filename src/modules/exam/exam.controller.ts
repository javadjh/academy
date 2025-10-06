import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from 'src/guards/admin-jwt.guard';
import { DeleteAdminExamCommand } from './handlers/commands/DeleteAdminExam.command';
import { GetProfile } from 'src/decorator/get-profile.decorator';
import { User } from 'src/schema/user.schema';
import { DeleteExamCommand } from './handlers/commands/DeleteExam.command';
import { TeacherJwtGuard } from 'src/guards/teacher-jwt.guard';
import { InserAdminExamCommand } from './handlers/commands/InserAdminExam.command';
import { InserAdminExamRequestDto } from './dto/request/InserAdminExamRequest.dto';
import { InsertExamRequestDto } from './dto/request/InsertExamRequest.dto';
import { InsertExamCommand } from './handlers/commands/InsertExam.command';
import { SetExamResultesRequestDto } from './dto/request/SetExamResultesRequest.dto';
import { SetExamResultesCommand } from './handlers/commands/SetExamResultes.command';
import { UpdateAdminExamCommand } from './handlers/commands/UpdateAdminExam.command';
import { UpdateExamRequestDto } from './dto/request/UpdateExamRequest.dto';
import { UpdateExamCommand } from './handlers/commands/UpdateExam.command';
import { GetAdminExamsQuery } from './handlers/queries/GetAdminExams.query';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { GetExamsQuery } from './handlers/queries/GetUserExams.query';

@Controller('exam')
@ApiTags('exam')
export class ExamController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Delete('admin/delete/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  deleteAdmin(@Param('id') examId: string) {
    return this.commandBus.execute(new DeleteAdminExamCommand(examId));
  }

  @Delete('delete/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(TeacherJwtGuard)
  delete(@Param('id') examId: string, @GetProfile() user: User) {
    return this.commandBus.execute(new DeleteExamCommand(examId, user));
  }

  @Post('insert/admin')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  insertAdmin(@Body() dto: InserAdminExamRequestDto) {
    return this.commandBus.execute(new InserAdminExamCommand(dto));
  }

  @Post('insert/teacher')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(TeacherJwtGuard)
  insertTeacher(@Body() dto: InsertExamRequestDto, @GetProfile() user: User) {
    return this.commandBus.execute(new InsertExamCommand(dto, user));
  }

  @Put('set/resulte/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(TeacherJwtGuard)
  setResulte(
    @Body() dto: SetExamResultesRequestDto,
    @Param('id') examId: string,
    @GetProfile() user: User,
  ) {
    return this.commandBus.execute(
      new SetExamResultesCommand(dto, examId, user),
    );
  }

  @Put('update/admin/exam/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  updateAdminExam(
    @Body() dto: UpdateExamRequestDto,
    @Param('id') examId: string,
    @GetProfile() user: User,
  ) {
    return this.commandBus.execute(
      new UpdateAdminExamCommand(dto, examId, user),
    );
  }

  @Put('update/exam/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(TeacherJwtGuard)
  updateExam(
    @Body() dto: UpdateExamRequestDto,
    @Param('id') examId: string,
    @GetProfile() user: User,
  ) {
    return this.commandBus.execute(new UpdateExamCommand(dto, examId, user));
  }

  //queries

  @Get('admin/exams/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  getAdminExams(@Query() paging: PagingDto) {
    return this.queryBus.execute(new GetAdminExamsQuery(paging));
  }

  @Get('exams/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  getExams(@Query() paging: PagingDto, @GetProfile() user: User) {
    return this.queryBus.execute(new GetExamsQuery(paging, user));
  }
}
