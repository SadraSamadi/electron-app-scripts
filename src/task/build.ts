import {promisify} from 'util';
import webpack from 'webpack';
import config from '../config';
import logger from '../logger';
import {Args} from '../model';
import {print} from '../util';

export default async function (args: Args): Promise<void> {
  logger.info('webpack building...');
  let renderer = await config('renderer', args);
  let main = await config('main', args);
  logger.info('starting webpack compiler...');
  let compiler = webpack([renderer, main]);
  let run = compiler.run.bind(compiler);
  let stats = await promisify(run)();
  print(stats);
}
