import { Task } from './Tasker.types';

export class Tasker {
  private _currentTask: Task | null = null;
  private _completedTasks: Task[] = [];
  private _availableTasks: Task[];
  static _markerType = 'data-taskid';
  static _markerClassName = 'task';

  get currentTask() {
    return this._currentTask;
  }

  get availableTasks() {
    return this._availableTasks;
  }

  constructor(tasks: Task[]) {
    this._availableTasks = tasks;
  }

  static _createHTMLTaskMarker(className: string, id: string) {
    const el = document.createElement('img');
    el.setAttribute(this._markerType, id);
    el.src = '/quest.png';
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
    this._availableTasks = this._availableTasks.filter((task) => task.id !== task.id)
    this._currentTask.activeStep = 0;
  }

  public _isNextTaskStepAvailable() {
    this._validateCurrentTask()

    return this._currentTask!.activeStep < this._currentTask!.steps.length - 1
  }

  public _getCurrentTaskActiveStep() {
    this._validateCurrentTask()

    return this._currentTask!.activeStep;
  }

  public _taskCompleted() {
    this._validateCurrentTask()

    this._completedTasks.push(this._currentTask!)
    this._currentTask = null;
  }

  private _validateCurrentTask() {
    if (!this._currentTask) throw new Error(`There isn't any task activated`);
  }

  public _setNewStep() {
    this._validateCurrentTask()
    this._currentTask!.activeStep += 1!
  }
}
