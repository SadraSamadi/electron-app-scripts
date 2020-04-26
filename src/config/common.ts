import fse from 'fs-extra';
import _ from 'lodash';
import TerserPlugin from 'terser-webpack-plugin';
import {Configuration, ProgressPlugin} from 'webpack';
import logger from '../logger';
import {Args} from '../model';
import {select} from '../util';

export default async function (args: Args): Promise<Configuration> {
  logger.info('creating common config...');
  let selector = select(args.env);
  return {
    entry: './',
    mode: selector({
      dev: 'development',
      prod: 'production'
    }),
    output: {
      filename: 'index.js'
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    optimization: {
      minimize: args.env === 'prod',
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        })
      ]
    },
    plugins: [
      new ProgressPlugin()
    ],
    devtool: selector<any>({
      dev: 'cheap-module-source-map',
      prod: false
    }),
    externals: await (async () => {
      try {
        logger.info('reading externals file: %s', args.externals);
        let list = await fse.readFile(args.externals, 'utf8');
        let externals = list.split(/\r?\n/);
        if (!externals)
          return null;
        let regexps = _
          .chain(externals)
          .filter()
          .map(external => new RegExp(`^${external}(\/.+)?$`))
          .value();
        logger.info('applying externals');
        return (context, request, callback) => {
          let some = regexps.some(regexp => regexp.test(request));
          if (some)
            callback(null, 'commonjs ' + request);
          else
            callback(undefined, undefined);
        };
      } catch (err) {
        logger.warn('externals file not found: %s', args.externals);
        return null;
      }
    })(),
    node: false
  };
}
