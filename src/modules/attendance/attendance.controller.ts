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
import { InsertAttendanceRequestDto } from './dto/request/InsertAttendanceRequest.dto';
import { InsertAttendanceCommand } from './handlers/commands/InsertAttendance.command';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GetProfile } from 'src/decorator/get-profile.decorator';
import { User } from 'src/schema/user.schema';
import { StudentJwtGuard } from 'src/guards/student-jwt.guard';
import { TeacherJwtGuard } from 'src/guards/teacher-jwt.guard';
import { GetAttendanceQuery } from './handlers/queries/GetAttendance.query';
import { GetAdminAttendanceQuery } from './handlers/queries/GetAdminAttendance.query';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('attendance')
@ApiTags('attendance')
export class AttendanceController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(TeacherJwtGuard)
  insert(@Body() dto: InsertAttendanceRequestDto, @GetProfile() user: User) {
    return this.commandBus.execute(new InsertAttendanceCommand(dto, user));
  }

  //queries

  @Get('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  adminAttendancees(@GetProfile() user: User) {
    return this.queryBus.execute(new GetAttendanceQuery(user));
  }

  @Get('admin')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  studentAttendancees(@Query() paging: PagingDto) {
    return this.queryBus.execute(new GetAdminAttendanceQuery(paging));
  }
}
