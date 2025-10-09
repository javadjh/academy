import { Module } from '@nestjs/common';
import schema from 'src/schema';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { AdminJwtStrategy } from 'src/strategy/admin-jwt.strategy';
import handlers from './handlers';
import { Auth } from 'src/config/Auth';
import { DepartmentController } from './department.controller';

@Module({
  controllers: [DepartmentController],
  imports: [...schema, CqrsModule, JwtModule.register({})],
  providers: [...handlers, AdminJwtStrategy, Auth],
})
export class DepartmentModule {}
