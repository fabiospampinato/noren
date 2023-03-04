
/* IMPORT */

import {etag, logger, poweredBy} from '../dist/middlewares/index.js';
import Server from '../dist/adapters/node.js';

/* MAIN */

//TODO: Memoize all the things
//TODO: Cache some constant values
//TODO: Get to around 60~70k req/s, currently at ~40k

const app = new Server ();

// app.use ( etag () );
// app.use ( logger () );
// app.use ( poweredBy () );

app.get ( '/', ( req, res ) => {

  res.json ({
    hello: 'world'
  });

});

app.get ( '/exit', ( req, res ) => {

  process.exit ();

});

app.listen ( 6173 );
