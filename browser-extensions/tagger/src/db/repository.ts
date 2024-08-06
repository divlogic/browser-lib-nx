export abstract class Repository {
  public abstract initialize(): Promise<void>;
  public config: unknown;
  constructor(config?: unknown);
  constructor(config: unknown = {}) {
    this.config = config;
  }
  public abstract get<T>(key: string): Promise<T[] | null>;
  public abstract getAll(key?: string): Promise<unknown[] | null>;
  public abstract add(key: string, item: unknown): Promise<string | number>;
  public abstract update<T>(key: string, item: T): Promise<unknown>;
  public abstract remove(key: string, index: number): Promise<void>;
  public abstract set<T>(key: string, values: T[]): Promise<unknown>;
}
