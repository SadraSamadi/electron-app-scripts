import {Options} from '../model';
import fse from 'fs-extra';
import async from 'async';
import path from 'path';
import _ from 'lodash';

export default function (options: Options): Promise<void> {
  let dirs = _.map(options.dist, dir => path.resolve(dir));
  return async.each(dirs, fse.remove);
}
