import {Stats} from 'webpack';

export function resolve(id: string): string {
  try {
    return require.resolve(id);
  } catch (e) {
    return null;
  }
}

export async function load<T = any>(id: string): Promise<T> {
  try {
    return await import(id);
  } catch (e) {
    return null;
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
