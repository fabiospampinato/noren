
/* IMPORT */

import makeNakedPromise from 'promise-make-naked';
import Router from '~/router';
import {castError, isPromise} from '~/server/utils';
import type Req from '~/server/req';
import type Res from '~/server/res';
import type {ErrorHandler, RequestHandler} from '~/server/types';

/* MAIN */

//TODO: Add a basic way to serve static files

class Server extends Router<RequestHandler> {

  /* VARIABLES */

  protected errorHandler: ErrorHandler | undefined;
  protected notFoundHandler: RequestHandler | undefined;

  /* API */

  async handle ( req: Req, res: Res ): Promise<Res> {

    //TODO: This function is a bit ugly, though it's also kinda complicated, maybe it can be written better?

    const {promise: done, resolve: resolveDone} = makeNakedPromise<void> ();
    const results: unknown[] = [];

    async function exec ( handler: ErrorHandler, args: [Req, Res] | [Req, Res, Error] ): Promise<boolean>;
    async function exec ( handler: RequestHandler, args: [Req, Res] | [Req, Res, Error] ): Promise<boolean>;
    async function exec ( handler: any, args: [Req, Res] | [Req, Res, Error] ): Promise<boolean> { //TSC

      if ( handler.length <= args.length ) { // Implicit "next" behavior, assuming this is the last handler

        if ( args.length === 3 ) { // Error handler

          await handler ( args[2], args[0], args[1] );

        } else { // Request handler

          await handler ( args[0], args[1] );

        }

        return res.ended || false;

      } else { // Explicit "next" behavior, assuming this is a middleware

        const {promise, resolve, reject} = makeNakedPromise<boolean> ();

        const result = handler ( ...args, ( errorOrDone: true | unknown ) => {

          ( errorOrDone && errorOrDone !== true ) ? reject ( errorOrDone ) : resolve ( !!errorOrDone );

          return done;

        });

        if ( res.ended ) resolve ( true );

        if ( isPromise ( result ) ) result.finally ( () => res.ended && resolve ( true ) );

        const finished = await promise;

        results.push ( result );

        return res.ended || finished;

      }

    }

    const method = req.method.toUpperCase ();
    const path = decodeURIComponent ( req.path );

    try {

      const route = this.route ( method, path );

      let finished = false;

      if ( route ) {

        res.code ( 200 );

        req.params = route.params;

        const handlers = route.route.handlers;

        for ( let i = 0, l = handlers.length; i < l; i++ ) {

          finished = await exec ( handlers[i], [req, res] );

          if ( finished ) break;

        }

      } else {

        res.code ( 404 );

        const handlers = this.handlers;

        for ( let i = 0, l = handlers.length; i < l; i++ ) {

          finished = await exec ( handlers[i], [req, res] );

          if ( finished ) break;

        }

        if ( !finished ) {

          if ( this.notFoundHandler ) {

            await exec ( this.notFoundHandler, [req, res] );

          } else {

            res.status ( 404 );

          }

        }

      }

    } catch ( exception: unknown ) {

      if ( this.errorHandler ) {

        res.status ( 500, null );

        try {

          const error = castError ( exception );

          await exec ( this.errorHandler, [req, res, error] );

        } catch ( exception: unknown ) {

          res.status ( 500 );

          console.error ( exception );

        }

      } else {

        res.status ( 500 );

        console.error ( exception );

      }

    }

    resolveDone ();

    await Promise.allSettled ( results );

    return res;

  }

  onError ( handler: ErrorHandler ): this {

    if ( this.errorHandler ) throw new Error ( 'An error handler has already been set' );

    this.errorHandler = handler;

    return this;

  }

  onNotFound ( handler: RequestHandler ): this {

    if ( this.notFoundHandler ) throw new Error ( 'A not-found handler has already been set' );

    this.notFoundHandler = handler;

    return this;

  }

}

/* EXPORT */

export default Server;
