import {Configuration} from 'webpack';
import {Args, Target} from '../model';
import {extend, select} from '../util';
import renderer from './renderer';
import logger from '../logger';
import main from './main';

export default async function (target: Target, args: Args): Promise<Configuration> {
  logger.info('creating config for: %s', target);
  let config = await select(target)({main, renderer})(args);
  return await extend(args.webpack, config, args.env, target);
}
