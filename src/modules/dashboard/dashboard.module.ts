import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DashboardController } from './dashboard.controller';
import schema from 'src/schema';
import { JwtModule } from '@nestjs/jwt';
import handlers from './handlers';
import { AdminJwtStrategy } from 'src/strategy/admin-jwt.strategy';
import { Auth } from 'src/config/Auth';
import { TeacherJwtStrategy } from 'src/strategy/teacher-jwt.strategy';
import { StudentJwtStrategy } from 'src/strategy/student-jwt.strategy';

@Module({
  controllers: [DashboardController],
  imports: [...schema, CqrsModule, JwtModule.register({})],
  providers: [
    ...handlers,
    AdminJwtStrategy,
    Auth,
    TeacherJwtStrategy,
    StudentJwtStrategy,
  ],
})
export class DashboardModule {}
