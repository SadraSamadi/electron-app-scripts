import remove from './task/remove';
import serve from './task/serve';
import build from './task/build';
import pack from './task/pack';
import {Options} from './model';
import logger from './logger';

export async function clean(options: Options): Promise<void> {
  logger.info('clean');
  await remove(options);
}

export async function dev(options: Options): Promise<void> {
  logger.info('development');
  await clean(options);
  await serve(options);
}

export async function prod(options: Options): Promise<void> {
  logger.info('production');
  await clean(options);
  await build(options);
  await pack(options);
}
