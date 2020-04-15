import {join} from 'path';

export const ROOT = process.cwd();

export const CONFIG = join(ROOT, 'config.override');

export const PACKAGE = join(ROOT, 'package.json');

export const SRC = join(ROOT, 'src');

export const SRC_MAIN = join(SRC, 'main');

export const SRC_MAIN_TSCONFIG = join(SRC_MAIN, 'tsconfig.json');

export const SRC_RENDERER = join(SRC, 'renderer');

export const SRC_RENDERER_TSCONFIG = join(SRC_RENDERER, 'tsconfig.json');

export const DIST = join(ROOT, 'dist');

export const DIST_MAIN = join(DIST, 'main');

export const DIST_RENDERER = join(DIST, 'renderer');
