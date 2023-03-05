
/* IMPORT */

import {sha1} from 'crypto-sha';
import type {RequestHandler} from '~/server/types';

/* HELPERS */

const getHash = ( value?: Uint8Array | string ): Promise<string> | string => {

  if ( !value?.length ) { // Empty value, fast path with hard-coded hash

    return 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

  } else { // Regular path

    return sha1 ( value );

  }

};

/* MAIN */

const etag = (): RequestHandler => {

  return async ( req, res, next ) => {

    const ifNoneMatch = req.header ( 'If-None-Match' );

    await next ();

    const hash = await getHash ( res.body );
    const etag = `"${hash}"`;

    if ( ifNoneMatch === etag ) {

      res.status ( 304 );

    } else {

      res.header ( 'ETag', etag );

    }

  };

};

/* EXPORT */

export default etag;
