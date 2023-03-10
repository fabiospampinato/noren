
/* IMPORT */

import concat from 'uint8-concat';
import U8 from 'uint8-encoding';
import Address from '~/parsers/address';
import Cookie from '~/parsers/cookie';
import Credentials from '~/parsers/credentials';
import Headers from '~/server/headers';
import {castArrayBuffer, isArray, Once} from '~/server/utils';
import type {JSONValue} from '~/server/types';

/* MAIN */

class Req {

  /* VARIABLES */

  private _body?: Uint8Array | Uint8Array[];
  private _headers?: [string, string][] | globalThis.Headers;
  private _pathname?: string;
  private _url: string;

  environment: Record<string, string | undefined>;
  method: string;
  params: Record<string, string | undefined>;
  signal: AbortSignal | null;

  /* CONSTRUCTOR */

  constructor ( options: { body?: Uint8Array | Uint8Array[], environment?: Record<string, string | undefined>, headers?: [string, string][] | globalThis.Headers, method?: string, pathname?: string, signal?: AbortSignal | null, url: string } ) {

    this._body = options.body;
    this._headers = options.headers;
    this._pathname = options.pathname;
    this._url = options.url;

    this.environment = options.environment || {};
    this.method = options.method || '';
    this.params = {};
    this.signal = options.signal || null;

  }

  /* GETTER API */

  @Once ()
  get body (): Uint8Array {

    if ( !this._body ) return new Uint8Array ( 0 );

    if ( isArray ( this._body ) ) return concat ( this._body );

    return this._body;

  }

  @Once ()
  get cookies (): Record<string, string | undefined> {

    return Cookie.parse ( this.headers.get ( 'Cookie' ) || '' );

  }

  @Once ()
  get credentials (): { username: string, password: string } | undefined {

    return Credentials.parse ( this.headers.get ( 'Authorization' ) || '' );

  }

  @Once ()
  get headers (): Headers {

    return new Headers ( this._headers );

  }

  @Once ()
  get ip (): string | undefined {

    return this.ips[0];

  }

  @Once ()
  get ips (): string[] {

    return Address.get ( this.headers.get ( 'X-Forwarded-For' ) || '' );

  }

  @Once ()
  get path (): string {

    return this._pathname || this.url.pathname;

  }

  @Once ()
  get url (): URL {

    return new URL ( this._url );

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

  @Once ()
  async arrayBuffer (): Promise<ArrayBuffer> {

    const arrayBuffer = castArrayBuffer ( this.body );

    return arrayBuffer;

  }

  @Once ()
  async blob (): Promise<Blob> {

    const blob = new Blob ([ this.body ]);

    return blob;

  }

  @Once ()
  async formData (): Promise<FormData> {

    const type = this.header ( 'Content-Type' ) || '';

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

  @Once ()
  async json (): Promise<JSONValue> {

    const text = await this.text ();
    const json = JSON.parse ( text );

    return json;

  }

  @Once ()
  async text (): Promise<string> {

    const text = U8.decode ( this.body );

    return text;

  }

}

/* EXPORT */

export default Req;
