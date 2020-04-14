import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import {DIST_MAIN, SRC_MAIN} from '../paths';
import common from './common';

export default async function (dev: boolean): Promise<Configuration> {
  let cfg = await common(dev);
  return webpackMerge(cfg, {
    context: SRC_MAIN,
    output: {
      path: DIST_MAIN
    },
    target: 'electron-main'
  });
}
