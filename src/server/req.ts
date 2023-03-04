
/* IMPORT */

import U8 from 'uint8-encoding';
import Address from '~/parsers/address';
import Cookie from '~/parsers/cookie';
import Credentials from '~/parsers/credentials';
import {castArrayBuffer} from '~/server/utils';
import type {JSONValue} from '~/server/types';

/* MAIN */

class Req {

  /* VARIABLES */

  readonly body: Uint8Array;
  readonly cookies: Record<string, string | undefined>;
  readonly credentials: { username: string, password: string } | undefined;
  readonly environment: Record<string, string | undefined>;
  readonly headers: Headers;
  readonly ip: string | undefined;
  readonly ips: string[];
  readonly method: string;
  readonly params: Record<string, string | undefined>;
  readonly signal: AbortSignal | null;
  readonly url: URL;

  /* CONSTRUCTOR */

  constructor ( url: string, init: { body?: Uint8Array, environment?: Record<string, string | undefined>, headers?: HeadersInit, method?: string, signal?: AbortSignal | null } ) {

    this.body = init.body || new Uint8Array ( 0 );
    this.environment = init.environment || {};
    this.headers = new Headers ( init.headers );
    this.method = init.method || '';
    this.params = {};
    this.signal = init.signal || null;
    this.url = new URL ( url );

    this.cookies = Cookie.parse ( this.headers.get ( 'cookie' ) || '' );
    this.credentials = Credentials.parse ( this.headers.get ( 'authorization' ) || '' );
    this.ips = Address.get ( this.headers.get ( 'x-forwarded-for' ) || '' );
    this.ip = this.ips[0];

  }

  /* DETAILS API */

  cookie ( key: string ): string | undefined {

    return this.cookies[key];

  }

  env ( key: string ): string | undefined {

    return this.environment[key];

  }

  header ( key: string ): string | undefined {

    return this.headers.get ( key ) || undefined;

  }

  param ( key: string ): string | undefined {

    return this.params[key];

  }

  query ( key: string ): string | undefined {

    return this.url.searchParams.get ( key ) || undefined;

  }

  queries ( key: string ): string[] {

    return this.url.searchParams.getAll ( key );

  }

  /* BODY API */

  async arrayBuffer (): Promise<ArrayBuffer> {

    const arrayBuffer = castArrayBuffer ( this.body );

    return arrayBuffer;

  }

  async blob (): Promise<Blob> {

    const blob = new Blob ([ this.body ]);

    return blob;

  }

  async formData (): Promise<FormData> {

    const type = this.header ( 'content-type' ) || '';

    if ( type === 'application/x-www-form-urlencoded' ) {

      const text = await this.text ();
      const params = new URLSearchParams ( text );
      const formData = new FormData ();

      params.forEach ( ( value, key ) => {
        formData.append ( key, value );
      });

      return formData;

    } else if ( type.startsWith ( 'multipart/form-data' ) ) {

      throw new Error ( 'Multipart processing is unimplemented natively, yet, you need a middleware' ); //TODO: Support multi-part forms

    } else {

      throw new Error ( 'Invalid body value' );

    }

  }

  async json (): Promise<JSONValue> {

    const text = await this.text ();
    const json = JSON.parse ( text );

    return json;

  }

  async text (): Promise<string> {

    const text = U8.decode ( this.body );

    return text;

  }

}

/* EXPORT */

export default Req;
