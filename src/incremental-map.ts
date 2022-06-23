export class IncrementalMap<Key, Value> {
  private states: Map<number, Map<Key, Value>> = new Map().set(0, new Map());
  private index = 0;

  public snapshot(index: number): void {
    if (!this.states.has(index)) {
      this.states.set(index, new Map());
    }

    this.index = index;
  }

  public set(key: Key, value: Value): this {
    this.states.get(this.index)!.set(key, value);

    return this;
  }

  public get(key: Key): Value | undefined {
    return this.states.get(this.index)!.get(key);
  }
}
