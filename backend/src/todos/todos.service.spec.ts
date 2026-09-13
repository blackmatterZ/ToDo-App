import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { Category } from '../categories/entities/category.entity';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  const mockCategory: Category = {
    id: 'cat-uuid',
    name: 'Work',
    color: '#ff0000',
    createdAt: new Date(),
    updatedAt: new Date(),
    todos: [],
  };

  const mockTodo: Todo = {
    id: 'some-uuid',
    title: 'Test Todo',
    completed: false,
    categoryId: null,
    category: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: 'some-uuid' })),
    save: jest.fn().mockImplementation((todo) => Promise.resolve({ ...mockTodo, ...todo })),
    findAndCount: jest.fn().mockResolvedValue([[mockTodo], 1]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === 'some-uuid') return Promise.resolve(mockTodo);
      return Promise.resolve(null);
    }),
    remove: jest.fn().mockResolvedValue(mockTodo),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        {
          provide: getRepositoryToken(Todo),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
    repository = module.get<Repository<Todo>>(getRepositoryToken(Todo));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return a new todo', async () => {
      const dto = { title: 'New Todo' };
      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result).toHaveProperty('id', 'some-uuid');
    });
  });

  describe('findAll', () => {
    it('should return a paginated array of todos', async () => {
      const result = await service.findAll();
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([[mockTodo], 1]);
    });

    it('should filter by search and categoryId', async () => {
      await service.findAll(2, 5, 'test', 'cat-uuid');
      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        where: {
          title: Like('%test%'),
          categoryId: 'cat-uuid',
        },
        skip: 5,
        take: 5,
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single todo if found', async () => {
      const result = await service.findOne('some-uuid');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      await expect(service.findOne('missing')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the todo', async () => {
      const dto = { completed: true };
      const result = await service.update('some-uuid', dto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.completed).toBe(true);
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      await expect(service.update('missing', { title: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      await service.remove('some-uuid');
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 'some-uuid' } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTodo);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      await expect(service.remove('missing')).rejects.toThrow(NotFoundException);
    });
  });
});
