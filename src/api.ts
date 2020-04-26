import _ from 'lodash';
import path from 'path';
import logger from './logger';
import {Args} from './model';
import build from './task/build';
import pack from './task/pack';
import remove from './task/remove';
import serve from './task/serve';

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
  if (!args.noBuild)
    await build(args);
  if (!args.noPack)
    await pack(args);
}

export function prepare(args: Args) {
  logger.silent = !args.verbose;
  logger.info('preparing...');
  resolve(args);
}

export function resolve(args: Args): void {
  logger.info('resolving paths...');
  const res = file => file && path.resolve(file);
  const map = obj => _.mapValues(obj, res);
  _.assign<Args, Args>(args, {
    src: map(args.src),
    dist: map(args.dist),
    externals: res(args.externals),
    babel: res(args.babel),
    typescript: res(args.typescript),
    tailwind: res(args.tailwind),
    postcss: res(args.postcss),
    webpack: res(args.webpack),
    pack: res(args.pack),
    res: res(args.res)
  });
}
