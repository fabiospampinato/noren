
/* IMPORT */

import {once} from 'node:events';
import {createServer} from 'node:http';
import process from 'node:process';
import {Readable} from 'node:stream';
import Server from '~/server';
import Req from '~/server/req';
import Res from '~/server/res';
import {isStream, isString} from '~/server/utils';
import type {IncomingMessage, Server as HTTPServer, ServerResponse} from 'node:http';
import type {ReadableStream} from 'node:stream/web';
import type {ErrorHandler, RequestHandler} from '~/server/types';

/* MAIN */

class NodeServer extends Server {

  /* VARIABLES */

  public server: HTTPServer<typeof IncomingMessage, typeof ServerResponse>;

  /* CONSTRUCTOR */

  constructor () {

    super ();

    this.server = createServer ();

    this.server.on ( 'request', this.fetch.bind ( this ) );

  }

  /* API */

  close (): this {

    this.server.close ();

    return this;

  }

  async fetch ( incoming: IncomingMessage, outgoing: ServerResponse ): Promise<void> {

    const environment = process.env;
    const headers: [string, string][] = [];
    const method = incoming.method?.toUpperCase () || '';
    const host = incoming.headers.host || '0.0.0.0';
    const path = ( incoming.url || '/' ).replace ( /^\/\/+/, '/' );
    const pathname = path.replace ( /\?.*$/, '' );
    const url = `http://${host}${path}`;
    const chunks: Buffer[] = [];

    for ( let i = 0, l = incoming.rawHeaders.length; i < l; i += 2 ) {

      const key = incoming.rawHeaders[i];
      const value = incoming.rawHeaders[i + 1];

      headers.push ([ key, value ]);

    }

    incoming.on ( 'data', chunk => {

      chunks.push ( chunk );

    });

    incoming.on ( 'end', async () => {

      if ( !incoming.complete ) return outgoing.end (); // Aborted

      const body = chunks;
      const options = { body, environment, headers, method, pathname, url };

      const req = new Req ( options );
      const res = new Res ();

      await this.handle ( req, res );

      outgoing.writeHead ( res.statusCode, res.headers.headers );

      if ( isStream ( res.body ) ) {

        Readable.fromWeb ( res.body as ReadableStream ).pipe ( outgoing ); //TSC

      } else if ( res.body?.length ) {

        outgoing.end ( res.body );

      } else {

        outgoing.end ();

      }

    });

  }

  listen ( port: number, callback?: () => void ): this;
  listen ( port: number, hostname: string, callback?: () => void ): this;
  listen ( port: number = 3000, hostnameOrCallback?: string | (() => void), callback?: () => void ): this {

    const hostname = isString ( hostnameOrCallback ) ? hostnameOrCallback : '0.0.0.0';
    const cb = isString ( hostnameOrCallback ) ? callback : hostnameOrCallback || callback;

    this.server.listen ( port, hostname, cb );

    return this;

  }

  async port (): Promise<number> {

    const address = this.server.address ();

    if ( isString ( address ) ) return -1; // Listening on a socket, there's no port

    if ( address ) return address.port;

    await once ( this.server, 'listening' );

    return this.port ();

  }

}

/* EXPORT */

export default NodeServer;
export {Req, Res};
export type {ErrorHandler, RequestHandler};
