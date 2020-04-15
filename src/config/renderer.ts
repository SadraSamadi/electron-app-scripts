import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import {DIST_RENDERER, SRC_RENDERER} from '../paths';
import {Environment, Options} from '../model';
import {resolve, select} from '../util';
import common from './common';
import script from './script';
import style from './style';

export default async function (env: Environment, options: Options): Promise<Configuration> {
  let cfg = await common(env, options);
  return webpackMerge(cfg, {
    context: SRC_RENDERER,
    output: {
      path: DIST_RENDERER
    },
    module: {
      rules: [
        ...await script('renderer', env),
        ...await style(env),
        {
          test: /\.(png|jpe?g)$/,
          loader: resolve('file-loader'),
          options: {
            outputPath: 'assets'
          }
        }
      ]
    },
    resolve: {
      extensions: ['.jsx', '.tsx']
    },
    optimization: {
      minimizer: [
        new OptimizeCssAssetsPlugin({
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true
            }
          }
        })
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: 'index.html',
        minify: select(env)<any>({
          dev: false,
          prod: {
            collapseWhitespace: true
          }
        })
      }),
      new MiniCssExtractPlugin({
        filename: 'index.css'
      })
    ],
    target: 'electron-renderer'
  });
}
