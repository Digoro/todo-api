import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('POST /tasks (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns 404 for GET /tasks/:id when the task does not exist', () => {
    return request(app.getHttpServer()).get('/tasks/999').expect(404);
  });

  it('returns 404 for PATCH /tasks/:id/complete when the task does not exist', () => {
    return request(app.getHttpServer())
      .patch('/tasks/999/complete')
      .expect(404);
  });

  it('creates a task with a valid title', async () => {
    const res = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'a' })
      .expect(201);
    expect(res.body.status).toBe('todo');
  });

  it('accepts a title of exactly 100 characters', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'a'.repeat(100) })
      .expect(201);
  });

  it('returns 400 when title is missing', () => {
    return request(app.getHttpServer()).post('/tasks').send({}).expect(400);
  });

  it('returns 400 when title is an empty string', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: '' })
      .expect(400);
  });

  it('returns 400 when title is longer than 100 characters', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'a'.repeat(101) })
      .expect(400);
  });

  it('returns 400 when title is not a string', () => {
    return request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 123 })
      .expect(400);
  });
});
