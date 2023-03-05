
/* IMPORT */

import type {RequestHandler} from '~/server/types';

/* MAIN */

//TODO: Make this much better, this is only capable of allowing everything

const cors = (): RequestHandler => {

  return ( req, res, next ) => {

    res.header ( 'Access-Control-Allow-Origin', '*' );

    if ( req.method === 'OPTIONS' ) {

      const headers = req.header ( 'access-control-request-headers' ) || '';

      res.header ( 'Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, DELETE, PATCH' );
      res.header ( 'Access-Control-Allow-Headers', headers );
      res.header ( 'Vary', 'Access-Control-Request-Headers' );

      res.status ( 204 );

      return next ( true );

    }

    next ();

  };

};

/* EXPORT */

export default cors;
