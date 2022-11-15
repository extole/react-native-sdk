export class Zone {
  name: string;
  data: Record<string, string>;

  constructor(name: string, data: Record<string, string>) {
    this.name = name;
    this.data = data;
  }
}
