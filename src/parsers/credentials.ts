
/* IMPORT */

import Base64 from 'radix64-encoding';

/* HELPERS */

const BASIC_RE = /^\s*basic\s+([a-zA-Z0-9+/]+=*)\s*$/i;
const VALUE_RE = /^([^:]*):(.*)$/;

/* MAIN */

const Credentials = {

  /* API */

  parse: ( header: string ): { username: string, password: string } | undefined => {

    if ( !header ) return;

    const basic = BASIC_RE.exec ( header );

    if ( !basic ) return;

    const value = VALUE_RE.exec ( Base64.decodeStr ( basic[1] ) );

    if ( !value ) return;

    const username = value[1];
    const password = value[2];
    const credentials = { username, password };

    return credentials;

  }

};

/* EXPORT */

export default Credentials;
