import { Injectable } from '@nestjs/common';
const moment = require('jalali-moment');

@Injectable()
export class DateConfig {
  static toJalali(date: Date) {
    try {
      return moment(date, 'YYYY/MM/DD')
        .locale('fa')
        .format('YYYY/MM/DD (HH:m)');
    } catch (err) {
      return '';
    }
  }

  static arrayToJalali(array: Array<any>) {
    array.forEach((item) => {
      try {
        item.createdAt = DateConfig.toJalali(item.createdAt);
        item.updatedAt = DateConfig.toJalali(item.updatedAt);
      } catch (error) {
        console.log(error);
      }
    });
  }
}
