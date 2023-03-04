
/* IMPORT */

import {sha256} from 'crypto-sha';
import type {RequestHandler} from '~/server/types';

/* MAIN */

const basicAuth = ( options: { users: { username: string, password: string }[], realm?: string } ): RequestHandler => {

  const users = options.users;
  const realm = options.realm || 'Protected Area';

  return async ( req, res ) => {

    const credentials = req.credentials;

    if ( credentials ) {

      const {username, password} = credentials;
      const user = users.find ( user => user.username === username );

      if ( user ) {

        const hash1 = await sha256 ( user.password );
        const hash2 = await sha256 ( password );

        if ( hash1 === hash2 ) {

          return; // Authorized

        }

      }

    }

    res.status ( 401 );
    res.header ( 'WWW-Authenticate', `Basic realm="${realm}"` );
    res.end ();

  };

};

/* EXPORT */

export default basicAuth;
