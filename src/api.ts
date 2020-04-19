import remove from './task/remove';
import serve from './task/serve';
import build from './task/build';
import pack from './task/pack';
import {Command, Args} from './model';
import logger from './logger';
import path from 'path';
import _ from 'lodash';

export default async function (command: Command, args: Args): Promise<void> {
  args = resolve(args);
  switch (command) {
    case 'clean':
      await clean(args);
      break;
    case 'dev':
      await dev(args);
      break;
    case 'prod':
      await prod(args);
      break;
    default:
      logger.error('command not found: %s', command);
  }
}

async function clean(args: Args): Promise<void> {
  logger.info('clean');
  await remove(args);
}

async function dev(args: Args): Promise<void> {
  logger.info('development');
  await clean(args);
  await serve(args);
}

async function prod(args: Args): Promise<void> {
  logger.info('production');
  await clean(args);
  await build(args);
  await pack(args);
}

function resolve(args: Args): Args {
  const res = file => path.resolve(file);
  const map = obj => _.mapValues(obj, res);
  return _.assign({}, args, {
    src: map(args.src),
    dist: map(args.dist),
    out: res(args.out),
    externals: res(args.externals),
    config: map(args.config)
  });
}
