import { State, Action } from './color-generator-container';
export type State = [number, number, number][];
export type Action = {
  type: 'added' | 'changed' | 'removed';
  payload: { index?: number; data?: [number, number, number] };
};

export function reducer(state: State, action: Action) {
  const newState = [...state];
  switch (action.type) {
    case 'added': {
      if (action.payload.data) {
        newState.push(action.payload.data);
        return newState;
      } else {
        throw new Error('Missing data from added action');
      }
    }
    case 'changed': {
      if (typeof action.payload.index === 'number') {
        const i = action.payload.index;
        newState[action.payload.index] = action.payload.data;
        return newState;
      } else {
        throw new Error('Cannot change newState without an index');
      }
    }
    case 'removed': {
      newState.pop();
      return newState;
    }
    default: {
      throw new Error('Error in reducer');
    }
  }
}
