import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {load, print, resolve} from '../util';
import {ChildProcess} from 'child_process';
import {DIST_MAIN} from '../paths';
import {Options} from '../model';
import treeKill from 'tree-kill';
import exitHook from 'exit-hook';
import spawn from 'cross-spawn';
import {promisify} from 'util';
import config from '../config';
import logger from '../logger';

let server: WebpackDevServer = null;
let watching: Compiler.Watching = null;
let child: ChildProcess = null;
let unsubscribe: Function = null;

export default async function (options: Options): Promise<void> {
  server = await renderer(options);
  watching = await main(options);
  unsubscribe = exitHook(quit);
}

async function renderer(options: Options): Promise<WebpackDevServer> {
  let cfg = await config('renderer', 'dev', options);
  let compiler = webpack(cfg);
  let wds = new WebpackDevServer(compiler);
  let listen = wds.listen.bind(wds);
  await promisify(listen)(options.port, options.host);
  return wds;
}

async function main(options: Options): Promise<Compiler.Watching> {
  let cfg = await config('main', 'dev', options);
  let compiler = webpack(cfg);
  return compiler.watch({}, async (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    print(stats);
    await stop();
    await start(options.host, options.port);
  });
}

async function start(host: string, port: number): Promise<void> {
  let entry = resolve(DIST_MAIN);
  let electron = await load('electron');
  child = spawn(electron.default, [entry], {
    stdio: 'inherit',
    env: {
      HOST: host,
      PORT: String(port)
    }
  });
  child.on('close', quit);
}

async function stop(): Promise<void> {
  if (!child)
    return;
  child.off('close', quit);
  try {
    await promisify(treeKill)(child.pid);
  } catch (e) {
    logger.warn('cant close electron: %s', e.message);
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
  if (server) {
    let close = server.close.bind(server);
    await promisify(close)();
  }
  process.exit();
}
