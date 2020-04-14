import {Configuration, ExternalsElement, ProgressPlugin} from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import {PACKAGE} from '../paths';
import fse from 'fs-extra';

export default async function (dev: boolean): Promise<Configuration> {
  return {
    entry: './',
    mode: dev ? 'development' : 'production',
    output: {
      filename: 'index.js'
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: require.resolve('ts-loader')
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx']
    },
    optimization: {
      minimize: !dev,
      minimizer: [
        new TerserPlugin({
          sourceMap: true
        })
      ]
    },
    plugins: [
      new ProgressPlugin()
    ],
    devtool: dev ? 'eval' : 'source-map',
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
