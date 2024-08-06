import {
  Dispatch,
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react';
import { StoreModel } from '../../db';
import { z } from 'zod';

type BaseArrayGroupActions<T> = {
  type: 'loaded';
  payload: T[];
};

type BaseArrayActions<T> =
  | BaseArrayGroupActions<T>
  | {
      type: 'added' | 'removed' | 'edited';
      payload: T;
    };

function BaseArrayReducer<T = { id: number }>(
  data: T[],
  action: BaseArrayActions<T>,
  key = 'id' as keyof T
) {
  const newState = [...data];
  switch (action.type) {
    case 'added': {
      return [...data, action.payload];
    }
    case 'removed': {
      return data.filter((data) => action.payload[key] !== data[key]);
    }
    case 'edited': {
      return newState.map((item: T) => {
        if (item[key] === action.payload[key]) {
          item = action.payload;
        }
        return item;
      });
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

export function generateBaseArrayProvider<
  T extends { [key: string]: unknown; id: number },
  Schema extends z.ZodTypeAny
>(model: StoreModel<T>, schema: Schema) {
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
      /**
       * TODO:
       * look into a way to minimize these function calls.
       * It seems like dispatch should be able to either be defined
       * or referenced in a way that doesn't add overhead.
       *
       * Or don't and not worry about the performance, that probably works fine too.
       */
      const dispatch = useContext(BaseArrayDispatchContext);
      if (dispatch === null) {
        throw new Error('Dispatch not defined');
      }

      return dispatch;
    },
    useArrayData: function useArrayData() {
      return useContext(ArrayContext);
    },
    useModelActions: () => {
      const dispatch = useContext(BaseArrayDispatchContext);
      if (dispatch === null) {
        throw new Error('Dispatch not defined');
      }
      return {
        add: async function add(data: Omit<T, 'id'>) {
          const id = (await model.add(data)) as number;
          const payload = schema.parse({ id: id, ...data });
          dispatch({ type: 'added', payload });
          return id;
        },
        remove: async (data: T) => {
          await model.remove(data.id);
          dispatch({ type: 'removed', payload: data });
        },
        edit: async (data: T) => {
          await model.update(data);
          dispatch({ type: 'edited', payload: data });
        },
        load: async () => {
          const items = await model.get();
          dispatch({ type: 'loaded', payload: items || [] });
        },
      };
    },
  };
}
