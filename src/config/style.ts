import {RuleSetRule} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {load, resolve, select} from '../util';
import {Environment} from '../model';

export default async function (env: Environment): Promise<RuleSetRule[]> {
  let plugins = [
    await add('tailwindcss'),
    await add('postcss-preset-env')
  ];
  return [
    {
      test: /\.css$/,
      use: [
        select(env)({
          dev: resolve('style-loader'),
          prod: MiniCssExtractPlugin.loader
        }),
        {
          loader: resolve('css-loader'),
          options: {
            importLoaders: 1,
            sourceMap: true
          }
        },
        {
          loader: resolve('postcss-loader'),
          options: {
            plugins: plugins.filter(Boolean),
            sourceMap: true
          }
        }
      ]
    }
  ];
}

async function add(id: string, options?: any): Promise<any> {
  let plugin = await load(id);
  return plugin && plugin.default(options);
}
