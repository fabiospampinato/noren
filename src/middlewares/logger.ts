
/* IMPORT */

import type {RequestHandler} from '~/server/types';

/* MAIN */

const logger: RequestHandler = async ( req, res, next ) => {

  //TODO

  const method = req.method;
  const path = `${req.url.pathname}${req.url.search}`;
  const start = Date.now ();

  await next ();

  const end = Date.now ();
  const elapsed = end - start;

  const message = `[${method}] ${path} ${res.statusCode} ${elapsed}ms (${new Date ().toUTCString ()})`;

  console.log ( message );

};

/* EXPORT */

export default logger;
