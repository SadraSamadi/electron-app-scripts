export type Target = 'main' | 'renderer';

export type Environment = 'dev' | 'prod';

export interface Configurator<T = any> {

  default?: Override<T>;

  main?: Override<T>;

  renderer?: Override<T>;

}

export interface Override<T = any> {

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

  host?: string;

  port?: number;

}
