import fse from 'fs-extra';
import {DIST} from '../paths';

export default function (): Promise<void> {
  return fse.remove(DIST);
}
