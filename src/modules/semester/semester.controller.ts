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
import { DeleteSemesterCommand } from './handlers/commands/DeleteSemester.command';
import { InsertSemesterRequestDto } from './dto/request/InsertSemesterRequest.dto';
import { InsertSemesterCommand } from './handlers/commands/InsertSemester.command';
import { UpdateSemesterRequestDto } from './dto/request/UpdateSemesterRequest.dto';
import { UpdateSemesterCommand } from './handlers/commands/UpdateSemester.command';
import { GetSemestersQuery } from './handlers/queries/GetSemesters.query';

@Controller('semester')
@ApiTags('semester')
export class SemesterController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Delete('delete/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  deleteAdmin(@Param('id') semesterId: string) {
    return this.commandBus.execute(new DeleteSemesterCommand(semesterId));
  }

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  insertAdmin(@Body() dto: InsertSemesterRequestDto) {
    return this.commandBus.execute(new InsertSemesterCommand(dto));
  }

  @Put('update/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  updateSemester(
    @Body() dto: UpdateSemesterRequestDto,
    @Param('id') semesterId: string,
  ) {
    return this.commandBus.execute(new UpdateSemesterCommand(dto, semesterId));
  }

  //queries

  @Get('')
  getSemesters() {
    return this.queryBus.execute(new GetSemestersQuery());
  }
}
