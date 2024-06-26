import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { StoreModel } from '../../db';

type BaseArrayGroupActions<T> = {
  type: 'loaded';
  payload: T[];
};

type BaseArrayActions<T> =
  | BaseArrayGroupActions<T>
  | {
      type: 'added' | 'removed';
      payload: T;
    };

function BaseArrayReducer<T = { id: number }>(
  data: T[],
  action: BaseArrayActions<T>,
  key = 'id' as keyof T
) {
  switch (action.type) {
    case 'added': {
      return [...data, action.payload];
    }
    case 'removed': {
      return data.filter((data) => action.payload[key] !== data[key]);
    }
    case 'loaded': {
      return action.payload;
    }
    default:
      throw Error('Unknown action: ' + action);
  }
}

function generateContext<T>() {
  const BaseArrayContext = createContext<T[]>([]);
  return BaseArrayContext;
}

export type BaseArrayDispatch<T> = Dispatch<BaseArrayActions<T>>;

export function generateBaseArrayProvider<T>(model: StoreModel<T>) {
  const ArrayContext = generateContext<T>();
  const BaseArrayDispatchContext = createContext<BaseArrayDispatch<T> | null>(
    null
  );
  return {
    provider: function BaseArrayProvider({ children }: PropsWithChildren) {
      const [items, dispatch] = useReducer(BaseArrayReducer<T>, []);

      useEffect(() => {
        model.get()?.then((models) => {
          dispatch({ type: 'loaded', payload: models || [] });
        });
      }, []);
      return (
        <ArrayContext.Provider value={items}>
          <BaseArrayDispatchContext.Provider value={dispatch}>
            {children}
          </BaseArrayDispatchContext.Provider>
        </ArrayContext.Provider>
      );
    },
    useArrayDispatch: function useArrayDispatch(): Dispatch<
      BaseArrayActions<T>
    > {
      const dispatch = useContext(BaseArrayDispatchContext);
      if (dispatch === null) {
        throw new Error('Dispatch not defined');
      }

      return dispatch;
    },
    useArrayData: function useArrayData() {
      return useContext(ArrayContext);
    },
  };
}
