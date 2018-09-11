import { Prio } from './prio';

export class Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  prio: string;

  constructor() {
    this.prio = 'MEDIUM';
  }
}
