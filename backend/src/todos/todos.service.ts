import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from './entities/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepository: Repository<Todo>,
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    const todo = this.todoRepository.create(createTodoDto);
    return this.todoRepository.save(todo);
  }

  async findAll(
    page: number = 1,
    pageSize: number = 10,
    search?: string,
    categoryId?: string,
  ): Promise<[Todo[], number]> {
    const qb = this.todoRepository.createQueryBuilder('todo');

    if (search) {
      qb.andWhere('todo.title LIKE :search', { search: `%${search}%` });
    }
    if (categoryId) {
      qb.andWhere('todo.categoryId = :categoryId', { categoryId });
    }

    qb.skip((page - 1) * pageSize);
    qb.take(pageSize);

    // SQLite doesn't natively support NULLS LAST out of the box in some older engines,
    // but we can sort by whether dueAt is null first, then the actual dueAt.
    // In SQLite: boolean expressions like "todo.dueAt IS NULL" return 0 (false) or 1 (true)
    qb.orderBy('todo.dueAt IS NULL', 'ASC');
    qb.addOrderBy('todo.dueAt', 'ASC');
    qb.addOrderBy('todo.createdAt', 'DESC');

    return qb.getManyAndCount();
  }

  async findOne(id: string): Promise<Todo> {
    const todo = await this.todoRepository.findOne({ where: { id } });
    if (!todo) {
      throw new NotFoundException(`Todo with ID ${id} not found`);
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    const todo = await this.findOne(id);
    Object.assign(todo, updateTodoDto);
    return this.todoRepository.save(todo);
  }

  async remove(id: string): Promise<void> {
    const todo = await this.findOne(id);
    await this.todoRepository.remove(todo);
  }
}
