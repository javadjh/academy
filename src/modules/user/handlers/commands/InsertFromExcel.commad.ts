import { ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Response } from 'src/config/response';
import { User, UserDocument } from 'src/schema/user.schema';
import { Password } from 'src/utility/password';
import * as XLSX from 'xlsx';

export class InsertFromExcelCommand {
  constructor(
    public readonly file: Express.Multer.File,
    public readonly semester: string,
    public readonly department: string,
  ) {}
}

export class InsertFromExcelHandler
  implements ICommandHandler<InsertFromExcelCommand>
{
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}
  async transformExcelData(
    excelData: any[],
    department: string,
    semester: string,
  ) {
    let list: Array<any> = [];
    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];
      const password: string = await Password.generate(row.nationalCode);

      list.push({
        firstName: row['نام'],
        lastName: row['نام خانوادگی'],
        phoneNumber: row['شماره تماس'] ? String(row['شماره تماس']) : null,
        gender: row['جنسیت'],
        nationalCode: row['کد ملی'] ? String(row['کد ملی']) : null,
        password,
        department,
        semester,
      });
    }

    return list;
  }
  async execute(command: InsertFromExcelCommand): Promise<any> {
    const { department, file, semester } = command;

    const workbook: XLSX.WorkBook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

    const excelData = XLSX.utils.sheet_to_json(worksheet);

    const users = await this.transformExcelData(
      excelData,
      department,
      semester,
    );

    await this.userModel.insertMany(users);

    return Response.inserted();
  }
}
