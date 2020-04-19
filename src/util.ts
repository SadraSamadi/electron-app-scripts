import {Stats} from 'webpack';
import {Args, Configurator, Target} from './model';

export async function extend<T>(file: string, target: Target, config: T, args: Args): Promise<T> {
  try {
    let {default: configurator}: { default: Configurator<T> } = await import(file);
    let override = typeof configurator === 'function' ? configurator : select(target)({
      main: configurator.main,
      renderer: configurator.renderer
    });
    return await override(config, args.env);
  } catch (err) {
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
