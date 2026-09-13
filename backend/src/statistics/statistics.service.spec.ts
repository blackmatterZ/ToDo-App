import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { Todo } from '../todos/entities/todo.entity';
import { Category } from '../categories/entities/category.entity';
import { Repository } from 'typeorm';

describe('StatisticsService', () => {
  let service: StatisticsService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    getRawMany: jest.fn().mockResolvedValue([
      { categoryId: 'cat-1', count: '5' },
      { categoryId: null, count: '3' },
    ]),
  };

  const mockTodoRepository = {
    count: jest.fn().mockImplementation((options) => {
      if (options && options.where && options.where.completed) {
        return Promise.resolve(4); // completed
      }
      return Promise.resolve(10); // total
    }),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockCategoryRepository = {
    find: jest.fn().mockResolvedValue([
      { id: 'cat-1', name: 'Work', color: '#ff0000' }
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockTodoRepository,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: mockCategoryRepository,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStatistics', () => {
    it('should aggregate statistics correctly', async () => {
      const stats = await service.getStatistics();
      
      expect(stats.total).toBe(10);
      expect(stats.completed).toBe(4);
      expect(stats.pending).toBe(6);
      
      expect(stats.byCategory).toHaveLength(2);
      expect(stats.byCategory[0]).toEqual({
        categoryId: 'cat-1',
        name: 'Work',
        count: 5,
      });
      expect(stats.byCategory[1]).toEqual({
        categoryId: null,
        name: 'Uncategorized',
        count: 3,
      });
    });
  });
});
