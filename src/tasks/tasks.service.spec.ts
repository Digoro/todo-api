import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service.js';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('creates a task with status todo', () => {
    const task = service.create({ title: 'a' });
    expect(task.id).toBe(1);
    expect(task.title).toBe('a');
    expect(task.status).toBe('todo');
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it('lists all tasks', () => {
    service.create({ title: 'a' });
    service.create({ title: 'b' });
    const tasks = service.findAll();
    expect(tasks).toHaveLength(2);
    expect(tasks.map((t) => t.title)).toEqual(['a', 'b']);
  });

  it('completes a task', () => {
    const { id } = service.create({ title: 'a' });
    expect(service.complete(id).status).toBe('done');
    expect(service.findOne(id).status).toBe('done');
  });

  it('throws NotFoundException when finding a task that does not exist', () => {
    expect(() => service.findOne(999)).toThrow(NotFoundException);
  });

  it('throws NotFoundException when completing a task that does not exist', () => {
    expect(() => service.complete(999)).toThrow(NotFoundException);
  });
});
