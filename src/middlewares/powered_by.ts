
/* IMPORT */

import type {RequestHandler} from '~/server/types';

/* MAIN */

const poweredBy: RequestHandler = async ( req, res, next ) => {

  await next ();

  res.header ( 'X-Powered-By', 'Noren' );

};

/* EXPORT */

export default poweredBy;
