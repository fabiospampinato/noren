
/* IMPORT */

import fs from 'node:fs/promises';
import path from 'node:path';
import ContentType from '~/parsers/content_type';
import type {RequestHandler} from '~/server/types';

/* TYPES */

type ServeOptions = {
  dotfiles?: boolean,
  fallthrough?: boolean,
  immutable?: boolean,
  maxAge?: number
};

/* HELPERS */

const dotfileRe = /(^|\\|\/)\./i;

const hasDotfile = ( filePath: string ): boolean => {

  return dotfileRe.test ( filePath );

};

const isInsidePath = ( rootPath: string, filePath: string ): boolean => {

  const relativePath = path.relative ( rootPath, filePath );

  return !!relativePath && !relativePath.startsWith ( '..' ) && !path.isAbsolute ( relativePath );

};

/* MAIN */

//TODO: Handle ranges
//TODO: Handle: last-modified
//TODO: Handle: if-match, if-unmodified-since, if-none-match, if-modified-since
//TODO: Maybe set an Etag header too

const serveStatic = ( root: string, options: ServeOptions = {} ): RequestHandler => {

  const dotfiles = options.dotfiles ?? false;
  const fallthrough = options.fallthrough ?? true;
  const immutable = options.immutable ?? false;
  const maxAge = Math.max ( 0, Math.min ( options.maxAge ?? 0, 60 * 60 * 24 * 365 ) );

  const rootPath = path.normalize ( path.resolve ( root ) );

  return async ( req, res, next ) => {

    const isGet = ( req.method === 'GET' );
    const isHead = ( req.method === 'HEAD' );

    if ( !isGet && !isHead ) {

      if ( fallthrough ) {

        return next ();

      } else {

        res.status ( 405 );
        res.header ( 'Allow', 'GET, HEAD' );

        return next ( true );

      }

    }

    const pathname = path.normalize ( req.url.pathname );
    const filePath = path.join ( rootPath, pathname );

    if ( isInsidePath ( rootPath, filePath ) ) {

      try {

        const stat = await fs.stat ( filePath );

        if ( stat.isFile () ) {

          if ( dotfiles || !hasDotfile ( filePath ) ) {

            res.header ( 'Content-Length', String ( stat.size ) );
            res.header ( 'Last-Modified', stat.mtime.toUTCString () );

            if ( isHead ) {

              res.status ( 200 );

            }

            if ( isGet ) {

              const fileContent = await fs.readFile ( filePath );
              const fileExt = path.extname ( filePath );
              const type = fileExt ? ContentType.get ( fileExt ) : 'application/octet-stream';

              res.code ( 200 );
              res.header ( 'Content-Type', type );
              res.header ( 'Cache-Control', `public, max-age=${maxAge}${immutable ? ', immutable' : ''}` );
              res.send ( fileContent );

            }

            return next ( true );

          }

        }

      } catch {}

    }

    if ( fallthrough ) {

      return next ();

    } else {

      res.status ( 404 );

      return next ( true );

    }

  };

};

/* EXPORT */

export default serveStatic;
