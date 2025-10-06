import './extensions';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: false,
  });
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/public/',
  });

  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('Doctor')
    .setDescription("The Doctor's API description")
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/api-docs', app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  await app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error: any) => ({
            field: error.property,
            // error: Object?.values(error?.constraints).join(', '),
          })),
        );
      },
      whitelist: true,
    }),
  );

  app.enableCors({ allowedHeaders: '*', origin: '*', credentials: true });

  // ✅ اضافه کردن Global ValidationPipe با transform: true
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // این خط کلیدی است
      whitelist: true, // (اختیاری اما توصیه می‌شود)
    }),
  );

  await app.listen(3001);
}
bootstrap();
