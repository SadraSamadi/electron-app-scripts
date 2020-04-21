export type Target = 'main' | 'renderer';

export type Environment = 'dev' | 'prod';

export type Configurator<T = any> = Extender<T> & {

  main?: Extender<T>;

  renderer?: Extender<T>;

};

export interface Extender<T = any> {

  (config?: T, env?: Environment): T | Promise<T>;

}

export interface Args {

  env?: Environment;

  electron?: string;

  src?: {

    main?: string;

    renderer?: string;

  };

  dist?: {

    main?: string;

    renderer?: string;

    out?: string;

  };

  externals?: string;

  babel?: string;

  typescript?: string;

  tailwind?: string;

  postcss?: string;

  webpack?: string;

  noBuild?: boolean;

  noPack?: boolean;

  pack?: string;

  res?: string;

  host?: string;

  port?: number;

  verbose?: boolean;

}
