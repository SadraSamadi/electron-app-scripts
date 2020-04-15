import remove from './task/remove';
import serve from './task/serve';
import build from './task/build';
import pack from './task/pack';
import {Options} from './model';
import logger from './logger';

export async function clean(): Promise<void> {
  logger.info('Starting clean');
  logger.info('Starting remove');
  await remove();
  logger.info('Finished remove');
  logger.info('Finished clean');
}

export async function dev(options: Options): Promise<void> {
  logger.info('Starting dev');
  await clean();
  logger.info('Starting serve');
  await serve(options);
  logger.info('Finished serve');
  logger.info('Waiting dev');
}

export async function prod(options: Options): Promise<void> {
  logger.info('Starting prod');
  await clean();
  logger.info('Finished build');
  await build(options);
  logger.info('Starting build');
  logger.info('Finished pack');
  await pack(options);
  logger.info('Finished pack');
  logger.info('Finished prod');
}
