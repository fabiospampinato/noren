
/* IMPORT */

import {describe} from 'fava';
import {basicAuth, cors, etag, poweredBy} from '../dist/middlewares/index.js';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const appBasicAuth = () => {

  return appWith ( app => {

    app.use ( basicAuth ({
      users: [
        {
          username: 'userfoo',
          password: 'passfoo'
        },
        {
          username: 'userbar',
          password: 'passbar'
        }
      ]
    }));

    app.get ( '/auth', ( req, res ) => res.text ( 'authorized' ) );

  });

};

const appCors = () => {

  return appWith ( app => {

    app.use ( cors () );

    app.get ( '/cors', ( req, res ) => res.text ( 'cors' ) );

  });

};

const appEtag = () => {

  return appWith ( app => {

    app.use ( etag () );

    app.get ( '/empty', () => {} );
    app.get ( '/hello', ( req, res ) => res.text ( 'Hello!' ) );

  });

};

const appPoweredBy = () => {

  return appWith ( app => {

    app.use ( poweredBy () );

    app.get ( '*', () => {} );

  });

};

/* MAIN */

//TODO: Implement these

describe ( 'middlewares', it => {

  it ( 'basicAuth', async t => {

    await test ( t, appBasicAuth, '/auth', {}, {
      statusCode: 401,
      text: 'Unauthorized',
      headers: {
        'www-authenticate': 'Basic realm="Protected Area"'
      }
    });

    await test ( t, appBasicAuth, '/auth', {
      headers: {
        'Authorization': 'Basic dXNlcmZvbzpwYXNzZm9v' // userfoo:passfoo
      }
    }, {
      statusCode: 200,
      text: 'authorized'
    });

    await test ( t, appBasicAuth, '/auth', {
      headers: {
        'Authorization': 'Basic dXNlcmJhcjpwYXNzYmFy' // userbar:passbar
      }
    }, {
      statusCode: 200,
      text: 'authorized'
    });

    await test ( t, appBasicAuth, '/auth', {
      headers: {
        'Authorization': 'Basic dXNlcmJhejpwYXNzYmF6' // userbaz:passbaz
      }
    }, {
      statusCode: 401,
      text: 'Unauthorized',
      headers: {
        'www-authenticate': 'Basic realm="Protected Area"'
      }
    });

    await test ( t, appBasicAuth, '/auth', {
      headers: {
        'Authorization': 'Basic dXNlcmZvbzpub25l' // userfoo:none
      }
    }, {
      statusCode: 401,
      text: 'Unauthorized',
      headers: {
        'www-authenticate': 'Basic realm="Protected Area"'
      }
    });

    await test ( t, appBasicAuth, '/auth', {
      headers: {
        'Authorization': 'Basic dXNlcmJhcjpub25l' // userbar:none
      }
    }, {
      statusCode: 401,
      text: 'Unauthorized',
      headers: {
        'www-authenticate': 'Basic realm="Protected Area"'
      }
    });

  });

  it ( 'cors', async t => {

    //TODO: Test this way more expensively

    await test ( t, appCors, '/cors', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://some.cross.origin',
        'Access-Control-Request-Method': 'GET'
      }
    }, {
      statusCode: 204,
      text: '',
      headers: {
        'access-control-allow-headers': '',
        'access-control-allow-methods': 'GET, HEAD, POST, PUT, DELETE, PATCH',
        'access-control-allow-origin': '*',
        vary: 'Access-Control-Request-Headers'
      }
    });

  });

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

});
