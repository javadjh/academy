import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class Auth {
  constructor(private jwt: JwtService, private config: ConfigService) {}
  async generateToken(payload: any) {
    return await this.jwt.signAsync(payload, {
      secret: process.env.TOKEN_KEY,
    });
  }
  async decodeToken(token: string) {
    return await this.jwt.decode(token);
  }
}
