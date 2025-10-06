import { MongooseModule } from '@nestjs/mongoose';
import { City, CitySchema } from './city.schema';
import { File, FileSchema } from './file.schema';
import { User, UserSchema } from './user.schema';
import { Class, ClassSchema } from './class.schema';
import { Exam, ExamSchema } from './exam.schema';
import { Attendance, AttendanceSchema } from './Attendance.schema';

export default [
  MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
  MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
  MongooseModule.forFeature([
    { name: Attendance.name, schema: AttendanceSchema },
  ]),
];
