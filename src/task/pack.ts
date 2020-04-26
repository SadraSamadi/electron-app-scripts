import {build, CliOptions} from 'electron-builder';
import _ from 'lodash';
import path from 'path';
import logger from '../logger';
import {Args} from '../model';
import {extend} from '../util';

export default async function (args: Args): Promise<void> {
  logger.info('start packing...');
  let cwd = process.cwd();
  let config = await extend<CliOptions>(args.pack, {
    config: {
      directories: {
        buildResources: args.res,
        output: args.dist.out
      },
      files: _.map([
        args.dist.main,
        args.dist.renderer
      ], abs => path.relative(cwd, abs))
    }
  }, args.env);
  await build(config);
  logger.info('packing finished');
}
