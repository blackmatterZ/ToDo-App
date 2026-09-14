import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('Todos API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.DB_PATH = './data/test-todos-v2.sqlite';

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

  let createdTodoId: string;
  let categoryId: string;

  it('POST /api/categories - should create a category', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/categories')
      .send({ name: 'Work', color: '#ff0000' })
      .expect(201);
    
    categoryId = res.body.id;
    expect(categoryId).toBeDefined();
  });

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
      .send({ title: 'Buy groceries', status: "Pending", categoryId })
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.title).toBe('Buy groceries');
    expect(res.body.status).toBe("Pending");
    expect(res.body.categoryId).toBe(categoryId);
    createdTodoId = res.body.id;
  });

  it('GET /api/todos - should return paginated todos', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todos')
      .expect(200);

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    const item = res.body.data.find((t: any) => t.id === createdTodoId);
    expect(item).toBeDefined();
    expect(item.title).toBe('Buy groceries');
  });

  it('GET /api/todos?search= - should return filtered todos', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todos?search=groceries')
      .expect(200);

    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
    expect(res.body.data[0].title).toBe('Buy groceries');
  });

  it('GET /api/todos/:id - should return single todo', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/todos/${createdTodoId}`)
      .expect(200);

    expect(res.body.id).toBe(createdTodoId);
    expect(res.body.title).toBe('Buy groceries');
  });

  it('GET /api/todos/:id - should return 400 for bad uuid', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/todos/99999')
      .expect(400);

    expect(res.body).toHaveProperty('statusCode', 400);
  });

  it('PATCH /api/todos/:id - should update todo completed status', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/todos/${createdTodoId}`)
      .send({ status: "Completed" })
      .expect(200);

    expect(res.body.id).toBe(createdTodoId);
    expect(res.body.status).toBe("Completed");
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
