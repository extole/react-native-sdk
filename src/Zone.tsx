export interface Zone {
  getName(): string;

  getData(): Record<string, any>;

  tap(): void;

  viewed(): void;
}
