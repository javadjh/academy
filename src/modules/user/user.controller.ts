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
  insert(@Body() dto: InsertAdminUserRequestDto) {
    return this.commandBus.execute(new InsertAdminUserCommand(dto));
  }

  @Put('update/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route update user - admin access needed',
    type: ActionDto,
  })
  update(@Body() dto: UpdateAdminUserRequestDto, @Param('id') userId: string) {
    return this.commandBus.execute(new UpdateAdminUserCommand(dto, userId));
  }

  @Delete(':userId')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route delete user - admin access needed',
    type: ActionDto,
  })
  delete(@Param('id') userId: string) {
    return this.commandBus.execute(new DeleteUserCommand(userId));
  }

  //queries
  @Get('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  @ApiOkResponse({
    description: 'this route return users - admin access needed',
    type: ActionDto,
  })
  users(@Query() paging: PagingDto) {
    return this.queryBus.execute(new GetAdminUsersQuery(paging));
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
