import {RuleSetRule} from 'webpack';
import {extend, select} from '../util';
import {Args, Target} from '../model';
import _ from 'lodash';

export default async function (target: Target, args: Args): Promise<RuleSetRule[]> {
  let selector = select(target);
  return [
    {
      test: selector({
        main: /\.[jt]s$/,
        renderer: /\.[jt]sx?$/
      }),
      include: selector({
        main: args.src.main,
        renderer: args.src.renderer
      }),
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: await extend(args.babel, target, {
        presets: _.filter([
          ['@babel/env', {
            useBuiltIns: 'usage',
            corejs: 3
          }],
          target === 'renderer' && ['@babel/preset-react', {
            development: args.env === 'dev'
          }],
          ['@babel/preset-typescript']
        ]),
        plugins: [
          ['babel-plugin-transform-typescript-metadata'],
          ['@babel/plugin-proposal-decorators', {
            legacy: true
          }],
          ['@babel/plugin-proposal-class-properties', {
            loose: true
          }],
          ['@babel/plugin-transform-runtime']
        ],
        inputSourceMap: true,
        sourceMaps: true
      }, args)
    }
  ];
}
