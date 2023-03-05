
/* IMPORT */

import ext2mime from 'ext2mime';
import Cookie from '~/parsers/cookie';
import {STATUS} from '~/server/constants';
import Headers from '~/server/headers';
import Logger from '~/server/logger';
import {isString} from '~/server/utils';
import type Pioppo from 'pioppo';
import type {CookieOptions} from '~/parsers/cookie';
import type {JSONValue} from '~/server/types';

/* MAIN */

class Res {

  /* VARIABLES */

  headers: Headers;
  log: Pioppo;
  statusCode: number;
  body?: Uint8Array | string;

  /* CONSTRUCTOR */

  constructor () {

    this.headers = new Headers ();
    this.log = Logger;
    this.statusCode = 500;

  }

  /* DETAILS API */

  append ( key: string, value: string | string[] ): this {

    if ( isString ( value ) ) {

      this.headers.append ( key, value );

    } else {

      value.forEach ( value => {

        this.headers.append ( key, value );

      });

    }

    return this;

  }

  code ( code: number ): this {

    this.statusCode = code;

    return this;

  }

  cookie ( key: string, value: string, options?: CookieOptions ): this {

    const cookie = Cookie.stringify ( key, value, options );

    this.append ( 'Set-Cookie', cookie );

    return this;

  }

  header ( key: string, value: string ): this {

    this.headers.set ( key, value );

    return this;

  }

  redirect ( url: string, status: number = 302 ): this {

    const message = `Redirecting to ${url}...`;

    this.status ( status, message );
    this.header ( 'Location', url );

    return this;

  }

  status ( code: number, message: string | null | undefined = STATUS[code] ): this {

    this.statusCode = code;

    if ( message ) {

      this.text ( message );

    }

    return this;

  }

  type ( type: string ): this {

    const mime = type.includes ( '/' ) ? type : ext2mime ( type );
    const charset = ( mime.startsWith ( 'text' ) || mime === 'application/json' ) ? '; charset=UTF8' : '';
    const value = `${mime}${charset}`;

    this.headers.set ( 'Content-Type', value );

    return this;

  }

  /* BODY API */

  html ( value: string ): this {

    this.type ( 'text/html' );
    this.send ( value );

    return this;

  }

  json ( value: JSONValue ): this {

    this.type ( 'application/json' );
    this.send ( JSON.stringify ( value ) );

    return this;

  }

  text ( value: string ): this {

    this.type ( 'text/plain' );
    this.send ( value );

    return this;

  }

  send ( value: Uint8Array | string ): this {

    this.body = value;

    return this;

  }

}

/* EXPORT */

export default Res;
