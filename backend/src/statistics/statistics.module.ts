import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { Todo } from '../todos/entities/todo.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Todo, Category])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
