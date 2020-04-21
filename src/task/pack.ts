import {build, CliOptions} from 'electron-builder';
import {extend} from '../util';
import {Args} from '../model';

export default async function (args: Args): Promise<void> {
  let config = await extend<CliOptions>(args.pack, {
    config: {
      directories: {
        buildResources: args.res,
        output: args.dist.out
      },
      files: [
        args.dist.main,
        args.dist.renderer
      ]
    }
  }, args.env);
  await build(config);
}
