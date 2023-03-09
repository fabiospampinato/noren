
/* IMPORT */

import {sha1} from 'crypto-sha';
import {isStream} from '~/server/utils';
import type {RequestHandler} from '~/server/types';

/* HELPERS */

const getHash = ( value?: ReadableStream | Uint8Array | string ): Promise<string> | string | undefined => {

  if ( isStream ( value ) ) { // Stream path, problematic

    return; //TODO: WebCrypto doesn't support streams 🤦‍♂️ //URL: https://github.com/w3c/webcrypto/issues/73

  } else if ( !value?.length ) { // Empty value, fast path with hard-coded hash

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

    if ( !hash ) return;

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
