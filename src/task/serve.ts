import {ChildProcess} from 'child_process';
import spawn from 'cross-spawn';
import exitHook from 'exit-hook';
import treeKill from 'tree-kill';
import {promisify} from 'util';
import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import config from '../config';
import logger from '../logger';
import {Args} from '../model';
import {print} from '../util';

let server: WebpackDevServer = null;
let watching: Compiler.Watching = null;
let child: ChildProcess = null;
let unsubscribe: Function = null;

export default async function (args: Args): Promise<void> {
  logger.info('serving...');
  server = await renderer(args);
  watching = await main(args);
  unsubscribe = exitHook(quit);
}

async function renderer(args: Args): Promise<WebpackDevServer> {
  logger.info('starting renderer...');
  let cfg = await config('renderer', args);
  let compiler = webpack(cfg);
  let wds = new WebpackDevServer(compiler);
  let listen = wds.listen.bind(wds);
  logger.info('starting dev server...');
  await promisify(listen)(args.port, args.host);
  logger.info('dev server started: %s:%d', args.host, args.port);
  return wds;
}

async function main(args: Args): Promise<Compiler.Watching> {
  logger.info('starting main...');
  let cfg = await config('main', args);
  let compiler = webpack(cfg);
  logger.info('watching main...');
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
  logger.info('starting electron...');
  logger.info('electron: %s', electron);
  logger.info('entry: %s', entry);
  child = spawn(electron.default, [entry], {
    stdio: 'inherit',
    env: {
      HOST: args.host,
      PORT: String(args.port)
    }
  });
  child.on('close', quit);
  logger.info('electron started');
}

async function stop(): Promise<void> {
  if (!child)
    return;
  logger.info('stopping electron...');
  child.off('close', quit);
  try {
    let kill = promisify(treeKill);
    await kill(child.pid);
  } catch (err) {
    console.warn(err.message);
  }
  child = null;
  logger.info('electron stopped');
}

async function quit(): Promise<void> {
  logger.info('quiting...');
  if (unsubscribe)
    unsubscribe();
  await stop();
  if (watching) {
    logger.info('closing watcher...');
    let close = watching.close.bind(watching);
    await promisify(close)();
  }
  if (watching) {
    logger.info('closing server...');
    let close = server.close.bind(server);
    await promisify(close)();
  }
  logger.info('quited');
  process.exit();
}
