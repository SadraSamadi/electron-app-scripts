import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {ChildProcess} from 'child_process';
import {Options} from '../model';
import treeKill from 'tree-kill';
import exitHook from 'exit-hook';
import spawn from 'cross-spawn';
import {promisify} from 'util';
import config from '../config';
import logger from '../logger';
import {print} from '../util';
import async from 'async';
import path from 'path';

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
  let cfg = await config('renderer', options);
  let compiler = webpack(cfg);
  let wds = new WebpackDevServer(compiler);
  let listen = wds.listen.bind(wds);
  await promisify<number, string>(listen)(options.port, options.host);
  return wds;
}

async function main(options: Options): Promise<Compiler.Watching> {
  let cfg = await config('main', options);
  let compiler = webpack(cfg);
  return compiler.watch({}, async (err, stats) => {
    if (err) {
      console.error(err);
      return;
    }
    print(stats);
    await stop();
    await start(options);
  });
}

async function start(options: Options): Promise<void> {
  let id = path.resolve(options.dist.main);
  let entry = require.resolve(id);
  let electron = await import(options.electron);
  child = spawn(electron.default, [entry], {
    stdio: 'inherit',
    env: {
      HOST: options.host,
      PORT: String(options.port)
    }
  });
  child.on('close', quit);
}

async function stop(): Promise<void> {
  if (!child)
    return;
  child.off('close', quit);
  let kill = async.reflect(() => treeKill(child.pid));
  await promisify(kill)();
  child = null;
}

async function quit(): Promise<void> {
  if (unsubscribe)
    unsubscribe();
  await async.series([
    async.asyncify(stop),
    cb => watching.close(cb),
    cb => server.close(cb)
  ]);
  logger.info('quit');
  process.exit();
}
