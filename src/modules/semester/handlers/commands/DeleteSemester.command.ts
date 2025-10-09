import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { Semester, SemesterDocument } from 'src/schema/semester.schema';

export class DeleteSemesterCommand {
  constructor(public readonly semesterId: string) {}
}

@CommandHandler(DeleteSemesterCommand)
export class DeleteSemesterHandler
  implements ICommandHandler<DeleteSemesterCommand>
{
  constructor(
    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,
  ) {}
  async execute(command: DeleteSemesterCommand): Promise<any> {
    const semester = await this.semesterModel.findByIdAndUpdate(
      command.semesterId,
      {
        $set: {
          isActive: false,
        },
      },
    );

    if (!semester?._id) throw new RecordNotFoundException();

    return Response.deleted();
  }
}
