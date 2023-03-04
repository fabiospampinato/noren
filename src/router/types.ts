
/* MAIN */

type Method = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS' | 'SEARCH' | 'PROPFIND' | 'PROPPATCH' | 'MKCOL' | 'COPY' | 'MOVE' | 'LOCK' | 'UNLOCK';

type Params = {
  [name: string]: string | undefined
};

type Route<T> = {
  methods: Set<Method>,
  paths: string[],
  pathsRe: RegExp[],
  handlers: T[]
};

/* EXPORT */

export type {Method, Params, Route};
