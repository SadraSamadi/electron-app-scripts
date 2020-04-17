import webpack from 'webpack';
import {promisify, inspect} from 'util';
import {Options} from '../model';
import config from '../config';
import {print} from '../util';
import _ from 'lodash';

export default async function (options: Options): Promise<void> {
  let renderer = await config('renderer', options);
  let main = await config('main', options);
  console.log(options);
  console.log(_.repeat('=', 120));
  console.log(inspect(main, true, 10, true));
  console.log(_.repeat('=', 120));
  console.log(inspect(renderer, true, 10, true));
  process.exit();
  let compiler = webpack([renderer, main]);
  let run = compiler.run.bind(compiler);
  let stats = await promisify(run)();
  print(stats);
}
