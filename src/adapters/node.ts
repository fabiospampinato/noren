
/* IMPORT */

import events from 'node:events';
import {createServer} from 'node:http';
import process from 'node:process';
import concat from 'uint8-concat';
import Server from '~/server';
import Req from '~/server/req';
import Res from '~/server/res';
import {isString} from '~/server/utils';
import type {IncomingMessage, Server as HTTPServer, ServerResponse} from 'node:http';

/* MAIN */

class NodeServer extends Server {

  /* VARIABLES */

  public server: HTTPServer<typeof IncomingMessage, typeof ServerResponse>;

  /* CONSTRUCTOR */

  constructor () {

    super ();

    /* SERVER  */

    this.server = createServer ();

    /* REQUEST HANDLING */

    this.server.on ( 'request', ( incoming, outgoing ) => {

      const environment = process.env;
      const headers: Record<string, string> = {};
      const method = incoming.method?.toUpperCase () || '';
      const host = incoming.headers.host || '0.0.0.0';
      const pathname = ( incoming.url || '/' ).replace ( /^\/\/+/, '/' );
      const url = `http://${host}${pathname}`;
      const chunks: Buffer[] = [];

      for ( let i = 0, l = incoming.rawHeaders.length; i < l; i += 2 ) {

        const key = incoming.rawHeaders[i].toLowerCase ();
        const value = incoming.rawHeaders[i + 1];

        headers[key] = value;

      }

      incoming.on ( 'data', chunk => {

        chunks.push ( chunk );

      });

      incoming.on ( 'end', async () => {

        if ( !incoming.complete ) return outgoing.end (); // Aborted

        const body = concat ( chunks );
        const init = { body, environment, headers, method };
        const req = new Req ( url, init );
        const res = new Res ();

        await this.fetch ( req, res );

        outgoing.statusCode = res.statusCode;

        //TODO: use "outgoingMessage.setHeaders" eventually, but it requires Node v19

        res.headers.forEach ( ( value, key ) => {

          outgoing.setHeader ( key, value );

        });

        if ( res.body?.length ) {

          outgoing.end ( res.body );

        } else {

          outgoing.end ();

        }

      });

    });

  }

  /* API */

  close (): this {

    this.server.close ();

    return this;

  }

  listen ( port: number = 3000, hostname: string = '0.0.0.0' ): this {

    this.server.listen ( port, hostname );

    return this;

  }

  async port (): Promise<number> {

    const address = this.server.address ();

    if ( isString ( address ) ) return -1; // Listening on a socket, there's no port

    if ( address ) return address.port;

    await events.once ( this.server, 'listening' );

    return this.port ();

  }

}

/* EXPORT */

export default NodeServer;
export {Req, Res};
