import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateSemesterRequestDto } from '../../dto/request/UpdateSemesterRequest.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Semester, SemesterDocument } from 'src/schema/semester.schema';
import { Model } from 'mongoose';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Response } from 'src/config/response';

export class UpdateSemesterCommand {
  constructor(
    public readonly dto: UpdateSemesterRequestDto,
    public readonly semesterId: string,
  ) {}
}

@CommandHandler(UpdateSemesterCommand)
export class UpdateSemesterHandler
  implements ICommandHandler<UpdateSemesterCommand>
{
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,
  ) {}
  async execute(command: UpdateSemesterCommand): Promise<any> {
    const { semesterId, dto } = command;

    const semester = await this.semesterModel.findByIdAndUpdate(semesterId, {
      $set: {
        ...dto,
      },
    });

    if (!semester?._id) throw new RecordNotFoundException();

    return Response.updated();
  }
}
