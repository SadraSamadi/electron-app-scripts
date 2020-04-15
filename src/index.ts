#!/usr/bin/env node

import 'dotenv/config';
import yargs from 'yargs';
import {clean, dev, prod} from './api';
import {CONFIG} from './paths';

yargs.scriptName('electron-app-scripts')
  .usage('Usage: $0 command [options]')
  .command({
    command: 'dev',
    describe: 'Start development',
    builder: {
      host: {
        type: 'string',
        default: process.env.HOST || 'localhost'
      },
      port: {
        alias: 'p',
        type: 'number',
        default: parseInt(process.env.PORT) || 3000
      }
    },
    handler: dev
  })
  .command({
    command: 'prod',
    describe: 'Start production',
    handler: prod
  })
  .command({
    command: 'clean',
    describe: 'Clean up',
    handler: clean
  })
  .option('config', {
    alias: 'c',
    type: 'string',
    desc: 'Path to config file',
    default: CONFIG
  })
  .demandCommand()
  .alias('v', 'version')
  .alias('h', 'help')
  .version()
  .help()
  .parse();
