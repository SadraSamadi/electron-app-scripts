import webpack from 'webpack';
import {promisify} from 'util';
import config from '../config';
import {print} from '../util';
import {Args} from '../model';

export default async function (args: Args): Promise<void> {
  let renderer = await config('renderer', args);
  let main = await config('main', args);
  let compiler = webpack([renderer, main]);
  let run = compiler.run.bind(compiler);
  let stats = await promisify(run)();
  print(stats);
}
