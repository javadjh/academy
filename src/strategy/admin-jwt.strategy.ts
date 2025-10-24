import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import {
  ACCESS_ERROR_MESSAGE,
  IS_EXIT_ERROR_MESSAGE,
} from 'src/config/messages';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { User, UserDocument } from 'src/schema/user.schema';
import { userTypeEnum } from 'src/shareDTO/enums';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(
    @InjectModel(User.name) private readonly model: Model<UserDocument>,

    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.TOKEN_KEY,
    });
  }
  async validate(payload: any) {
    let user: any = await this.cacheManager.get(`userObject-${payload?.sub}`);

    if (!user?._id) {
      user = await this.model.findById(payload.sub).lean();
    } else {
      console.log('* find from Redis *');
    }

    console.log(user);
    if (!user?._id ||( user?.userType != userTypeEnum.admin && user?.userType != userTypeEnum.super_admin))
      throw new BadRequestException(ACCESS_ERROR_MESSAGE);

    if (user?.isExit) throw new BadRequestException(IS_EXIT_ERROR_MESSAGE);

    return user;
  }
}
