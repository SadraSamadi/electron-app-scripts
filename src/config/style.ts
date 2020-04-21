import {RuleSetRule} from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import {extend, select} from '../util';
import {Args} from '../model';
import async from 'async';
import _ from 'lodash';

export default async function (args: Args): Promise<RuleSetRule[]> {
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
          options: await extend(args.postcss, 'renderer', {
            plugins: await (async () => {
              let plugins = await async.map<[string, any?], any[]>([
                ['tailwindcss', await extend(args.tailwind, 'renderer', {}, args)],
                ['postcss-preset-env']
              ], async ([id, opts]) => {
                try {
                  let plugin = await import(id);
                  return plugin.default(opts);
                } catch (err) {
                  return null;
                }
              });
              return _.filter(plugins);
            })(),
            sourceMap: true
          }, args)
        }
      ]
    }
  ];
}
