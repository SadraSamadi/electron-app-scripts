import {Configuration, ExternalsElement, ProgressPlugin} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import {Environment, Options} from '../model';
import {PACKAGE} from '../paths';
import {select} from '../util';
import fse from 'fs-extra';

export default async function (env: Environment, options: Options): Promise<Configuration> {
  let selector = select(env);
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
      minimize: env === 'prod',
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
      dev: 'cheap-module-source-map',
      prod: 'source-map'
    }),
    externals: await externals(),
    node: false
  };
}

async function externals(): Promise<ExternalsElement> {
  let pkg = await fse.readJSON(PACKAGE);
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
}
