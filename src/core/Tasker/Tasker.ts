import { Task } from './Tasker.types';

export class Tasker {
  private _currentTask: Task | null = null;
  private _completedTasks: Task[] = [];
  private _availableTasks: Task[];

  get availableTasks() {
    return this._availableTasks;
  }

  constructor(tasks: Task[]) {
    this._availableTasks = tasks;
  }

  static _createHTMLTaskMarker(className: string) {
    const el = document.createElement('img');
    el.classList.add(className);

    return el;
  }

  private _findAvailableTaskById(id: number) {
    const availableTask = this._availableTasks.find((item) => item.id === id);

    if (!availableTask) {
      throw new Error('Task is not available');
    }

    return availableTask;
  }

  public _beginTask(id: number) {
    if (this._currentTask !== null) {
      throw new Error(`More than one task at once are not supported.`);
    }
    const task = this._findAvailableTaskById(id);
    this._currentTask = task;
    this._currentTask.activeStep = 1;
  }

  public _getCurrentTaskActieStep() {
    if (!this._currentTask) {
      throw Error('None tasks active');
    }

    return this._currentTask.activeStep;
  }
}
