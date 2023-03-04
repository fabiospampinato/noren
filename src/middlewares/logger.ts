
/* IMPORT */

import type {RequestHandler} from '~/server/types';

/* MAIN */

const logger = (): RequestHandler => {

  return async ( req, res, next ) => {

    const method = req.method;
    const path = `${req.url.pathname}${req.url.search}`;
    const start = Date.now ();

    await next ();

    const end = Date.now ();
    const elapsed = end - start;

    const date = new Date ();
    const timestamp = date.toISOString ();
    const code = res.statusCode;

    const message = `[${timestamp}] ${method} ${code} ${elapsed}ms ${path}`;

    res.log.debug ( message );

  };

};

/* EXPORT */

export default logger;
