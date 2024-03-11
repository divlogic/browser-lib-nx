export type TagType = {
  id?: number;
  text?: string;
  color?: string;
};

export type TagState = {
  loaded: boolean;
  data: TagType[];
};

export type Action = SingularAction | PluralAction;

type SingularAction = {
  type: 'added' | 'removed';
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
  switch (action.type) {
    case 'added':
      return {
        loaded: tagsState.loaded,
        data: [...tagsState.data, action.payload.data],
      };
    case 'removed':
      return {
        loaded: tagsState.loaded,
        data: tagsState.data.filter(
          (tag: TagType) => tag.text !== action.payload.data?.text
        ),
      };
    case 'loaded':
      return { loaded: true, data: action.payload.data };
    default:
      throw Error('Unknown action: ' + action);
  }
}
