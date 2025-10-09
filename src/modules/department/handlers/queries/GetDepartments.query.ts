import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Department, DepartmentDocument } from 'src/schema/department.schema';

export class GetDepartmentsQuery {}

@QueryHandler(GetDepartmentsQuery)
export class GetDepartmentsHandler
  implements IQueryHandler<GetDepartmentsQuery>
{
  constructor(
    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}
  async execute(query: GetDepartmentsQuery): Promise<any> {
    const departments: Array<Department> = await this.departmentModel.find({
      isActive: true,
    });

    return Response.send({ list: departments });
  }
}
