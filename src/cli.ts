#!/usr/bin/env node

import 'dotenv/config';
import yargs from 'yargs';
import {Args} from './model';
import api from './api';
import _ from 'lodash';

yargs.scriptName('electron-app-scripts')
  .usage('Usage: $0 command [options]')
  .env('EAS')
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
    handler: args => api('dev', args)
  })
  .command<Args>({
    command: 'prod',
    describe: 'Build application for production',
    builder: args => args.default('env', 'prod'),
    handler:  args => api('prod', args)
  })
  .command<Args>({
    command: 'clean',
    describe: 'Clean up distributions',
    handler:  args => api('clean', args)
  })
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
  .options(
    _.mapValues({
      'src.main': {
        desc: 'Path to source folder for main',
        default: 'src/main'
      },
      'src.renderer': {
        desc: 'Path to source folder for renderer',
        default: 'src/renderer'
      },
      'dist.main': {
        desc: 'Path to distributable folder for main',
        default: 'dist/main'
      },
      'dist.renderer': {
        desc: 'Path to distributable folder for renderer',
        default: 'dist/renderer'
      },
      'out': {
        desc: 'Path to folder for outputs'
      },
      'config.eslint': {
        desc: 'Path to eslint config file for renderer'
      },
      'config.babel': {
        desc: 'Path to babel config file for renderer'
      },
      'config.typescript': {
        desc: 'Path to typescript config file',
        default: 'tsconfig.json'
      },
      'config.tailwind': {
        desc: 'Path to tailwind config file for renderer'
      },
      'config.postcss': {
        desc: 'Path to postcss config file for renderer'
      },
      'config.webpack': {
        desc: 'Path to webpack config file for renderer'
      }
    }, (option, key) => _.defaults({}, option, {
      type: 'string',
      default: key
    }))
  )
  .alias('v', 'version')
  .alias('h', 'help')
  .version()
  .help()
  .parse();
