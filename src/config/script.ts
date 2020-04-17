import {RuleSetRule} from 'webpack';
import {extend, select} from '../util';
import {Options, Target} from '../model';
import path from 'path';
import _ from 'lodash';

export default async function (target: Target, options: Options): Promise<RuleSetRule[]> {
  let selector = select(target);
  let include = selector({
    main: path.resolve(options.src.main),
    renderer: path.resolve(options.src.renderer)
  });
  let exclude = /node_modules/;
  return [
    {
      include,
      exclude,
      enforce: 'pre',
      test: selector({
        main: /\.js$/,
        renderer: /\.jsx?$/
      }),
      loader: 'eslint-loader',
      options: await extend(options.config.eslint, target, {}, options)
    },
    {
      include,
      exclude,
      test: selector({
        main: /\.js$/,
        renderer: /\.jsx?$/
      }),
      loader: 'babel-loader',
      options: await (async () => {
        let babel = selector({
          main: options.config.babel,
          renderer: options.config.babel
        });
        return await extend(babel, target, {
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
        }, options);
      })()
    },
    {
      include,
      exclude,
      enforce: 'pre',
      test: selector({
        main: /\.ts$/,
        renderer: /\.tsx?$/
      }),
      loader: 'eslint-loader',
      options: await extend(options.config.eslint, target, {}, options)
    },
    {
      include,
      exclude,
      test: selector({
        main: /\.ts$/,
        renderer: /\.tsx?$/
      }),
      loader: 'ts-loader'
    }
  ];
}
