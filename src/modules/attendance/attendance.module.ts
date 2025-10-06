import { Module } from '@nestjs/common';
import { AttendanceController } from './attendance.controller';
import schema from 'src/schema';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from 'src/strategy/admin-jwt.strategy';
import handlers from './handlers';
import { Auth } from 'src/config/Auth';

@Module({
  controllers: [AttendanceController],
  imports: [...schema, CqrsModule, JwtModule.register({})],
  providers: [...handlers, AdminJwtStrategy, Auth],
})
export class AttendanceModule {}
