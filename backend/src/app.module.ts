import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

import * as fs from 'fs';
import configuration from './config/configuration';
import { TodosModule } from './todos/todos.module';
import { CategoriesModule } from './categories/categories.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
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
          exclude: ['/api/(.*)'],
        },
      ],
    }),

    TodosModule,
    CategoriesModule,
    StatisticsModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

