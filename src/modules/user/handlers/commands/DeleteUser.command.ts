import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { User, UserDocument } from 'src/schema/user.schema';

export class DeleteUserCommand {
  constructor(
    public readonly userId: string,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: DeleteUserCommand): Promise<any> {
    const { userId, department, semester } = command;

    const user: User | null = await this.userModel.findOneAndUpdate(
      { _id: userId, semester, department },
      {
        $set: {
          isActive: false,
        },
      },
    );

    if (!user?._id) throw new RecordNotFoundException();

    return Response.deleted();
  }
}
