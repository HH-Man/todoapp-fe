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

  isPrioHigh(): boolean {
    return this.prio === 'HIGH';
  }

  isPrioMedium(): boolean {
    return this.prio === 'MEDIUM';
  }

  isPrioLow(): boolean {
    return this.prio === 'LOW';
  }

  trackById(index, item) {
    return item.title;
  }
}
