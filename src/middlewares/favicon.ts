
/* IMPORT */

import fs from 'node:fs';
import path from 'node:path';
import etag from '~/middlewares/etag';
import {isString} from '~/server/utils';
import type {RequestHandler} from '~/server/types';

/* TYPES */

type FaviconOptions = {
  immutable?: boolean,
  maxAge?: number
};

/* MAIN */

const favicon = ( favicon: Uint8Array | string, options: FaviconOptions = {} ): RequestHandler => {

  const buffer = isString ( favicon ) ? fs.readFileSync ( path.resolve ( favicon ) ) : favicon;
  const hash = etag.hash ( buffer );
  const maxAge = Math.max ( 0, Math.min ( options.maxAge ?? 60 * 60 * 24 * 365, 60 * 60 * 24 * 365 ) );
  const contentType = 'image/x-icon';
  const cacheControl = `public, max-age=${maxAge}${options.immutable ? ', immutable' : ''}`

  return async ( req, res, next ) => {

    const isGet = ( req.method === 'GET' );
    const isHead = ( req.method === 'HEAD' );

    if ( !isGet && !isHead ) return next ();

    if ( req.path !== '/favicon.ico' ) return next ();

    if ( isHead ) {

      res.status ( 200 );
      res.header ( 'Content-Length', String ( buffer.length ) );

    }

    if ( isGet ) {

      res.code ( 200 );
      res.header ( 'Content-Type', contentType );
      res.header ( 'Cache-Control', cacheControl );
      res.header ( 'ETag', `"${await hash}"` );
      res.send ( buffer );

    }

    return next ( true );

  };

};

/* EXPORT */

export default favicon;
