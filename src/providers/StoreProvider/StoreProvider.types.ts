import { Task } from '@core';

export type EstimatedArrival = number | null;

export interface Store {
  velocity: number;
  bearing: number;
  distance: number;
  estimatedArrival: EstimatedArrival;
  questLog: Task[]
}

export type TStoreContext = {
  store: Store;
  setVelocity: (value: number) => void;
  setBearing: (value: number) => void;
  addDistance: (value: number) => void;
  setEstimatedArrival: (value: EstimatedArrival) => void;
  setQuestLog: (quest: Task[]) => void;
};

export enum ReducerActionType {
  SET_VELOCITY = 'SET_VELOCITY',
  SET_BEARING = 'SET_BEARING',
  ADD_DISTANCE = 'ADD_DISTANCE',
  SET_ESTIMATED_ARRIVAL = 'SET_ESTIMATED_ARRIVAL',
  SET_QUEST_LOG = 'SET_QUEST_LOG',
}

export type ReducerAction = 
  | { type: ReducerActionType.SET_VELOCITY, payload: number }
  | { type: ReducerActionType.SET_BEARING, payload: number }
  | { type: ReducerActionType.ADD_DISTANCE, payload: number }
  | { type: ReducerActionType.SET_ESTIMATED_ARRIVAL, payload: EstimatedArrival }
  | { type: ReducerActionType.SET_QUEST_LOG, payload: Task[] }