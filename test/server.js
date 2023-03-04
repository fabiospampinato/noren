
/* IMPORT */

import {describe} from 'fava';
import {setTimeout as delay} from 'node:timers/promises';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const app = () => {

  return appWith ( app => {

    app.get ( '/', ( req, res ) => {} );

    app.get ( '/error', ( req, res ) => {
      throw new Error ( 'Ouch!' );
    });

  });

};

const appError = () => {

  return appWith ( app => {

    app.get ( '/error', ( req, res ) => {
      throw new Error ( 'Ouch!' );
    });

    app.onError ( ( err, req, res ) => {
      res.statusCode = 501;
      res.text ( `Custom error: ${err.message}` );
    });

    app.onNotFound ( ( req, res ) => {
      throw new Error ( 'Not found!' );
    });

  });

};

const appErrorThrowing = () => {

  return appWith ( app => {

    app.get ( '/error', ( req, res ) => {
      throw new Error ( 'Ouch!' );
    });

    app.onError ( ( err, req, res ) => {
      throw new Error ( 'Ouch x2!' );
    });

    app.onNotFound ( ( req, res ) => {
      throw new Error ( 'Not found!' );
    });

  });

};

const appNotFound = () => {

  return appWith ( app => {

    app.onNotFound ( ( req, res ) => {
      res.text ( 'Sorry, we could not find that!' );
    });

  });

};

const appMiddlewareWait = () => {

  return appWith ( app => {

    app.use ( async ( req, res, next ) => {
      await next ();
      await delay ( 1000 );
      res.header ( 'x-wait', '1' );
    });

    app.get ( '/', ( req, res ) => {} );

  });

};

/* MAIN */

describe ( 'Server', it => {

  it ( 'can register a custom error handler', async t => {

    await test ( t, appError, '/error', {}, {
      statusCode: 501,
      text: 'Custom error: Ouch!'
    });

    await test ( t, appError, '/not-found', {}, {
      statusCode: 501,
      text: 'Custom error: Not found!'
    });

    await test ( t, appErrorThrowing, '/error', {}, {
      statusCode: 500,
      text: 'Internal Server Error'
    });

    await test ( t, appErrorThrowing, '/not-found', {}, {
      statusCode: 500,
      text: 'Internal Server Error'
    });

  });

  it ( 'can register a custom not found handler', async t => {

    await test ( t, appNotFound, '/not-found', {}, {
      statusCode: 404,
      text: 'Sorry, we could not find that!'
    });

  });

  it ( 'has a default error handler', async t => {

    await test ( t, app, '/error', {}, {
      statusCode: 500,
      text: 'Internal Server Error'
    });

  });

  it ( 'has a default not found handler', async t => {

    await test ( t, app, '/not-found', {}, {
      statusCode: 404,
      text: 'Not Found'
    });

  });

  it ( 'waits for middlewares to finish', async t => {

    await test ( t, appMiddlewareWait, '/', {}, {
      statusCode: 200,
      headers: {
        'x-wait': '1'
      }
    });

  });

});
