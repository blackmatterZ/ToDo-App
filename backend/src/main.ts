import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Security: OWASP A05 - Disable X-Powered-By header and apply Helmet security headers
  app.disable('x-powered-by');
  app.use(helmet());

  app.setGlobalPrefix('api');

  // Security: OWASP A05 - Mask internal errors and sanitize responses
  app.useGlobalFilters(new AllExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );



  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();

