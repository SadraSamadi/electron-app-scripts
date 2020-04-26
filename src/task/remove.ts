import async from 'async';
import fse from 'fs-extra';
import _ from 'lodash';
import logger from '../logger';
import {Args} from '../model';

export default function (args: Args): Promise<void> {
  logger.info('removing distributable...');
  let dirs = _.values(args.dist);
  return async.each(dirs, fse.remove);
}
