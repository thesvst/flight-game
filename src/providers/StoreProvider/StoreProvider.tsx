import { createContext, ReactNode, useReducer } from 'react';
import { EstimatedArrival, ReducerAction, ReducerActionType, Store, TStoreContext } from './StoreProvider.types';

const initialStore: Store = {
  velocity: 0,
  bearing: 0,
  distance: 0,
  estimatedArrival: null,
}

export const StoreContext = createContext<TStoreContext>(null!);

const reducer = (state: Store, action: ReducerAction): Store => {
  switch (action.type) {
    case ReducerActionType.SET_VELOCITY: {
      return { ...state, velocity: action.payload };
    }
    case ReducerActionType.SET_BEARING: {
      return { ...state, bearing: action.payload };
    }
    case ReducerActionType.ADD_DISTANCE: {
      return { ...state, distance: state.distance + action.payload }
    }
    case ReducerActionType.SET_ESTIMATED_ARRIVAL: {
      return { ...state, estimatedArrival: action.payload }
    }
  }
}

interface StoreProviderProps {
  children: ReactNode;
}

export const StoreProvider = (props: StoreProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialStore)

  return <StoreContext.Provider value={{
    store: state,
    setVelocity: (value: number) => {
      dispatch({ type: ReducerActionType.SET_VELOCITY, payload: value })
    },
    setBearing(value: number) {
      dispatch({ type: ReducerActionType.SET_BEARING, payload: value })
    },
    addDistance(value: number) {
      dispatch({ type: ReducerActionType.ADD_DISTANCE, payload: value })
    },
    setEstimatedArrival(value: EstimatedArrival) {
      dispatch({ type: ReducerActionType.SET_ESTIMATED_ARRIVAL, payload: value })
    }
  }}>{props.children}</StoreContext.Provider>;
};
