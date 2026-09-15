export interface Zone {
  getName(): string;

  getData(): Record<string, unknown>;

  tap(): void;

  viewed(): void;
}
