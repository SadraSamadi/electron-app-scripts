#!/usr/bin/env node

import 'dotenv/config';
import 'reflect-metadata';
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
        desc: 'Main source folder',
        default: 'src/main'
      },
      'src.renderer': {
        desc: 'Renderer source folder',
        default: 'src/renderer'
      },
      'dist.main': {
        desc: 'Main distributable folder',
        default: 'dist/main'
      },
      'dist.renderer': {
        desc: 'Renderer distributable folder',
        default: 'dist/renderer'
      },
      'out': {
        desc: 'Outputs folder'
      },
      'config.babel': {
        desc: 'Babel config file'
      },
      'config.typescript': {
        desc: 'Typescript config file',
        default: 'tsconfig.json'
      },
      'config.tailwind': {
        desc: 'Tailwind config file'
      },
      'config.postcss': {
        desc: 'Postcss config file'
      },
      'config.webpack': {
        desc: 'Webpack config file'
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
