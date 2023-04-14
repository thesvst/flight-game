import { Task } from './Tasker.types';
import mapboxgl from 'mapbox-gl';

export class Tasker {
  readonly _markerType: string;
  private readonly _markerClassName: string

  private _currentTask: Task | null = null;
  private _completedTasks: Task[] = [];
  private _availableTasks: Task[];

  get currentTask() {
    return this._currentTask;
  }

  get availableTasks() {
    return this._availableTasks;
  }

  get completedTasks() {
    return this._completedTasks;
  }

  constructor(tasks: Task[], markerClassName: string, markerType: string) {
    this._availableTasks = tasks;
    this._markerClassName = markerClassName
    this._markerType = markerType;
  }

  public _createHTMLTaskMarker(id: string) {
    const el = document.createElement('img');
    el.setAttribute(this._markerType, id);
    el.src = '/quest.png';
    el.classList.add(this._markerClassName);

    return el;
  }

  private _validateCurrentTask() {
    if (!this._currentTask) throw new Error(`There isn't any task activated`);
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

    const currentTask = this._findAvailableTaskById(id);
    this._currentTask = currentTask;
    this._availableTasks = this._availableTasks.filter((task) => task.id !== currentTask.id)
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

    this._completedTasks = [...this._completedTasks, this._currentTask!]
    this._availableTasks = this._availableTasks.filter((task) => task.id !== this._currentTask?.id)
    this._currentTask = null;
  }

  public _setNewStep() {
    this._validateCurrentTask()
    this._currentTask!.activeStep += 1!
  }

  public _getNextTaskStepCoordinates() {
    this._validateCurrentTask()

    const step = this._getCurrentTaskActiveStep();
    return this.currentTask!.steps[step].coordinates
  }
}
