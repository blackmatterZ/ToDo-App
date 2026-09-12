import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('Todos API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DB_PATH = './data/test-todos.sqlite';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  let createdTodoId: number;

  it('POST /api/todos - should reject payload with extra fields (OWASP A03)', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Strict Validation Test', injectedField: 'malicious' })
      .expect(400);

    expect(res.body).toHaveProperty('statusCode', 400);
  });

  it('POST /api/todos - should reject payload without title', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todos')
      .send({})
      .expect(400);

    expect(res.body).toHaveProperty('statusCode', 400);
  });

  it('POST /api/todos - should create a new todo', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/todos')
      .send({ title: 'Buy groceries', completed: false })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.completed).toBe(false);
    createdTodoId = res.body.id;
  });

  it('GET /api/todos - should return all todos', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todos')
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const item = res.body.find((t: any) => t.id === createdTodoId);
    expect(item).toBeDefined();
    expect(item.title).toBe('Buy groceries');
  });

  it('GET /api/todos/:id - should return single todo', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/todos/${createdTodoId}`)
      .expect(200);

    expect(res.body.id).toBe(createdTodoId);
    expect(res.body.title).toBe('Buy groceries');
  });

  it('GET /api/todos/:id - should return 404 for non-existent id', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todos/99999')
      .expect(404);

    expect(res.body).toHaveProperty('statusCode', 404);
  });

  it('PATCH /api/todos/:id - should update todo completed status', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/todos/${createdTodoId}`)
      .send({ completed: true })
      .expect(200);

    expect(res.body.id).toBe(createdTodoId);
    expect(res.body.completed).toBe(true);
  });

  it('DELETE /api/todos/:id - should delete todo', async () => {
    await request(app.getHttpServer())
      .delete(`/api/todos/${createdTodoId}`)
      .expect(204);
  });

  it('GET /api/todos/:id - should return 404 after deletion', async () => {
    await request(app.getHttpServer())
      .get(`/api/todos/${createdTodoId}`)
      .expect(404);
  });
});
