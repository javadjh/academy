import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InsertSemesterRequestDto } from '../../dto/request/InsertSemesterRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Semester, SemesterDocument } from 'src/schema/semester.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';

export class InsertSemesterCommand {
  constructor(public readonly dto: InsertSemesterRequestDto) {}
}

@CommandHandler(InsertSemesterCommand)
export class InsertSemesterHandler
  implements ICommandHandler<InsertSemesterCommand>
{
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,
  ) {}
  async execute(command: InsertSemesterCommand): Promise<any> {
    const { dto } = command;

    const semester: Semester = await new this.semesterModel({
      ...dto,
    }).save();

    if (!semester?._id) throw new RecordNotFoundException();

    return Response.inserted();
  }
}
