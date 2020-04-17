import {Stats} from 'webpack';
import {Configurator, Options, Target} from './model';
import path from 'path';

export async function extend<T>(file: string, target: Target, config: T, options: Options): Promise<T> {
  try {
    let id = path.resolve(file);
    let configurator: Configurator<T> = await import(id);
    let override = configurator.default || select(target)({
      main: configurator.main,
      renderer: configurator.renderer
    });
    return await override(config, options.env);
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
