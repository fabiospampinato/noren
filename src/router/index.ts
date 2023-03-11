
/* IMPORT */

import {METHODS} from '~/router/constants';
import {compile} from '~/router/path';
import {castArray, isMethod} from '~/router/utils';
import type {Method, Params, Route} from '~/router/types';

/* MAIN */

//TODO: Support sub-routers, with their middlewares, for convenience
//TODO: Support path-scoped middlewares, for convenience

class Router<T> {

  /* VARIABLES */

  protected handlers: T[] = [];
  protected routes: Route<T>[] = [];

  /* API */

  compile ( path: string ): RegExp {

    return compile ( path, false );

  }

  on ( method: Method | Method[], path: string | string[], ...handlers: T[] ): this {

    const methods = new Set ( castArray ( method ) );
    const paths = castArray ( path );
    const pathsRe = paths.map ( path => this.compile ( path ) );
    const route: Route<T> = { methods, paths, pathsRe, handlers: [...this.handlers, ...handlers] };

    this.routes.push ( route );

    return this;

  }

  route ( method: string, path: string ): { params: Params, route: Route<T> } | undefined {

    method = method.toUpperCase ();

    if ( !isMethod ( method ) ) return;

    path = path.replace ( /[?#].*/, '' );

    for ( let i = 0, l = this.routes.length; i < l; i++ ) {

      const route = this.routes[i];

      if ( !route.methods.has ( method ) ) continue;

      for ( let pi = 0, pl = route.pathsRe.length; pi < pl; pi++ ) {

        const match = route.pathsRe[pi].exec ( path );

        if ( !match ) continue;

        const params = match.groups || {};

        return {params, route};

      }

    }

  }

  use ( ...handlers: T[] ): this {

    this.handlers.push ( ...handlers );

    return this;

  }

  /* METHOD API */

  all ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( METHODS, path, ...handlers );

  }

  copy ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'COPY', path, ...handlers );

  }

  delete ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'DELETE', path, ...handlers );

  }

  get ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'GET', path, ...handlers );

  }

  head ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'HEAD', path, ...handlers );

  }

  lock ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'LOCK', path, ...handlers );

  }

  mkcol ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'MKCOL', path, ...handlers );

  }

  move ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'MOVE', path, ...handlers );

  }

  options ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'OPTIONS', path, ...handlers );

  }

  patch ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'PATCH', path, ...handlers );

  }

  post ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'POST', path, ...handlers );

  }

  propfind ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'PROPFIND', path, ...handlers );

  }

  proppatch ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'PROPPATCH', path, ...handlers );

  }

  put ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'PUT', path, ...handlers );

  }

  search ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'SEARCH', path, ...handlers );

  }

  unlock ( path: string | string[], ...handlers: T[] ): this {

    return this.on ( 'UNLOCK', path, ...handlers );

  }

}

/* EXPORT */

export default Router;
