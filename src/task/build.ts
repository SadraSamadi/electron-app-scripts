import webpack from 'webpack';
import {promisify} from 'util';
import config from '../config';
import {print} from './util';

export default async function (): Promise<void> {
  let renderer = await config.renderer(false);
  let main = await config.main(false);
  let compiler = webpack([renderer, main]);
  let run = compiler.run.bind(compiler);
  let stats = await promisify(run)();
  print(stats);
}
