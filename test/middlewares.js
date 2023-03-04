
/* IMPORT */

import {describe} from 'fava';
import {poweredBy} from '../dist/middlewares/index.js';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const appPoweredBy = () => {

  return appWith ( app => {

    app.use ( poweredBy );

    app.get ( '*', () => {} );

  });

};

/* MAIN */

//TODO: Implement these

describe ( 'middlewares', it => {

  it ( 'poweredBy', async t => {

    await test ( t, appPoweredBy, '/', {}, {
      headers: {
        'x-powered-by': 'Noren'
      }
    });

  });

  // basic_auth
  // bearer_auth
  // cache
  // cors
  // etag
  // logger

});
