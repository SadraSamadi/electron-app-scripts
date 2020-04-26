import {Stats} from 'webpack';
import logger from './logger';
import {Configurator, Environment, Target} from './model';

export async function extend<T>(file: string, config: T, env: Environment, target?: Target): Promise<T> {
  try {
    let {default: configurator}: { default: Configurator<T> } = await import(file);
    logger.info('extending config [env: %s] [target: %s]', env, target);
    logger.info('from: %s', file);
    let extender = typeof configurator === 'function' ? configurator : select(target)({
      main: configurator.main,
      renderer: configurator.renderer,
      default: configurator
    });
    return await extender(config, env);
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

function* f() {
  for (let i = 0; i < 10; i++)
    console.log(yield i);
}

for (let i of f())
  console.log(i);
