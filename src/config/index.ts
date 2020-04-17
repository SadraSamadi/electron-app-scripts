import {Configuration} from 'webpack';
import {Options, Target} from '../model';
import {extend, select} from '../util';
import renderer from './renderer';
import main from './main';

export default async function (target: Target, options: Options): Promise<Configuration> {
  let config = select(target)({
    main: await main(options),
    renderer: await renderer(options)
  });
  return await extend(options.config.webpack, target, config, options);
}
