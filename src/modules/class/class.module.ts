import { Module } from '@nestjs/common';
import { ClassController } from './class.controller';
import schema from 'src/schema';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from 'src/strategy/admin-jwt.strategy';
import handlers from './handlers';
import { Auth } from 'src/config/Auth';
import { TeacherJwtStrategy } from 'src/strategy/teacher-jwt.strategy';

@Module({
  controllers: [ClassController],
  imports: [...schema, CqrsModule, JwtModule.register({})],
  providers: [...handlers, AdminJwtStrategy, Auth, TeacherJwtStrategy],
})
export class ClassModule {}
