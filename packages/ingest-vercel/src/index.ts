//payload
import Request from '@stackpress/ingest/dist/payload/Request';
import Response from '@stackpress/ingest/dist/payload/Response';
import { 
  ReadSession, 
  WriteSession 
} from '@stackpress/ingest/dist/payload/Session'; 
//buildtime
import type { BuildtimeOptions } from '@stackpress/ingest/dist/buildtime/types';
import buildtime, { 
  Router as BuildtimeRouter, 
  Server as BuildtimeServer 
} from '@stackpress/ingest/dist/buildtime';
//vercel
import Builder from './Builder';
import Queue from './Queue';
import Router from './Router';
import Server from './Server';

import {
  formDataToObject,
  fetchQueryToObject,
  fetchToURL,
  loader,
  response
} from './helpers';

export {
  //payload
  Request,
  Response,
  ReadSession,
  WriteSession,
  //buildtime
  BuildtimeRouter,
  BuildtimeServer,
  //netlify
  Builder,
  Queue,
  Router,
  Server,
  formDataToObject,
  fetchQueryToObject,
  fetchToURL,
  loader,
  response
}

export default function vercel(options: BuildtimeOptions = {}) {
  options.buildDir = options.buildDir || './api';
  const build = buildtime(options);

  const { 
    buildDir,
    loader, 
    router, 
    create,
    server: developer
  } = build;
  const { fs, cwd } = loader;

  const builder = new Builder(router, { tsconfig: options.tsconfig });
  const server = new Server();

  return {
    ...build,
    developer,
    builder,
    server,
    build: () => builder.build({ ...build, fs, cwd, buildDir }),
    develop: create
  }
}