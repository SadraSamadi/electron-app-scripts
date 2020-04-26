import HtmlWebpackPlugin from 'html-webpack-plugin';
import _ from 'lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import logger from '../logger';
import {Args} from '../model';
import {select} from '../util';
import common from './common';
import script from './script';
import style from './style';

export default async function (args: Args): Promise<Configuration> {
  logger.info('creating main config...');
  let cfg = await common(args);
  return webpackMerge(cfg, {
    context: args.src.renderer,
    output: {
      path: args.dist.renderer
    },
    module: {
      rules: _.flatten([
        await script('renderer', args),
        await style(args),
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
        minify: select(args.env)<any>({
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
