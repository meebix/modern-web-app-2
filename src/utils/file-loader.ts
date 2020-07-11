/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import fs from 'fs';
import path from 'path';
import isGlob from 'is-glob';
import Glob from 'glob';
import { config } from '@config';

const DEFAULT_EXTENSIONS = ['.ts', '.js'];
const DIRS: any = {
  routes: config.server.dirs.routes.map((d: string) =>
    path.join(process.cwd(), d)
  ),
};

/**
 * Recursively finds files within a given directory
 *
 * @remarks
 * Synchronous
 *
 * @param dir - A glob directory
 * @returns An array of file paths
 */
const recursiveReadDirSync = (dir: any): any =>
  fs
    .readdirSync(dir)
    .reduce(
      (files, file) =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? files.concat(recursiveReadDirSync(path.join(dir, file)))
          : files.concat(path.join(dir, file) as any),
      []
    );

/**
 * Finds files within a given directory
 *
 * @remarks
 * Synchronous
 *
 * @param dir - A glob directory
 * @returns An array of file paths
 */
const readDirSync = (dir: any): any =>
  fs
    .readdirSync(dir)
    .reduce(
      (files, file) =>
        fs.statSync(path.join(dir, file)).isDirectory()
          ? files
          : files.concat(path.join(dir, file) as any),
      []
    );

/**
 * Interprets a glob pattern
 *
 * @remarks
 * Synchronous
 *
 * @param pattern - A Glob pattern
 * @param options - Glob options
 * @returns An array of file path strings
 */
const readGlobSync = (pattern: string, options: any): any =>
  Glob.sync(pattern, options);

/**
 * Get a list of files to be read
 *
 * @remarks
 * Synchronous
 *
 * @param dir - The directory glob to search
 * @param recursive - Boolean
 * @param globOptions - Glob options
 * @returns An array of file path strings
 */
const getSchemaFiles = (
  dirs: any[],
  recursive: boolean,
  globOptions: any
): any => {
  return dirs
    .map((dir) => {
      if (isGlob(dir)) {
        return readGlobSync(dir, globOptions);
      }

      if (recursive === true) {
        return recursiveReadDirSync(dir);
      }

      return readDirSync(dir);
    })
    .flat();
};

/**
 * Load contexts of given files
 *
 * @remarks
 * Synchronous
 *
 * @param type - The directory glob to search
 * @param options - Available options
 * @param options.recursive - A boolean whether to search recursively
 * @param options.globOptions - Glob options
 * @param options.flatten - A boolean whether to flatten to single array
 * @returns An array of file contents from each file
 */
export const fileLoader = (
  type: string,
  { recursive = false, globOptions = {}, flatten = false } = {}
): any => {
  const schemafiles = getSchemaFiles(DIRS[type], recursive, globOptions);

  let files = schemafiles
    .map((f: any) => ({ f, pathObj: path.parse(f) }))
    .filter(({ pathObj }: any) => DEFAULT_EXTENSIONS.includes(pathObj.ext))
    .map(({ f, pathObj }: any) => {
      let returnVal;

      switch (pathObj.ext) {
        case '.ts':
        case '.js': {
          const file = require(f);
          returnVal = file.default || file;
          break;
        }
        default:
          break;
      }

      return returnVal;
    })
    .filter((v: any) => !!v); // filter files we don't know how to handle

  if (flatten) {
    files = files.flat();
  }

  return files;
};
