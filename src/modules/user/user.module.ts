import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import schema from 'src/schema';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from 'src/strategy/admin-jwt.strategy';
import handlers from './handlers';
import { Auth } from 'src/config/Auth';
import { JwtStrategy } from 'src/strategy/jwt.strategy';
import { TeacherJwtStrategy } from 'src/strategy/teacher-jwt.strategy';

@Module({
  controllers: [UserController],
  imports: [...schema, CqrsModule, JwtModule.register({})],
  providers: [
    ...handlers,
    AdminJwtStrategy,
    Auth,
    JwtStrategy,
    TeacherJwtStrategy,
  ],
})
export class UserModule {}
