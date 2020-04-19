import {Configuration, ProgressPlugin} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import {select} from '../util';
import {Args} from '../model';
import fse from 'fs-extra';
import _ from 'lodash';

export default async function (args: Args): Promise<Configuration> {
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
    devtool: selector({
      dev: 'eval',
      prod: 'source-map'
    }),
    externals: await (async () => {
      try {
        let list = await fse.readFile(args.externals, 'utf8');
        let externals = list.split(/\r?\n/);
        if (!externals)
          return null;
        let regexps = _
          .chain(externals)
          .filter()
          .map(external => new RegExp(`^${external}(\/.+)?$`))
          .value();
        return (context, request, callback) => {
          let some = regexps.some(regexp => regexp.test(request));
          if (some)
            callback(null, 'commonjs ' + request);
          else
            callback(undefined, undefined);
        };
      } catch (e) {
        return null;
      }
    })(),
    node: false
  };
}
