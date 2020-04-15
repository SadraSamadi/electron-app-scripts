import {RuleSetRule} from 'webpack';
import {Environment, Target} from '../model';
import {resolve, select} from '../util';
import * as paths from '../paths';

export default async function (target: Target, env: Environment): Promise<RuleSetRule[]> {
  let selector = select(target);
  let include = selector({
    main: paths.SRC_MAIN,
    renderer: paths.SRC_RENDERER
  });
  let exclude = /node_modules/;
  let presets = [
    ['@babel/env', {
      useBuiltIns: 'usage',
      corejs: 3
    }],
    target === 'renderer' && ['@babel/preset-react', {
      development: env === 'dev'
    }]
  ];
  return [
    {
      include,
      exclude,
      test: selector({
        main: /\.js$/,
        renderer: /\.jsx?$/
      }),
      loader: resolve('babel-loader'),
      options: {
        presets: presets.filter(Boolean),
        plugins: [
          ['@babel/plugin-transform-runtime']
        ]
      }
    },
    {
      include,
      exclude,
      test: selector({
        main: /\.ts$/,
        renderer: /\.tsx?$/
      }),
      loader: resolve('ts-loader'),
      options: {
        configFile: selector({
          main: paths.SRC_MAIN_TSCONFIG,
          renderer: paths.SRC_RENDERER_TSCONFIG
        })
      }
    }
  ];
}
