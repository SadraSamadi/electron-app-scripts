import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import {Options} from '../model';
import {select} from '../util';
import common from './common';
import script from './script';
import style from './style';
import path from 'path';
import _ from 'lodash';

export default async function (options: Options): Promise<Configuration> {
  let cfg = await common(options);
  return webpackMerge(cfg, {
    context: path.resolve(options.src.renderer),
    output: {
      path: path.resolve(options.dist.renderer)
    },
    module: {
      rules: _.flatten([
        await script('renderer', options),
        await style(options),
        {
          test: /\.(png|jpe?g)$/,
          loader: 'file-loader',
          options: {
            outputPath: 'assets'
          }
        }
      ])
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
        minify: select(options.env)<any>({
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
