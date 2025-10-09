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
import { DeleteDepartmentCommand } from './handlers/commands/DeleteDepartment.command';
import { InsertDepartmentRequestDto } from './dto/request/InsertDepartmentRequest.dto';
import { InsertDepartmentCommand } from './handlers/commands/InsertDepartment.command';
import { UpdateDepartmentRequestDto } from './dto/request/UpdateDepartmentRequest.dto';
import { UpdateDeparmtnetCommand } from './handlers/commands/UpdateDeparmtnet.command';
import { GetDepartmentsQuery } from './handlers/queries/GetDepartments.query';

@Controller('department')
@ApiTags('department')
export class DepartmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Delete('delete/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  deleteAdmin(@Param('id') departmentId: string) {
    return this.commandBus.execute(new DeleteDepartmentCommand(departmentId));
  }

  @Post('')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  insertAdmin(@Body() dto: InsertDepartmentRequestDto) {
    return this.commandBus.execute(new InsertDepartmentCommand(dto));
  }

  @Put('update/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AdminJwtGuard)
  updateDepartment(
    @Body() dto: UpdateDepartmentRequestDto,
    @Param('id') departmentId: string,
  ) {
    return this.commandBus.execute(
      new UpdateDeparmtnetCommand(dto, departmentId),
    );
  }

  //queries

  @Get('')
  getDepartments() {
    return this.queryBus.execute(new GetDepartmentsQuery());
  }
}
