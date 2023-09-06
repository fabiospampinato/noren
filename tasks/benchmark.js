
/* IMPORT */

import {etag, logger, poweredBy} from '../dist/middlewares/index.js';
import Server from '../dist/adapters/node.js';

/* MAIN */

const app = new Server ();

// app.use ( etag () );
// app.use ( logger () );
// app.use ( poweredBy () );

app.get ( '/', ( req, res ) => {

  // const start = Date.now ();
  // while ( true ) {
  //   if ( Date.now () - start >= 5 ) break;
  // }

  res.json ({
    hello: 'world'
  });

});

app.get ( '/exit', ( req, res ) => {

  process.exit ();

});

app.listen ( 6173 );
