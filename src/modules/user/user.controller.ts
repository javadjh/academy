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
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ActionDto } from 'src/shareDTO/action.dto';
import { AdminJwtGuard } from 'src/guards/admin-jwt.guard';
import { InsertAdminUserRequestDto } from './dto/request/InsertAdminUserRequest.dto';
import { InsertAdminUserCommand } from './handlers/commands/InsertAdminUser.command';
import { UpdateAdminUserRequestDto } from './dto/request/UpdateAdminUserRequest.dto';
import { UpdateAdminUserCommand } from './handlers/commands/UpdateAdminUser.command';
import { DeleteUserCommand } from './handlers/commands/DeleteUser.command';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import { GetAdminUsersQuery } from './handlers/queries/GetAdminUsers.query';
import { LoginQuery } from './handlers/queries/Login.query';
import { LoginRequestDto } from './dto/request/LoginRequest.dto';
import { UserSeedingCommand } from './handlers/commands/UserSeeding.command';
import { GetTeachersQuery } from './handlers/queries/GetTeachers.query';
import { GetStudentsQuery } from './handlers/queries/GetStudents.query';
import { JwtGuard } from 'src/guards/jwt.guard';
import { GetProfile } from 'src/decorator/get-profile.decorator';
import { User } from 'src/schema/user.schema';
import { Department } from 'src/decorator/department.decorator';
import { Semester } from 'src/decorator/semester.decorator';

@Controller('user')
@ApiTags('user')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  //commands
  @Post('seed')
  seedAdmin() {
    return this.commandBus.execute(new UserSeedingCommand());
  }

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route insert user - admin access needed',
    type: ActionDto,
  })
  insert(
    @Body() dto: InsertAdminUserRequestDto,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.commandBus.execute(
      new InsertAdminUserCommand(dto, semester, department),
    );
  }

  @Put('update/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route update user - admin access needed',
    type: ActionDto,
  })
  update(
    @Body() dto: UpdateAdminUserRequestDto,
    @Param('id') userId: string,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.commandBus.execute(
      new UpdateAdminUserCommand(dto, userId, semester, department),
    );
  }

  @Delete(':userId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route delete user - admin access needed',
    type: ActionDto,
  })
  delete(
    @Param('userId') userId: string,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.commandBus.execute(
      new DeleteUserCommand(userId, semester, department),
    );
  }

  //queries
  @Get('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route return users - admin access needed',
    type: ActionDto,
  })
  users(
    @Query() paging: PagingDto,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetAdminUsersQuery(paging, semester, department),
    );
  }

  @Get('teacher')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  teachers() {
    return this.queryBus.execute(new GetTeachersQuery());
  }

  @Get('student')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  students(
    @Query('classId') classId: string,
    @Department() department: string,
    @Semester() semester: string,
  ) {
    return this.queryBus.execute(
      new GetStudentsQuery(classId, department, semester),
    );
  }

  @Post('login')
  @ApiOkResponse({
    description: 'this route login user',
    type: ActionDto,
  })
  login(@Body() dto: LoginRequestDto) {
    return this.queryBus.execute(new LoginQuery(dto));
  }
}
