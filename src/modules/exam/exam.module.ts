import { Module } from '@nestjs/common';
import schema from 'src/schema';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from 'src/strategy/admin-jwt.strategy';
import handlers from './handlers';
import { Auth } from 'src/config/Auth';
import { ExamController } from './exam.controller';
import { TeacherJwtStrategy } from 'src/strategy/teacher-jwt.strategy';

@Module({
  controllers: [ExamController],
  imports: [...schema, CqrsModule, JwtModule.register({})],
  providers: [...handlers, AdminJwtStrategy, Auth, TeacherJwtStrategy],
})
export class ExamModule {}
