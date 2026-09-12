import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import * as path from 'path';

import * as fs from 'fs';
import configuration from './config/configuration';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    // security: OWASP A04 - Insecure Design: rate-limit all API requests
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60000),
            limit: config.get<number>('THROTTLE_LIMIT', 100),
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPath = configService.get<string>('database.path', './data/todos.sqlite');
        const dbDir = path.dirname(dbPath);
        if (dbDir && !fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }

        return {
          type: 'sqlite',
          database: dbPath,
          autoLoadEntities: true,
          synchronize: true, // safe for SQLite dev/demo mode
        };
      },
    }),
    ServeStaticModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          rootPath: configService.get<string>('staticDir'),
          serveRoot: '/',
          // Exclude API routes from static serving so they reach NestJS handlers
          exclude: ['/api*'],
          // Render index.html for any path not matching a real static file (SPA fallback)
          renderPath: '/*',
        },
      ],
    }),

    TodosModule,

  ],
  controllers: [],
  providers: [
    // Apply rate limiting globally to all routes — security: OWASP A04
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}

