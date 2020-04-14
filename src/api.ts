import {clean} from './task/util';
import serve, {Options} from './task/serve';
import build from './task/build';
import pack from './task/pack';
import logger from './logger';

export async function dev(options: Options): Promise<void> {
  logger.info('Starting dev');
  logger.info('Starting clean');
  await clean();
  logger.info('Finished clean');
  logger.info('Starting serve');
  await serve(options);
  logger.info('Finished serve');
  logger.info('Waiting dev');
}

export async function prod(): Promise<void> {
  logger.info('Starting prod');
  logger.info('Starting clean');
  await clean();
  logger.info('Starting clean');
  logger.info('Finished build');
  await build();
  logger.info('Starting build');
  logger.info('Finished pack');
  await pack();
  logger.info('Finished pack');
  logger.info('Finished prod');
}
