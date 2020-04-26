import async from 'async';
import _ from 'lodash';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {RuleSetRule} from 'webpack';
import logger from '../logger';
import {Args} from '../model';
import {extend, select} from '../util';

export default async function (args: Args): Promise<RuleSetRule[]> {
  logger.info('creating style config...');
  return [
    {
      test: /\.css$/,
      use: [
        select(args.env)({
          dev: 'style-loader',
          prod: MiniCssExtractPlugin.loader
        }),
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: await extend(args.postcss, {
            plugins: await (async () => {
              logger.info('adding postcss plugins...');
              let plugins = await async.map<[string, any?], any[]>([
                ['tailwindcss', await extend(args.tailwind, {}, args.env, 'renderer')],
                ['postcss-preset-env']
              ], async ([id, opts]) => {
                try {
                  logger.info('adding postcss plugin: %s', id);
                  let plugin = await import(id);
                  return plugin.default(opts);
                } catch (err) {
                  logger.warn('postcss plugin not found: %s', id);
                  return null;
                }
              });
              return _.filter(plugins);
            })(),
            sourceMap: true
          }, args.env, 'renderer')
        }
      ]
    }
  ];
}
