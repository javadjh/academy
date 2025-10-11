import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminJwtGuard } from 'src/guards/admin-jwt.guard';
import { DeleteClassGroupCommand } from './handlers/commands/DeleteClassGroup.command';
import { InsertClassGroupRequestDto } from './dto/request/InsertClassGroupRequest.dto';
import { InsertClassGroupCommand } from './handlers/commands/InsertClassGroup.command';
import { UpdateClassGroupRequestDto } from './dto/request/UpdateClassGroupRequest.dto';
import { GetClassGroupsQuery } from './handlers/queries/GetClassGroups.query';
import { UpdateClassGroupCommand } from './handlers/commands/UpdateClassGroup.command';

@Controller('class-group')
@ApiTags('class-group')
export class ClassGroupController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Delete('delete/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  deleteAdmin(@Param('id') classGroupId: string) {
    return this.commandBus.execute(new DeleteClassGroupCommand(classGroupId));
  }

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  insertAdmin(@Body() dto: InsertClassGroupRequestDto) {
    return this.commandBus.execute(new InsertClassGroupCommand(dto));
  }

  @Put('update/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  updateClassGroup(
    @Body() dto: UpdateClassGroupRequestDto,
    @Param('id') classGroupId: string,
  ) {
    return this.commandBus.execute(
      new UpdateClassGroupCommand(dto, classGroupId),
    );
  }

  //queries

  @Get('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  getClassGroups() {
    return this.queryBus.execute(new GetClassGroupsQuery());
  }
}
