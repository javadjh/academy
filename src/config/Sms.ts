import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import * as request from 'request';
import { smsTypeEnum } from 'src/shareDTO/enums';

@Injectable()
export class Sms {
  static async sendSms(phoneNumber: Array<any>, text: string) {
    try {
      await axios.post(
        `https://console.melipayamak.com/api/send/advanced/8a19c527f9d04da3bd5cc1e2a9a9632a`,
        {
          from: '50002710000126',
          to: phoneNumber,
          text: `${text}\nلغو11`,
          udh: '',
        },
      );
    } catch (error) {
      console.log(error);
    }
  }
}
