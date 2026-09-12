import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Security: OWASP A05 - Disable X-Powered-By header and apply Helmet security headers
  app.disable('x-powered-by');
  app.use(helmet());

  // Security: OWASP A05 - Restrictive CORS policy (avoid wildcard origin)
  const allowedOrigins = (configService.get<string>('cors.origin') || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim());

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

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

