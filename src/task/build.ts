import webpack from 'webpack';
import {promisify} from 'util';
import {Options} from '../model';
import config from '../config';
import {print} from '../util';

export default async function (options: Options): Promise<void> {
  let renderer = await config('renderer', 'prod', options);
  let main = await config('main', 'prod', options);
  let compiler = webpack([renderer, main]);
  let run = compiler.run.bind(compiler);
  let stats = await promisify(run)();
  print(stats);
}
