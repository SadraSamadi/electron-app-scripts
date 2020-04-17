import {Configuration, ProgressPlugin} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import {Options} from '../model';
import {select} from '../util';
import fse from 'fs-extra';
import path from 'path';

export default async function (options: Options): Promise<Configuration> {
  let selector = select(options.env);
  return {
    entry: './',
    mode: selector({
      dev: 'development',
      prod: 'none'
    }),
    output: {
      filename: 'index.js'
    },
    resolve: {
      extensions: ['.js', '.ts']
    },
    optimization: {
      minimize: options.env === 'prod',
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
      let file = path.resolve('package.json');
      let pkg = await fse.readJSON(file);
      if (!pkg.externals)
        return;
      let exts = pkg.externals.map(dep => new RegExp(`^${dep}(\/.+)?$`));
      return (context, request, callback) => {
        let some = exts.some(ext => ext.test(request));
        if (some)
          callback(null, 'commonjs ' + request);
        else
          callback(undefined, undefined);
      };
    })(),
    node: false
  };
}
