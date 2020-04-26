import _ from 'lodash';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import logger from '../logger';
import {Args} from '../model';
import common from './common';
import script from './script';

export default async function (args: Args): Promise<Configuration> {
  logger.info('creating main config...');
  let cfg = await common(args);
  return webpackMerge(cfg, {
    context: args.src.main,
    output: {
      path: args.dist.main
    },
    module: {
      rules: _.flatten([
        await script('main', args)
      ])
    },
    target: 'electron-main'
  });
}
