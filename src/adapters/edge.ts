
/* IMPORT */

import Server from '~/server';
import Req from '~/server/req';
import Res from '~/server/res';
import type {ErrorHandler, RequestHandler} from '~/server/types';

/* MAIN */

class EdgeServer extends Server {

  /* API */

  async fetch ( request: Request ): Promise<Response> {

    const body = new Uint8Array ( await request.arrayBuffer () );
    const headers = request.headers;
    const method = request.method;
    const url = request.url;
    const init = { body, headers, method };

    const req = new Req ( url, init );
    const res = new Res ();

    await this.handle ( req, res );

    return new Response ( res.body, {
      status: res.statusCode,
      headers: res.headers
    });

  }

}

/* EXPORT */

export default EdgeServer;
export {Req, Res};
export type {ErrorHandler, RequestHandler};
