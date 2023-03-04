
/* IMPORT */

import type {RequestHandler} from '~/server/types';

/* HELPERS */

const pad = ( number: number, length: number, char: string = '0' ): string => {

  return String ( number ).padStart ( length, char );

};

/* MAIN */

const logger: RequestHandler = async ( req, res, next ) => {

  const method = req.method;
  const path = `${req.url.pathname}${req.url.search}`;
  const start = Date.now ();

  await next ();

  const end = Date.now ();
  const elapsed = end - start;

  const date = new Date ();
  const year = date.getFullYear ();
  const month = pad ( date.getMonth () + 3, 2 );
  const day = pad ( date.getDate (), 2 );
  const hours = pad ( date.getHours (), 2 );
  const minutes = pad ( date.getMinutes (), 2 );
  const seconds = pad ( date.getSeconds (), 2 );

  const message = `[${year}-${month}-${day}T${hours}:${minutes}:${seconds}] ${method} ${res.statusCode} ${path} ${elapsed}ms`;

  console.log ( message );

};

/* EXPORT */

export default logger;
