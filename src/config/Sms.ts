import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as request from 'request';
import { smsTypeEnum } from 'src/shareDTO/enums';

@Injectable()
export class Sms {
  static async sendSms(
    phoneNumber: string,
    textList: Array<any>,
    smsPattern: smsTypeEnum,
  ) {
    try {
      await axios.post(
        `https://console.melipayamak.com/api/send/shared/e57a46ef7be2405e93a210871412b8ef`,
        {
          bodyId: smsPattern,
          to: phoneNumber,
          args: textList,
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
