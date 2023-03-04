
/* IMPORT */

import {sha1} from 'crypto-sha';
import type {RequestHandler} from '~/server/types';

/* HELPERS */

const hash = ( value?: Uint8Array | string ): Promise<string> | string => {

  if ( !value?.length ) { // Empty value, fast path

    return 'da39a3ee5e6b4b0d3255bfef95601890afd80709';

  } else { // Regular path

    return sha1 ( value );

  }

};

/* MAIN */

const etag: RequestHandler = async ( req, res, next ) => {

  const ifNoneMatch = req.header ( 'if-none-match' );

  await next ();

  const entity = await hash ( res.body );
  const etag = `"${entity}"`;

  if ( ifNoneMatch === etag ) {

    res.status ( 304, '' );

  } else {

    res.header ( 'ETag', etag );

  }

};

/* EXPORT */

export default etag;
