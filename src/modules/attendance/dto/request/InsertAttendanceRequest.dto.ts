import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString, isString } from 'class-validator';
import { AttendanceList } from 'src/schema/attendance.schema';

export class InsertAttendanceRequestDto {
  @ApiProperty()
  @IsString()
  classId: string;

  // @ApiProperty()
  // @IsString()
  // teacherId: string;

  @ApiProperty()
  @IsArray()
  attendanceList: Array<AttendanceList>;
}
