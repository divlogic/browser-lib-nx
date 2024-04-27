export type TagType = {
  id?: number;
  text: string;
  color?: string;
};

export type TagState = {
  loaded: boolean;
  data: TagType[];
};

export type Action = SingularAction | PluralAction;

type SingularAction = {
  type: 'added' | 'removed' | 'edited';
  payload: {
    data: TagType;
  };
};

type PluralAction = {
  type: 'loaded';
  payload: {
    data: TagType[];
  };
};

export function tagsReducer(tagsState: TagState, action: Action): TagState {
  const newState = Object.assign({}, tagsState);

  switch (action.type) {
    case 'added':
      return {
        loaded: newState.loaded,
        data: [...newState.data, action.payload.data],
      };
    case 'removed':
      return {
        loaded: newState.loaded,
        data: newState.data.filter((tag: TagType) => {
          return tag.id !== action.payload.data.id;
        }),
      };
    case 'edited':
      return {
        loaded: newState.loaded,
        data: newState.data.map((tag: TagType) => {
          if (tag.id === action.payload.data.id) {
            tag = action.payload.data;
          }
          return tag;
        }),
      };
    case 'loaded':
      return { loaded: true, data: action.payload.data };
    default:
      throw Error('Unknown action: ' + action);
  }
}
