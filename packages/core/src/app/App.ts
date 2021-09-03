import type { ViteDevServer } from 'vite';

import type { loadModule } from '../utils/module.js';
import type { AppOptions } from './AppOptions.js';
import type { DisposalBin } from './create/DisposalBin.js';
import type { ClientPlugin } from './plugin/ClientPlugin.js';
import type { FilteredPlugins } from './plugin/Plugin.js';
import type { ServerPage } from './site/Page.js';
import type { SiteOptions } from './site/SiteOptions.js';

export type App = {
  /** Plugin extensions. */
  [x: string]: unknown;
  version: string;
  configPath?: string;
  dirs: AppDirs;
  env: AppEnv;
  client: ClientPlugin;
  options: AppOptions;
  site: AppSite;
  plugins: FilteredPlugins;
  context: Record<string, unknown>;
  pages: ServerPage[];
  disposal: DisposalBin;
  dev: () => Promise<ViteDevServer>;
  build: () => Promise<void>;
  serve: (root: string) => Promise<void>;
  close: () => Promise<void>;
};

export type AppDirs = {
  cache: AppDirUtils;
  config: AppDirUtils;
  cwd: AppDirUtils;
  tmp: AppDirUtils;
  src: AppDirUtils;
  out: AppDirUtils;
  public: AppDirUtils;
  theme: AppDirUtils;
};

export type AppDirUtils = {
  /** Absolute path to directory. */
  path: string;
  /** Imports an ESM module. If it's a TS or CJS module it'll be transpiled with ESBuild first. */
  loadModule: typeof loadModule;
  /** Read contents of file relative to current directory. */
  read: (filePath: string) => string;
  /** Resolve relative file path to current directory. */
  resolve: (...path: string[]) => string;
  /** Write contents to file relative to current directory. */
  write: (filePath: string, data: string) => void;
};

export type AppEnv = {
  command: 'build' | 'serve';
  isDebug: boolean;
  isDev: boolean;
  isProd: boolean;
  isSSR?: boolean;
  /** @see https://vitejs.dev/guide/env-and-mode.html */
  mode: string;
};

export type AppSite = {
  options: SiteOptions;
};
