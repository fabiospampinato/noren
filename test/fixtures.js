
/* IMPORT */

import Server from '../dist/adapters/node.js';

/* MAIN */

const appWith = ( fn ) => {

  const server = new Server ();

  fn ( server );

  const open = () => server.listen ( 0 );
  const close = () => server.close ();
  const fetch = async ( path, options ) => globalThis.fetch ( `http://0.0.0.0:${await server.port ()}/${path}`, options );

  return {server, open, close, fetch};

};

const test = async ( t, app, path, options, output ) => {

  const {server, open, close, fetch} = app ();

  let _req;
  let _res;
  let _handle = server.handle;

  server.handle = ( req, res ) => {
    _req = req;
    _res = res;
    return _handle.call ( server, req, res );
  };

  open ();

  if ( typeof options === 'string' ) {

    options = {
      method: 'POST',
      body: options
    };

  }

  const response = await fetch ( path, options );

  if ( typeof output === 'function' ) {

    await output ( _req, _res );

  } else {

    if ( 'statusCode' in output ) {
      t.is ( response.status, output.statusCode );
    }

    if ( 'text' in output ) {
      t.is ( await response.text (), output.text );
    }

    if ( 'json' in output ) {
      t.deepEqual ( await response.json (), output.json );
    }

    if ( 'buffer' in output ) {
      t.deepEqual ( await response.arrayBuffer (), output.buffer );
    }

    if ( 'headers' in output ) {
      const headers = Object.fromEntries ( response.headers.entries () );
      t.like ( headers, output.headers );
    }

  }

  close ();

};

/* EXPORT */

export {appWith, test};
