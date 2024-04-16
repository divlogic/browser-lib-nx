export abstract class Repository {
  public abstract initialize(): Promise<void>;
  public config: unknown;
  constructor(config: unknown): void;
  public abstract get(key: string): Promise<unknown[]>;
  public abstract getAll(): Promise<unknown[] | null>;
  public abstract set(key: string, values: unknown[]): Promise<void>;
  public abstract add(key: string, item: unknown): Promise<void>;
  public abstract remove(key: string, index: number): Promise<void>;
}
