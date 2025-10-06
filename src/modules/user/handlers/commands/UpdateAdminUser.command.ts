import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { RecordNotFoundException } from 'src/filters/record-not-found.filter';
import { UpdateAdminUserRequestDto } from '../../dto/request/UpdateAdminUserRequest.dto';

export class UpdateAdminUserCommand {
  constructor(
    public readonly dto: UpdateAdminUserRequestDto,
    public readonly userId: string,
  ) {}
}

@CommandHandler(UpdateAdminUserCommand)
export class UpdateAdminUserHandler
  implements ICommandHandler<UpdateAdminUserCommand>
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: UpdateAdminUserCommand): Promise<any> {
    const { dto, userId } = command;
    const user: User = await this.userModel.findByIdAndUpdate(userId, {
      $set: {
        ...dto,
        ...{
          fullName: `${dto.firstName} ${dto?.lastName}`,
        },
      },
    });

    if (!user?._id) throw new RecordNotFoundException();

    return Response.updated();
  }
}
