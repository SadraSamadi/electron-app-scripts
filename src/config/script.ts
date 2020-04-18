import {RuleSetRule} from 'webpack';
import {extend, select} from '../util';
import {Options, Target} from '../model';
import async from 'async';
import path from 'path';
import _ from 'lodash';

export default async function (target: Target, options: Options): Promise<RuleSetRule[]> {
  let rules = await async.map<Type, RuleSetRule[]>(['js', 'ts'], async type => {
    let typeSelector = select(type);
    let targetSelector = select(target);
    return _.map([
      {
        enforce: 'pre',
        loader: 'eslint-loader',
        options: await extend(options.config.eslint, target, {
          extends: 'eslint:recommended'
        }, options)
      },
      {
        loader: typeSelector({
          js: 'babel-loader',
          ts: 'ts-loader'
        }),
        options: typeSelector<any>({
          js: await extend(options.config.babel, target, {
            sourceMaps: true,
            presets: _.filter([
              ['@babel/env', {
                useBuiltIns: 'usage',
                corejs: 3
              }],
              target === 'renderer' && ['@babel/preset-react', {
                development: options.env === 'dev'
              }]
            ]),
            plugins: [
              ['@babel/plugin-transform-runtime']
            ]
          }, options),
          ts: {
            configFile: path.resolve(options.config.typescript)
          }
        })
      }
    ], rule => _.assign({}, rule, {
      test: typeSelector({
        js: targetSelector({
          main: /\.js$/,
          renderer: /\.jsx?$/
        }),
        ts: targetSelector({
          main: /\.ts$/,
          renderer: /\.tsx?$/
        })
      }),
      include: targetSelector({
        main: path.resolve(options.src.main),
        renderer: path.resolve(options.src.renderer)
      }),
      exclude: /node_modules/
    }));
  });
  return _.flatten(rules);
}

type Type = 'js' | 'ts';
