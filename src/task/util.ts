import {Stats} from 'webpack';
import {DIST} from '../paths';
import fse from 'fs-extra';

export function clean(): Promise<void> {
  return fse.remove(DIST);
}

export function print(stats: Stats): void {
  let str = stats.toString({colors: true});
  console.log(str);
}
