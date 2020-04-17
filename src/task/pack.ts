import {Options} from '../model';
import path from 'path';

export default async function (options: Options): Promise<void> {
  let out = path.resolve(options.out);
  console.log(out);
}
