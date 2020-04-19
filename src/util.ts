import {Stats} from 'webpack';
import {Configurator, Args, Target} from './model';

export async function extend<T>(file: string, target: Target, config: T, args: Args): Promise<T> {
  try {
    let configurator: Configurator<T> = await import(file);
    let override = configurator.default || select(target)({
      main: configurator.main,
      renderer: configurator.renderer
    });
    return await override(config, args.env);
  } catch (e) {
    return config;
  }
}

export function select<K extends PropertyKey>(k: K): <T>(m: { [k in K | 'default']?: T }) => T {
  return m => {
    if (k in m)
      return m[k];
    return m.default;
  };
}

export function print(stats: Stats): void {
  let str = stats.toString({colors: true});
  console.log(str);
}
