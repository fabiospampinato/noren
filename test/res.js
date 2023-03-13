
/* IMPORT */

import {describe} from 'fava';
import {setTimeout as delay} from 'node:timers/promises';
import U8 from 'uint8-encoding';
import {STATUS} from '../dist/server/constants.js';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const app = () => {

  return appWith ( app => {

    app.get ( '/', ( req, res ) => {} );

    app.get ( '/append', ( req, res ) => {
      res.code ( 200 );
      res.append ( 'foo', 'valueFoo1' );
      res.append ( 'foo', 'valueFoo2' );
      res.header ( 'bar', 'asd' );
    });

    app.get ( '/status-100', ( req, res ) => res.status ( 100 ) );
    app.get ( '/status-101', ( req, res ) => res.status ( 101 ) );
    app.get ( '/status-102', ( req, res ) => res.status ( 102 ) );
    app.get ( '/status-103', ( req, res ) => res.status ( 103 ) );

    app.get ( '/status-200', ( req, res ) => res.status ( 200 ) );
    app.get ( '/status-201', ( req, res ) => res.status ( 201 ) );
    app.get ( '/status-202', ( req, res ) => res.status ( 202 ) );
    app.get ( '/status-204', ( req, res ) => res.status ( 204 ) );
    app.get ( '/status-206', ( req, res ) => res.status ( 206 ) );

    app.get ( '/status-301', ( req, res ) => res.status ( 301 ) );
    app.get ( '/status-302', ( req, res ) => res.status ( 302 ) );
    app.get ( '/status-303', ( req, res ) => res.status ( 303 ) );
    app.get ( '/status-304', ( req, res ) => res.status ( 304 ) );
    app.get ( '/status-307', ( req, res ) => res.status ( 307 ) );
    app.get ( '/status-308', ( req, res ) => res.status ( 308 ) );

    app.get ( '/status-400', ( req, res ) => res.status ( 400 ) );
    app.get ( '/status-401', ( req, res ) => res.status ( 401 ) );
    app.get ( '/status-402', ( req, res ) => res.status ( 402 ) );
    app.get ( '/status-403', ( req, res ) => res.status ( 403 ) );
    app.get ( '/status-404', ( req, res ) => res.status ( 404 ) );
    app.get ( '/status-405', ( req, res ) => res.status ( 405 ) );
    app.get ( '/status-406', ( req, res ) => res.status ( 406 ) );
    app.get ( '/status-408', ( req, res ) => res.status ( 408 ) );
    app.get ( '/status-409', ( req, res ) => res.status ( 409 ) );
    app.get ( '/status-410', ( req, res ) => res.status ( 410 ) );
    app.get ( '/status-411', ( req, res ) => res.status ( 411 ) );
    app.get ( '/status-412', ( req, res ) => res.status ( 412 ) );
    app.get ( '/status-413', ( req, res ) => res.status ( 413 ) );
    app.get ( '/status-414', ( req, res ) => res.status ( 414 ) );
    app.get ( '/status-415', ( req, res ) => res.status ( 415 ) );
    app.get ( '/status-416', ( req, res ) => res.status ( 416 ) );
    app.get ( '/status-421', ( req, res ) => res.status ( 421 ) );
    app.get ( '/status-429', ( req, res ) => res.status ( 429 ) );

    app.get ( '/status-500', ( req, res ) => res.status ( 500 ) );
    app.get ( '/status-501', ( req, res ) => res.status ( 501 ) );
    app.get ( '/status-502', ( req, res ) => res.status ( 502 ) );
    app.get ( '/status-503', ( req, res ) => res.status ( 503 ) );
    app.get ( '/status-504', ( req, res ) => res.status ( 504 ) );
    app.get ( '/status-505', ( req, res ) => res.status ( 505 ) );
    app.get ( '/status-507', ( req, res ) => res.status ( 507 ) );

    app.get ( '/status-custom', ( req, res ) => res.status ( 404, 'Sorry, not here!' ) );

    app.get ( '/cookie', ( req, res ) => {
      res.cookie ( 'foo', 'valueFoo' );
      res.cookie ( 'bar', 'valueBar' );
    });

    app.get ( '/header', ( req, res ) => {
      res.header ( 'foo', 'valueFoo' );
      res.header ( 'bar', 'valueBar' );
    });

    app.get ( '/redirect', ( req, res ) => res.redirect ( '/redirected' ) );
    app.get ( '/redirected', ( req, res ) => res.text ( 'redirected!' ) );

    app.get ( '/type-png', ( req, res ) => res.type ( 'png' ) );
    app.get ( '/type-jpg', ( req, res ) => res.type ( 'jpg' ) );

    app.get ( '/return-json', ( req, res ) => res.json ({ foo: 'bar' }) );
    app.get ( '/return-text', ( req, res ) => res.text ( 'Hello World!' ) );
    app.get ( '/return-html', ( req, res ) => res.html ( '<p>Hello World!</p>' ) );
    app.get ( '/return-buffer', ( req, res ) => res.send ( U8.encode ( 'body' ) ) );

  });

};

/* MAIN */

describe ( 'Res', it => {

  it ( 'can get the set headers', async t => {

    await test ( t, app, '/', {}, ( req, res ) => {

      res.header ( 'foo', 'valueFoo' );
      res.header ( 'bar', 'valueBar' );

      t.is ( res.headers.get ( 'foo' ), 'valueFoo' );
      t.is ( res.headers.get ( 'bar' ), 'valueBar' );

    });

  });

  it ( 'can get the set status code', async t => {

    await test ( t, app, '/', {}, ( req, res ) => {

      t.is ( res.statusCode, 200 );

      res.code ( 400 );

      t.is ( res.statusCode, 400 );

    });

  });

  it ( 'can get the set body', async t => {

    await test ( t, app, '/', {}, ( req, res ) => {

      const body1 = U8.encode ( 'Hello World!' );

      res.send ( body1 );

      t.is ( res.body, body1 );

      const body2 = 'Hello World!';

      res.send ( body2 );

      t.is ( res.body, body2 );

    });

  });

  it ( 'can append a header', async t => {

    await test ( t, app, '/append', {}, {
      statusCode: 200,
      text: '',
      headers: {
        'foo': 'valueFoo1, valueFoo2'
      }
    });

  });

  it ( 'can set the status code', async t => {

    for ( const code in STATUS ) {

      if ( code < 200 ) continue; //TODO: fetch throws a "fetch failed" for some reason?

      await test ( t, app, `/status-${code}`, {}, {
        statusCode: Number ( code ),
        text: STATUS[code]
      });

    }

  });

  it ( 'can set a cookie', async t => {

    await test ( t, app, '/cookie', {}, {
      statusCode: 200,
      text: '',
      headers: {
        'set-cookie': 'foo=valueFoo, bar=valueBar'
      }
    });

  });

  it ( 'can set a header', async t => {

    await test ( t, app, '/header', {}, {
      statusCode: 200,
      text: '',
      headers: {
        'foo': 'valueFoo',
        'bar': 'valueBar'
      }
    });

  });

  it ( 'can redirect', async t => {

    await test ( t, app, '/redirect', {}, {
      statusCode: 200,
      text: 'redirected!'
    });

  });

  it ( 'can set the status code and message', async t => {

    await test ( t, app, '/status-custom', {}, {
      statusCode: 404,
      text: 'Sorry, not here!'
    });

  });

  it ( 'can set the return type', async t => {

    await test ( t, app, '/type-png', {}, {
      statusCode: 200,
      headers: {
        'content-type': 'image/png'
      }
    });

    await test ( t, app, '/type-jpg', {}, {
      statusCode: 200,
      headers: {
        'content-type': 'image/jpeg'
      }
    });

  });

  it ( 'can return html', async t => {

    await test ( t, app, '/return-html', {}, {
      statusCode: 200,
      text: '<p>Hello World!</p>',
      headers: {
        'content-type': 'text/html; charset=UTF8'
      }
    });

  });

  it ( 'can return json', async t => {

    await test ( t, app, '/return-json', {}, {
      statusCode: 200,
      json: {
        foo: 'bar'
      },
      headers: {
        'content-type': 'application/json; charset=UTF8'
      }
    });

  });

  it ( 'can return text', async t => {

    await test ( t, app, '/return-text', {}, {
      statusCode: 200,
      text: 'Hello World!',
      headers: {
        'content-type': 'text/plain; charset=UTF8'
      }
    });

  });

  it ( 'can return a buffer', async t => {

    await test ( t, app, '/return-buffer', {}, {
      statusCode: 200,
      buffer: U8.encode ( 'body' ).buffer
    });

  });

  it ( 'can end a request early with .end, from a sync middleware', async t => {

    await test ( t, app, '/', {}, ( req, res, next ) => {

      t.is ( res.ended, false );

      res.status ( 200 );
      res.end ();

      t.is ( res.statusCode, 200 );
      t.is ( res.body, 'OK' );
      t.is ( res.ended, true );

    });

  });

  it ( 'can end a request early with .end, from an async middleware', async t => {

    await test ( t, app, '/', {}, async ( req, res, next ) => {

      await delay ( 100 );

      t.is ( res.ended, false );

      res.status ( 200 );
      res.end ();

      t.is ( res.statusCode, 200 );
      t.is ( res.body, 'OK' );
      t.is ( res.ended, true );

    });

  });

});
