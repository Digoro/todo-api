import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto.js';
import { Task } from './task.interface.js';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];
  private nextId = 1;

  create(dto: CreateTaskDto): Task {
    const task: Task = {
      id: this.nextId++,
      title: dto.title,
      status: 'todo',
      createdAt: new Date(),
    };
    this.tasks.push(task);
    return task;
  }

  findAll(): Task[] {
    return this.tasks;
  }

  findOne(id: number): Task {
    return this.tasks.find((t) => t.id === id) as Task;
  }

  complete(id: number): Task {
    const task = this.findOne(id);
    task.status = 'done';
    return task;
  }

  remove(id: number): void {
    this.tasks = this.tasks.filter((t) => t.id !== id);
  }
}
