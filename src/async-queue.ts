export class AsyncQueue {
  public jobs: Array<() => any | Promise<any>> = [];
  public isWorking: boolean;

  public async add(func: () => any | Promise<any>): Promise<void> {
    this.jobs.push(func);
    this.handler();
  }

  private async handler(): Promise<void> {
    if (this.isWorking) return;
    if (!this.jobs.length) return;

    this.isWorking = true;
    try {
      await this.jobs.shift()!();
    } catch (e) {
      console.log(e);
    }

    this.isWorking = false;

    this.handler();
  }
}
