import {Configuration} from 'webpack';
import webpackMerge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import {DIST_RENDERER, SRC_RENDERER} from '../paths';
import common from './common';

export default async function (dev: boolean): Promise<Configuration> {
  let cfg = await common(dev);
  return webpackMerge(cfg, {
    context: SRC_RENDERER,
    output: {
      path: DIST_RENDERER
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            dev ? require.resolve('style-loader') : MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                sourceMap: true
              }
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                plugins: await plugins(),
                sourceMap: true
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g)$/,
          loader: require.resolve('file-loader'),
          options: {
            outputPath: 'assets'
          }
        }
      ]
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
        minify: dev ? false : {
          collapseWhitespace: true
        }
      }),
      new MiniCssExtractPlugin({
        filename: 'index.css'
      })
    ],
    target: 'electron-renderer'
  });
}

async function plugins(): Promise<any[]> {
  let list = [
    await load('tailwindcss'),
    await load('postcss-preset-env')
  ];
  return list.filter(Boolean);
}

async function load(name: string, options?: any): Promise<any> {
  try {
    let plugin = await import(name);
    return plugin.default(options);
  } catch (e) {
    return null;
  }
}
