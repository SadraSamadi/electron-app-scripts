import {Configuration} from 'webpack';
import {Args, Target} from '../model';
import {extend, select} from '../util';
import renderer from './renderer';
import main from './main';

export default async function (target: Target, args: Args): Promise<Configuration> {
  let config = select(target)({
    main: await main(args),
    renderer: await renderer(args)
  });
  return await extend(args.config.webpack, target, config, args);
}
