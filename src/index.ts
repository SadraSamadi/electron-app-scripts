#!/usr/bin/env node

import 'dotenv/config';
import yargs from 'yargs';
import {Options} from './task/serve';
import {dev, prod} from './api';

yargs.usage('Usage: $0 command [options]')
  .command<Options>({
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
  .demandCommand()
  .alias('v', 'version')
  .alias('h', 'help')
  .version()
  .help()
  .parse();
