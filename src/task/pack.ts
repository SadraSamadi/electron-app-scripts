import {Args} from '../model';

export default async function (args: Args): Promise<void> {
  console.log(args.out);
}
