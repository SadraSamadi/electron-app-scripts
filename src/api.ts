import remove from './task/remove';
import serve from './task/serve';
import build from './task/build';
import pack from './task/pack';
import {Args} from './model';
import logger from './logger';
import path from 'path';
import _ from 'lodash';

export async function clean(args: Args): Promise<void> {
  logger.info('clean');
  await remove(args);
}

export async function dev(args: Args): Promise<void> {
  logger.info('development');
  await clean(args);
  await serve(args);
}

export async function prod(args: Args): Promise<void> {
  logger.info('production');
  await clean(args);
  await build(args);
  await pack(args);
}

export function resolve(args: Args): void {
  const res = file => path.resolve(file);
  const map = obj => _.mapValues(obj, res);
  _.assign(args, {
    src: map(args.src),
    dist: map(args.dist),
    externals: res(args.externals),
    babel: res(args.babel),
    typescript: res(args.typescript),
    tailwind: res(args.tailwind),
    postcss: res(args.postcss),
    webpack: res(args.webpack)
  });
}
