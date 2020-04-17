#!/usr/bin/env node

import 'dotenv/config';
import 'ts-node/register';
import yargs from 'yargs';
import {clean, dev, prod} from './api';
import _ from 'lodash';

let parser = yargs.scriptName('electron-app-scripts')
  .usage('Usage: $0 command [options]')
  .env('EAS')
  .command({
    command: 'dev',
    describe: 'Start application for development',
    builder: args => args.default('environment', 'dev')
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
    handler: dev
  })
  .command({
    command: 'prod',
    describe: 'Build application for production',
    builder: args => args.default('environment', 'prod'),
    handler: prod
  })
  .command({
    command: 'clean',
    describe: 'Clean up distributions',
    handler: clean
  })
  .demandCommand()
  .options({
    environment: {
      alias: 'env',
      type: 'string',
      choices: ['dev', 'prod'],
      desc: 'Scripts environment mode'
    },
    electron: {
      type: 'string',
      desc: 'Electron module',
      default: 'electron'
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
  .help();

parser.parse();
