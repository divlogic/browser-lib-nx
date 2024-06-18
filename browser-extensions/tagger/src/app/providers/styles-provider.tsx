import { HighlightStyle } from '../../schemas';
import { Dispatch, PropsWithChildren, createContext, useReducer } from 'react';

export const StylesContext = createContext<HighlightStyle[]>([]);
export const StylesDispatchContext =
  createContext<Dispatch<StylesActions> | null>(null);

export function StylesProvider({ children }: PropsWithChildren) {
  const [styles, dispatch] = useReducer(stylesReducer, []);
  return (
    <StylesContext.Provider value={styles}>
      <StylesDispatchContext.Provider value={dispatch}>
        {children}
      </StylesDispatchContext.Provider>
    </StylesContext.Provider>
  );
}

export type StylesActions = {
  type: 'added' | 'removed';
  payload: HighlightStyle;
};

function stylesReducer(
  styles: HighlightStyle[],
  action: StylesActions
): HighlightStyle[] {
  switch (action.type) {
    case 'added': {
      return [...styles, action.payload];
    }
    case 'removed': {
      return styles.filter((style) => action.payload.name !== style.name);
    }
  }
}
