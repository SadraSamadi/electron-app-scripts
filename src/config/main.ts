import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import {Options} from '../model';
import common from './common';
import script from './script';
import path from 'path';
import _ from 'lodash';

export default async function (options: Options): Promise<Configuration> {
  let cfg = await common(options);
  return webpackMerge(cfg, {
    context: path.resolve(options.src.main),
    output: {
      path: path.resolve(options.dist.main)
    },
    module: {
      rules: _.flatten([
        await script('main', options)
      ])
    },
    target: 'electron-main'
  });
}
