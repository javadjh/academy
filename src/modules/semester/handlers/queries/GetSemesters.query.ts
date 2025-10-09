import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Semester, SemesterDocument } from 'src/schema/semester.schema';

export class GetSemestersQuery {}

@QueryHandler(GetSemestersQuery)
export class GetSemestersHandler implements IQueryHandler<GetSemestersQuery> {
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,
  ) {}
  async execute(query: GetSemestersQuery): Promise<any> {
    const semesters: Array<Semester> = await this.semesterModel.find({
      isActive: true,
    });

    return Response.send({ list: semesters });
  }
}
