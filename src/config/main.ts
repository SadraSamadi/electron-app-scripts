import {Configuration} from 'webpack';
import {Environment, Options} from '../model';
import {DIST_MAIN, SRC_MAIN} from '../paths';
import webpackMerge from 'webpack-merge';
import common from './common';
import script from './script';

export default async function (env: Environment, options: Options): Promise<Configuration> {
  let cfg = await common(env, options);
  return webpackMerge(cfg, {
    context: SRC_MAIN,
    output: {
      path: DIST_MAIN
    },
    module: {
      rules: [
        ...await script('main', env)
      ]
    },
    target: 'electron-main'
  });
}
