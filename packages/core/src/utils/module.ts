import { build as esbuild } from 'esbuild';
import { createRequire } from 'module';
import { mkdirSync as mkTmpDirSync, track as trackTmpDir } from 'temp';
import { fileURLToPath } from 'url';

import { fs, isCommonJsFile, isTypeScriptFile } from './fs.js';
import { path } from './path.js';
import { isObject } from './unit.js';

/**
 * Check if a given module is an esm module with a default export.
 */
export const hasDefaultExport = <T = unknown>(
  mod: unknown
): mod is { default: T } =>
  isObject(mod) &&
  !!mod.__esModule &&
  Object.prototype.hasOwnProperty.call(mod, 'default');

/**
 * Node CJS `require` equivalent for ESM.
 */
export const esmRequire = createRequire(import.meta.url);

/**
 * `__dirname` alternative for ESM.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/no-explicit-any
export const currentDirectory = (meta: any): string =>
  path.dirname(fileURLToPath(meta.url));

/**
 * `require.resolve` wrapper. Returns `null` if the module cannot be resolved instead of throwing
 * an error.
 */
export const requireResolve = (request: string): string | null => {
  try {
    return esmRequire.resolve(request);
  } catch {
    return null;
  }
};

let tmpDir: string;
/** Imports an ESM module. If it's a TS or CJS module it'll be transpiled with ESBuild first. */
export const loadModule = async <T>(
  filePath: string,
  options: { cache?: boolean } = { cache: true }
): Promise<T> => {
  if (!isTypeScriptFile(filePath) && !isCommonJsFile(filePath)) {
    return import(
      filePath + (!options.cache ? `?t=${Date.now()}` : '')
    ) as unknown as T;
  }

  if (!tmpDir) {
    trackTmpDir();
    tmpDir = mkTmpDirSync('@vitebook/core/esbuild/');
  }

  const { outputFiles } = await esbuild({
    entryPoints: [filePath],
    bundle: true,
    write: false,
    format: 'esm',
    target: 'es2019',
    allowOverwrite: true,
    external: ['*.vue', '*.svelte']
  });

  const fileExt = path.extname(filePath);
  const code = outputFiles[0]?.text;

  const tmpModulePath =
    path
      .resolve(tmpDir, filePath.replace(/(\\|\/)/g, '_'))
      .slice(0, -fileExt.length) + '.mjs';

  await fs.writeFile(tmpModulePath, code);

  return import(
    tmpModulePath + (!options.cache ? `?t=${Date.now()}` : '')
  ) as unknown as T;
};
