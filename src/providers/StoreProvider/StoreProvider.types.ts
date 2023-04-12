export interface Store {
  velocity: number;
  bearing: number;
  distance: number;
}

export type TStoreContext = {
  store: Store;
  setVelocity: (value: number) => void;
  setBearing: (value: number) => void;
  addDistance: (value: number) => void;
};

export enum ReducerActionType {
  SET_VELOCITY = 'SET_VELOCITY',
  SET_BEARING = 'SET_BEARING',
  ADD_DISTANCE = 'ADD_DISTANCE',
}

export type ReducerAction = 
  | { type: ReducerActionType.SET_VELOCITY, payload: number }
  | { type: ReducerActionType.SET_BEARING, payload: number }
  | { type: ReducerActionType.ADD_DISTANCE, payload: number }