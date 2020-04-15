export type Environment = 'dev' | 'prod';

export type Target = 'main' | 'renderer';

export interface Options {

  config?: string;

  host?: string;

  port?: number;

}
