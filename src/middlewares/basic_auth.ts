
/* IMPORT */

import {sha256} from 'crypto-sha';
import type {RequestHandler} from '~/server/types';

/* MAIN */

const basicAuth = ( options: { users: { username: string, password: string }[], realm?: string } ): RequestHandler => {

  const users = new Map<string, string> ();
  const realm = options.realm || 'Protected Area';

  return async ( req, res, next ) => {

    if ( !users.size ) { // Initing the users map //TODO: This should really be outside of the middleware though...

      for ( let i = 0, l = options.users.length; i < l; i++ ) {

        const user = options.users[i];
        const hash = await sha256 ( user.password );

        users.set ( user.username, hash );

      }

    }

    const credentials = req.credentials;

    if ( credentials ) {

      const {username, password} = credentials;
      const hash1 = users.get ( username );

      if ( hash1 ) {

        const hash2 = await sha256 ( password );

        if ( hash1 === hash2 ) {

          return next (); // Authorized

        }

      }

    }

    res.status ( 401 );
    res.header ( 'WWW-Authenticate', `Basic realm="${realm}"` );

    await next ( true );

  };

};

/* EXPORT */

export default basicAuth;
