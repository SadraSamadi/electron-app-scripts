import webpack, {Compiler} from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {ChildProcess} from 'child_process';
import {DIST_MAIN} from '../paths';
import treeKill from 'tree-kill';
import exitHook from 'exit-hook';
import spawn from 'cross-spawn';
import {promisify} from 'util';
import config from '../config';
import {print} from './util';

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
  let cfg = await config.renderer(true);
  let compiler = webpack(cfg);
  let wds = new WebpackDevServer(compiler);
  let listen = wds.listen.bind(wds);
  await promisify(listen)(options.port, options.host);
  return wds;
}

async function main(options: Options): Promise<Compiler.Watching> {
  let cfg = await config.main(true);
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
  let electron = require.resolve('electron');
  let command = await import(electron);
  let entry = require.resolve(DIST_MAIN);
  child = spawn(command.default, [entry], {
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
  if (!child.killed)
    await promisify(treeKill)(child.pid);
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

export interface Options {

  host?: string;

  port?: number;

}
