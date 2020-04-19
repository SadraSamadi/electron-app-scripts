import {Args} from '../model';
import fse from 'fs-extra';
import async from 'async';
import _ from 'lodash';

export default function (args: Args): Promise<void> {
  let dirs = _.values(args.dist);
  return async.each(dirs, fse.remove);
}
