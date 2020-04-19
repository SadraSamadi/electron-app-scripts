import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {ChildProcess} from 'child_process';
import treeKill from 'tree-kill';
import exitHook from 'exit-hook';
import spawn from 'cross-spawn';
import {promisify} from 'util';
import config from '../config';
import logger from '../logger';
import {print} from '../util';
import {Args} from '../model';

let server: WebpackDevServer = null;
let watching: Compiler.Watching = null;
let child: ChildProcess = null;
let unsubscribe: Function = null;

export default async function (args: Args): Promise<void> {
  server = await renderer(args);
  watching = await main(args);
  unsubscribe = exitHook(quit);
}

async function renderer(args: Args): Promise<WebpackDevServer> {
  let cfg = await config('renderer', args);
  let compiler = webpack(cfg);
  let wds = new WebpackDevServer(compiler);
  let listen = wds.listen.bind(wds);
  await promisify<number, string>(listen)(args.port, args.host);
  return wds;
}

async function main(args: Args): Promise<Compiler.Watching> {
  let cfg = await config('main', args);
  let compiler = webpack(cfg);
  return compiler.watch({}, async (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    print(stats);
    await stop();
    await start(args);
  });
}

async function start(args: Args): Promise<void> {
  let entry = require.resolve(args.dist.main);
  let electron = await import(args.electron);
  child = spawn(electron.default, [entry], {
    stdio: 'inherit',
    env: {
      HOST: args.host,
      PORT: String(args.port)
    }
  });
  child.on('close', quit);
}

async function stop(): Promise<void> {
  if (!child)
    return;
  child.off('close', quit);
  try {
    let kill = promisify(treeKill);
    await kill(child.pid);
  } catch (err) {
    console.warn(err);
  }
  child = null;
}

async function quit(): Promise<void> {
  if (unsubscribe)
    unsubscribe();
  await stop();
  if (watching) {
    let close = watching.close.bind(watching);
    await promisify(close)();
  }
  if (watching) {
    let close = server.close.bind(server);
    await promisify(close)();
  }
  logger.info('quit');
  process.exit();
}
