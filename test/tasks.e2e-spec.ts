import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('GET /tasks?status= (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const server = app.getHttpServer();
    await request(server).post('/tasks').send({ title: 'a' });
    const b = await request(server).post('/tasks').send({ title: 'b' });
    await request(server).post('/tasks').send({ title: 'c' });
    await request(server).patch(`/tasks/${b.body.id}/complete`).expect(200);
  });

  afterEach(async () => {
    await app.close();
  });

  const titles = (body: { title: string }[]) => body.map((t) => t.title);

  it('returns all tasks without a status', async () => {
    const res = await request(app.getHttpServer()).get('/tasks').expect(200);
    expect(titles(res.body)).toEqual(['a', 'b', 'c']);
  });

  it('returns only done tasks for status=done', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks?status=done')
      .expect(200);
    expect(titles(res.body)).toEqual(['b']);
  });

  it('returns only todo tasks for status=todo', async () => {
    const res = await request(app.getHttpServer())
      .get('/tasks?status=todo')
      .expect(200);
    expect(titles(res.body)).toEqual(['a', 'c']);
  });

  it('returns 400 for an unknown status', () => {
    return request(app.getHttpServer()).get('/tasks?status=foo').expect(400);
  });

  it('returns 400 when status is given more than once', () => {
    return request(app.getHttpServer())
      .get('/tasks?status=todo&status=done')
      .expect(400);
  });
});

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
