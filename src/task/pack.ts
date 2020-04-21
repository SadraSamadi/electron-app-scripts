import {build, CliOptions} from 'electron-builder';
import {extend} from '../util';
import logger from '../logger';
import {Args} from '../model';
import path from 'path';
import _ from 'lodash';

export default async function (args: Args): Promise<void> {
  logger.info('packing...');
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
}
