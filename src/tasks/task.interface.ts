export interface Task {
  id: number;
  title: string;
  status: 'todo' | 'done';
  createdAt: Date;
}
