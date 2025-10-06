import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { User, UserDocument } from 'src/schema/user.schema';
import { genderEnum, userTypeEnum } from 'src/shareDTO/enums';
import { Password } from 'src/utility/password';

export class UserSeedingCommand {}

@CommandHandler(UserSeedingCommand)
export class UserSeedingHandler implements ICommandHandler<UserSeedingCommand> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async execute(command: UserSeedingCommand): Promise<any> {
    const user = await this.userModel.findOne({
      userType: userTypeEnum.admin,
    });

    if (!user?._id) {
      let password: string = await Password.generate('Admin5151@');
      await new this.userModel({
        phoneNumber: '09165000126',
        password,
        firstName: 'javad',
        lastName: 'hojati',
        gender: genderEnum.men,
      }).save();
    }

    return Response.inserted();
  }
}
