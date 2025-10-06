import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User, UserDocument } from 'src/schema/user.schema';
import { Model } from 'mongoose';
import {
  IS_EXIT_ERROR_MESSAGE,
  RECORD_NOT_FOUND_ERROR_MESSAGE,
} from 'src/config/messages';
import { User, UserDocument } from 'src/schema/user.schema';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
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

    if (!user?._id)
      throw new BadRequestException(RECORD_NOT_FOUND_ERROR_MESSAGE);

    if (user?.isExit) throw new BadRequestException(IS_EXIT_ERROR_MESSAGE);

    return user;
  }
}
