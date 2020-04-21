#!/usr/bin/env node

import 'dotenv/config';
import yargs from 'yargs';
import * as api from './api';
import {Args} from './model';

const name = 'electron-app-scripts';

yargs.scriptName(name)
  .usage('Usage: $0 command [options]')
  .env('EAS')
  .config()
  .alias('c', 'config')
  .default('config', 'easrc.json')
  .pkgConf(name)
  .command<Args>({
    command: 'dev',
    describe: 'Start application for development',
    builder: args => args.default('env', 'dev')
      .options({
        host: {
          type: 'string',
          desc: 'Development server hostname',
          default: process.env.HOST || 'localhost'
        },
        port: {
          alias: 'p',
          type: 'number',
          desc: 'Development server port number',
          default: parseInt(process.env.PORT) || 3000
        }
      }),
    handler: api.dev
  })
  .command<Args>({
    command: 'prod',
    describe: 'Build application for production',
    builder: args => args.default('env', 'prod'),
    handler: api.prod
  })
  .command<Args>({
    command: 'clean',
    describe: 'Clean up distributions',
    handler: api.clean
  })
  .middleware(api.resolve)
  .demandCommand()
  .options({
    env: {
      type: 'string',
      choices: ['dev', 'prod'],
      desc: 'Scripts environment mode'
    },
    electron: {
      type: 'string',
      desc: 'Electron module',
      default: 'electron'
    },
    externals: {
      type: 'string',
      desc: 'Path to webpack external modules file',
      default: '.externals'
    }
  })
  .options({
    'src.main': {
      type: 'string',
      desc: 'Main source folder',
      default: 'src/main'
    },
    'src.renderer': {
      type: 'string',
      desc: 'Renderer source folder',
      default: 'src/renderer'
    },
    'dist.main': {
      type: 'string',
      desc: 'Main distributable folder',
      default: 'dist/main'
    },
    'dist.renderer': {
      type: 'string',
      desc: 'Renderer distributable folder',
      default: 'dist/renderer'
    },
    'dist.out': {
      type: 'string',
      desc: 'Outputs folder',
      default: 'dist/out'
    },
    'babel': {
      type: 'string',
      desc: 'Babel config file',
      default: 'babel.eas.js'
    },
    'typescript': {
      type: 'string',
      desc: 'Typescript config file',
      default: 'tsconfig.json'
    },
    'tailwind': {
      type: 'string',
      desc: 'Tailwind config file',
      default: 'tailwind.eas.js'
    },
    'postcss': {
      type: 'string',
      desc: 'Postcss config file',
      default: 'postcss.eas.js'
    },
    'webpack': {
      type: 'string',
      desc: 'Webpack config file',
      default: 'webpack.eas.js'
    }
  })
  .alias('v', 'version')
  .alias('h', 'help')
  .version()
  .help()
  .parse();
