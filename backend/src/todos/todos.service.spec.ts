import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';

describe('TodosService', () => {
  let service: TodosService;
  let repository: Repository<Todo>;

  const mockTodo: Todo = {
    id: 1,
    title: 'Test Todo',
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn().mockImplementation((dto) => ({ ...dto, id: 1 })),
    save: jest.fn().mockImplementation((todo) => Promise.resolve({ ...mockTodo, ...todo })),
    find: jest.fn().mockResolvedValue([mockTodo]),
    findOne: jest.fn().mockImplementation(({ where: { id } }) => {
      if (id === 1) return Promise.resolve(mockTodo);
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
      expect(result).toHaveProperty('id', 1);
    });
  });

  describe('findAll', () => {
    it('should return an array of todos', async () => {
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
      expect(result).toEqual([mockTodo]);
    });
  });

  describe('findOne', () => {
    it('should return a single todo if found', async () => {
      const result = await service.findOne(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTodo);
    });

    it('should throw NotFoundException if todo not found', async () => {
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the todo', async () => {
      const dto = { completed: true };
      const result = await service.update(1, dto);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.completed).toBe(true);
    });

    it('should throw NotFoundException when updating non-existent todo', async () => {
      await expect(service.update(999, { title: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove the todo', async () => {
      await service.remove(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockTodo);
    });

    it('should throw NotFoundException when deleting non-existent todo', async () => {
      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
