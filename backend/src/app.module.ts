import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import * as fs from 'fs';
import configuration from './config/configuration';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
