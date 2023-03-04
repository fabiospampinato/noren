
/* IMPORT */

import {describe} from 'fava';
import {etag, poweredBy} from '../dist/middlewares/index.js';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const appEtag = () => {

  return appWith ( app => {

    app.use ( etag );

    app.get ( '/empty', () => {} );
    app.get ( '/hello', ( req, res ) => res.text ( 'Hello!' ) );

  });

};

const appPoweredBy = () => {

  return appWith ( app => {

    app.use ( poweredBy );

    app.get ( '*', () => {} );

  });

};

/* MAIN */

//TODO: Implement these

describe ( 'middlewares', it => {

  it ( 'etag', async t => {

    await test ( t, appEtag, '/empty', {}, {
      statusCode: 200,
      text: '',
      headers: {
        'etag': '"da39a3ee5e6b4b0d3255bfef95601890afd80709"'
      }
    });

    await test ( t, appEtag, '/empty', {
      headers: {
        'if-none-match': '"da39a3ee5e6b4b0d3255bfef95601890afd80709"'
      }
    }, {
      statusCode: 304,
      text: ''
    });

    await test ( t, appEtag, '/hello', {}, {
      statusCode: 200,
      text: 'Hello!',
      headers: {
        'etag': '"69342c5c39e5ae5f0077aecc32c0f81811fb8193"'
      }
    });

    await test ( t, appEtag, '/hello', {
      headers: {
        'if-none-match': '"69342c5c39e5ae5f0077aecc32c0f81811fb8193"'
      }
    }, {
      statusCode: 304,
      text: ''
    });

  });

  it ( 'poweredBy', async t => {

    await test ( t, appPoweredBy, '/', {}, {
      headers: {
        'x-powered-by': 'Noren'
      }
    });

  });

  // basic_auth
  // bearer_auth
  // cors

});
