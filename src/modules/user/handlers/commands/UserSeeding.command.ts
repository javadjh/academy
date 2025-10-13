import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { Department, DepartmentDocument } from 'src/schema/department.schema';
import { Semester, SemesterDocument } from 'src/schema/semester.schema';
import { User, UserDocument } from 'src/schema/user.schema';
import { genderEnum, userTypeEnum } from 'src/shareDTO/enums';
import { Password } from 'src/utility/password';

export class UserSeedingCommand {}

@CommandHandler(UserSeedingCommand)
export class UserSeedingHandler implements ICommandHandler<UserSeedingCommand> {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,

    @InjectModel(Semester.name)
    private readonly semesterModel: Model<SemesterDocument>,

    @InjectModel(Department.name)
    private readonly departmentModel: Model<DepartmentDocument>,
  ) {}
  async execute(command: UserSeedingCommand): Promise<any> {
    const user = await this.userModel.findOne({
      userType: userTypeEnum.super_admin,
    });

    const semester = await this.semesterModel.findOne();

    const department = await this.semesterModel.findOne();

    // if (user?._id) {
    let password: string = await Password.generate('Admin5151@');
    await new this.userModel({
      phoneNumber: '090909090909',
      password,
      firstName: 'javad',
      lastName: 'hojati',
      gender: genderEnum.men,
      userType: userTypeEnum.super_admin,
    }).save();
    // }

    if (!semester?._id) {
      await new this.semesterModel({
        title: 'ترم یک',
      }).save();
    }
    if (!department?._id) {
      await new this.departmentModel({
        title: 'ترم یک',
      }).save();
    }

    return Response.inserted();
  }
}
