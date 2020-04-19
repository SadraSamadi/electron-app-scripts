import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import {select} from '../util';
import common from './common';
import script from './script';
import {Args} from '../model';
import style from './style';
import _ from 'lodash';

export default async function (args: Args): Promise<Configuration> {
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
