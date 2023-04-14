import { Task } from '@core';

export type EstimatedArrival = number | null;

export interface Store {
  velocity: number;
  bearing: number;
  distance: number;
  estimatedArrival: EstimatedArrival;
  questLog: {
    completed: Task[],
    current: Task | null,
    available: Task[],
  }
}

export type TStoreContext = {
  store: Store;
  setVelocity: (value: number) => void;
  setBearing: (value: number) => void;
  addDistance: (value: number) => void;
  setEstimatedArrival: (value: EstimatedArrival) => void;
  setAvailableTasks: (tasks: Task[]) => void;
  setCompletedTasks: (tasks: Task[]) => void;
  setCurrentTask: (task: Task | null) => void;

};

export enum ReducerActionType {
  SET_VELOCITY = 'SET_VELOCITY',
  SET_BEARING = 'SET_BEARING',
  ADD_DISTANCE = 'ADD_DISTANCE',
  SET_ESTIMATED_ARRIVAL = 'SET_ESTIMATED_ARRIVAL',
  SET_AVAILABLE_QUESTS = 'SET_AVAILABLE_QUESTS',
  SET_COMPLETED_QUESTS = 'SET_COMPLETED_QUESTS',
  SET_CURRENT_QUEST = 'SET_CURRENT_QUEST',
}

export type ReducerAction = 
  | { type: ReducerActionType.SET_VELOCITY, payload: number }
  | { type: ReducerActionType.SET_BEARING, payload: number }
  | { type: ReducerActionType.ADD_DISTANCE, payload: number }
  | { type: ReducerActionType.SET_ESTIMATED_ARRIVAL, payload: EstimatedArrival }
  | { type: ReducerActionType.SET_AVAILABLE_QUESTS, payload: Task[] }
  | { type: ReducerActionType.SET_CURRENT_QUEST, payload: Task | null }
  | { type: ReducerActionType.SET_COMPLETED_QUESTS, payload: Task[] }