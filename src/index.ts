export * from './model';
export * from './api';

class Class {

  private field = new Map<string, any>();

  public constructor() {
    this.field.set('default', true);
  }

  public log(): void {
    console.log(this.field.size);
  }

}

let c = new Class();
c.log();
