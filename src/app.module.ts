import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { ScheduleModule } from '@nestjs/schedule';
import modules from './modules';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    MongooseModule.forRoot(
      // 'mongodb://scan_user:A_NEW_PASSWORD_FOR_SCAN_DB@127.0.0.1:27017/scan_db',

      'mongodb://127.0.0.1:27017/academy',
    ),
    ScheduleModule.forRoot(),

    CacheModule.register({
      host: '127.0.0.1',
      port: 6379,
      isGlobal: true,
    }),
    ...modules,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {}
}
