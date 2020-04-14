import {join} from 'path';

export const ROOT = process.cwd();

export const PACKAGE = join(ROOT, 'package.json');

export const SRC = join(ROOT, 'src');

export const SRC_MAIN = join(SRC, 'main');

export const SRC_RENDERER = join(SRC, 'renderer');

export const DIST = join(ROOT, 'dist');

export const DIST_MAIN = join(DIST, 'main');

export const DIST_RENDERER = join(DIST, 'renderer');
