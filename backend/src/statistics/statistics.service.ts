import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../todos/entities/todo.entity';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getStatistics() {
    const total = await this.todoRepository.count();
    const completed = await this.todoRepository.count({ where: { status: 'Completed' } });
    const pending = total - completed;

    // Aggregate by category
    const queryBuilder = this.todoRepository.createQueryBuilder('todo');
    const categoryStats = await queryBuilder
      .select('todo.categoryId', 'categoryId')
      .addSelect('COUNT(todo.id)', 'count')
      .groupBy('todo.categoryId')
      .getRawMany();

    // fetch all categories to map names (including null)
    const categories = await this.categoryRepository.find();
    
    const byCategory = categoryStats.map((stat) => {
      const category = categories.find((c) => c.id === stat.categoryId);
      return {
        categoryId: stat.categoryId,
        name: category ? category.name : 'Uncategorized',
        count: parseInt(stat.count, 10),
      };
    });

    return {
      total,
      completed,
      pending,
      byCategory,
    };
  }
}
