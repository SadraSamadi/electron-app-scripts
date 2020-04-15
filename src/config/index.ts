import {Configuration} from 'webpack';
import {Environment, Options, Target} from '../model';
import {load, select} from '../util';
import {resolve} from 'path';
import renderer from './renderer';
import main from './main';

export default async function (target: Target, env: Environment, options: Options): Promise<Configuration> {
  let config = select(target)({
    main: await main(env, options),
    renderer: await renderer(env, options)
  });
  try {
    let path = resolve(options.config);
    let override = await load(path);
    return override[target](config, env);
  } catch (e) {
    return config;
  }
}
