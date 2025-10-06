import { BadRequestException, Injectable, Scope } from '@nestjs/common';
import { NATIONAL_CODE_IS_NOT_CURRECT_ERROR_MESSAGE } from 'src/config/messages';
import { PagingDto } from 'src/shareDTO/Paging.dto';
import * as moment from 'moment';
import * as jalaliMoment from 'jalali-moment';

class PagingConfig extends PagingDto {
  skip: number;
  regex: any;
}

export class GlobalUtility {
  static applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        derivedCtor.prototype[name] = baseCtor.prototype[name];
      });
    });
  }
  static getPercentage(number: number, total: number) {
    return (100 * number) / total || 0;
  }

  static pagingWrapper(props: any): PagingConfig {
    return {
      ...props,
      skip: ((props?.pageId || 1) - 1) * (props?.eachPerPage || 12),
      regex: { $regex: props?.searchValue || '', $options: 'i' },
      pageId: Number(props.pageId || '1'),
      eachPerPage: Number(props.eachPerPage || '12'),
    };
  }

  static randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
  static melliCodeValidator = (value: string) => {
    // if (value?.length !== 10) {
    //   return false;
    // } else {
    //   let L = value.length;

    //   if (L < 8 || parseInt(value, 10) == 0) return false;
    //   value = ('0000' + value).substr(L + 4 - 10);
    //   if (parseInt(value.substr(3, 6), 10) == 0) return false;
    //   let c = parseInt(value.substr(9, 1), 10);
    //   let s = 0;
    //   for (let i = 0; i < 9; i++)
    //     s += parseInt(value.substr(i, 1), 10) * (10 - i);
    //   s = s % 11;
    //   let isValid = (s < 2 && c === s) || (s >= 2 && c === 11 - s);
    //   if (isValid) {
    //     return true;
    //   }
    //   return false;
    // }

    return true;
  };
  static baseUserFilterQuery = (regex: any): Array<any> => {
    return [
      { email: regex },
      { firstName: regex },
      { lastName: regex },
      { melliCode: regex },
      { 'city.name': regex },
      { 'city.province.name': regex },
      { address: regex },
      { phone: regex },
      { tel: regex },
      { postalCode: regex },
      { shabaCode: regex },
    ];
  };
  static isValidNationalCode = (code: string) => {
    // if (code.length !== 10 || /(\d)(\1){9}/.test(code))
    //   throw new BadRequestException(NATIONAL_CODE_IS_NOT_CURRECT_ERROR_MESSAGE);

    // let sum = 0,
    //   chars = code.split(''),
    //   lastDigit,
    //   remainder;

    // for (let i = 0; i < 9; i++) sum += +chars[i] * (10 - i);

    // remainder = sum % 11;
    // lastDigit = remainder < 2 ? remainder : 11 - remainder;

    // if (+chars[9] !== lastDigit)
    //   throw new BadRequestException(NATIONAL_CODE_IS_NOT_CURRECT_ERROR_MESSAGE);
    return true;
  };

  static getDays = (
    date: any,
    daysCount: number,
    daysAccepte?: Array<string> | any,
    exeptDates?: Array<Date>,
  ): Array<any> => {
    let arrayOfDays: any = [];
    for (let i = 0; i < daysCount; i++) {
      var new_date = date.setDate(date.getDate() + 1);

      var dayOfWeek = moment(new_date).format('dddd');

      const isExcluded = exeptDates?.some(
        (excludedDate) => date.toDateString() === excludedDate.toDateString(),
      );

      if (!daysAccepte.includes(dayOfWeek) && !isExcluded)
        arrayOfDays.push({ dayOfWeek, date: new Date(new_date) });
    }

    return arrayOfDays;
  };

  static addMinutesToDate(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setMinutes(date.getMinutes() + minutes);

    // اگر دقیقه بیشتر از 59 شد، ساعت را یک واحد افزایش می‌دهیم و دقیقه را به مقدار باقی‌مانده تنظیم می‌کنیم
    while (newDate.getMinutes() >= 60) {
      newDate.setHours(newDate.getHours() + 1);
      newDate.setMinutes(newDate.getMinutes() - 60);
    }

    return newDate;
  }

  static generateTimeList(
    startDate: string,
    endDate: string,
    intervalMinutes: number,
  ): string[] {
    if (!startDate || !endDate) return [];
    const timeList: Array<any> = [];

    // ایجاد یک تاریخ پایه (مثلاً امروز)
    const baseDate = new Date();
    baseDate.setHours(0, 0, 0, 0); // ساعت و دقیقه و ثانیه و میلی‌ثانیه را صفر می‌کنیم

    // تابعی برای تبدیل رشته ساعت و دقیقه به شیء Date
    function convertToDateTime(timeString: string): Date {
      const [hours, minutes] = timeString?.split(':')?.map(Number);
      const date = new Date(baseDate);
      date.setHours(hours, minutes);
      return date;
    }

    let currentTime = convertToDateTime(startDate);
    const endTimeObject = convertToDateTime(endDate);
    while (currentTime <= endTimeObject) {
      const endTime = this.addMinutesToDate(currentTime, intervalMinutes);
      const startHours = currentTime.getHours().toString().padStart(2, '0');
      const startMinutes = currentTime.getMinutes().toString().padStart(2, '0');
      const endHours = endTime.getHours().toString().padStart(2, '0');
      const endMinutes = endTime.getMinutes().toString().padStart(2, '0');
      timeList.push({
        time: `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`,
        isReserved: false,
      });
      currentTime = endTime;
    }

    return timeList;
  }

  static addMinutes(date: Date, minutes: number) {
    return new Date(date.getTime() + minutes * 60000);
  }

  static convertJalaliDateToParts(jalaliDate) {
    // تبدیل رشته تاریخ به شیء jalaliMoment
    const momentDate = jalaliMoment(jalaliDate, 'jYYYY/jM/jD');

    // استخراج روز هفته، روز ماه و نام ماه
    const dayOfWeek = momentDate.format('dddd'); // روز هفته به فارسی
    const dayOfMonth = momentDate.format('jD'); // روز ماه
    const monthName = momentDate.format('jMMMM'); // نام ماه به فارسی

    return [dayOfWeek, dayOfMonth, monthName];
  }

  static generateNextNumber(lastNumber: number): string {
    lastNumber++;
    const formattedNumber = lastNumber.toString().padStart(8, '0');
    return formattedNumber;
  }

  static getDayOfWeek(dateString: string): string {
    const date = new Date(dateString); // یک شیء Date از رشته تاریخ ایجاد می‌کند

    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];

    const dayIndex = date.getDay(); // عدد مربوط به روز هفته را برمی‌گرداند (0 = یکشنبه، 1 = دوشنبه و...)

    return daysOfWeek[dayIndex]; // نام روز هفته را برمی‌گرداند
  }

  static addMinutesToTime(timeStr: string, minutesToAdd: number): string {
    // تقسیم رشته زمان به ساعت و دقیقه
    const [hoursStr, minutesStr] = timeStr.split(':');

    // تبدیل رشته‌ها به اعداد
    const currentHours = parseInt(hoursStr, 10);
    const currentMinutes = parseInt(minutesStr, 10);

    // محاسبه کل دقایق از ابتدای روز
    const totalMinutes = currentHours * 60 + currentMinutes + minutesToAdd;

    // محاسبه ساعت و دقیقه جدید از مجموع کل دقایق
    const newHours = Math.floor(totalMinutes / 60) % 24; // % 24 برای حالت‌هایی مثل 24:15 هست که تبدیل به 00:15 می‌شه.
    const newMinutes = totalMinutes % 60;

    // فرمت‌دهی ساعت و دقیقه برای داشتن دو رقم
    const formattedHours = String(newHours).padStart(2, '0');
    const formattedMinutes = String(newMinutes).padStart(2, '0');

    // برگرداندن زمان جدید به صورت رشته
    return `${formattedHours}:${formattedMinutes}`;
  }
}
