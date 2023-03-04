
/* TYPES */

type CookieOptions = {
  domain?: string,
  expires?: Date,
  httpOnly?: boolean,
  maxAge?: number,
  path?: string,
  sameSite?: 'Strict' | 'Lax' | 'None',
  secure?: boolean
};

/* HELPERS */

const VALUES_SEPARATOR_RE = /;\s*/g;
const VALUE_SEPARATOR_RE = /\s*=\s*/;

/* MAIN */

const Cookie = {

  /* API */

  parse: ( header: string ): Record<string, string> => {

    const cookies: Record<string, string> = {};

    if ( !header ) return cookies;

    const values = header.split ( VALUES_SEPARATOR_RE );

    for ( let i = 0, l = values.length; i < l; i++ ) {

      const parts = values[i].split ( VALUE_SEPARATOR_RE );

      if ( parts.length !== 2 ) continue;

      const key = parts[0];
      const value = parts[1];

      cookies[key] = decodeURIComponent ( value );

    }

    return cookies;

  },

  stringify: ( key: string, value: string, options: CookieOptions = {} ): string => {

    let cookie = `${key}=${encodeURIComponent ( value )}`;

    if ( options.domain ) {
      cookie += `; Domain=${options.domain}`;
    }

    if ( options.expires ) {
      cookie += `; Expires=${options.expires.toUTCString ()}`;
    }

    if ( options.httpOnly ) {
      cookie += '; HttpOnly';
    }

    if ( options.maxAge ) {
      cookie += `; Max-Age=${Math.round ( options.maxAge )}`;
    }

    if ( options.path ) {
      cookie += `; Path=${options.path}`;
    }

    if ( options.sameSite ) {
      cookie += `; SameSite=${options.sameSite}`;
    }

    if ( options.secure ) {
      cookie += '; Secure';
    }

    return cookie;

  }

};

/* EXPORT */

export default Cookie;
export type {CookieOptions};
