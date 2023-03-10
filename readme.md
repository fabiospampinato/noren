# Noren

A minimal HTTP server with good developer-experience and performance, for Node and beyond.

## Features

- **Familar**: it works pretty similarly to [Express](https://expressjs.com), with influences from [Hono](https://hono.dev).
- **Lightweight**: zero third-party dependencies are used, though I haven't written a multipart form data parser yet, so you'll need a middleware for that.
- **Adaptable**: built-in adapters for Node and the Edge are provided, but others can be written quickly for any runtime.
- **Performant**: unless you have a very large number of routes (the router is not a trie, yet) performance will be very good.

## Install

```sh
npm install --save noren
```

## Usage

Noren is divided into 4 main objects:

- **Server**: the server routes requests and turns them into responses.
- **Req**: the req object is the custom object for interacting with the network request.
- **Res**: the res object is the custom object for generating a network response.
- **Middlewares**: middlewares are chained functions that will be called by the router on requests.

### Server

The server provides the following APIs:

```ts
// import Router from 'noren/router'' // Import just the low-level router
// import Server, {Req, Res} from 'noren/abstract'; // To write your own adapter
// import Server from 'noren/edge'; // The built-in Edge adapter
import Server from 'noren/node'; // The built-in Node adapter

// Create a new Node server

const app = new Server ();

// Register a custom global error handler

app.onError ( ( error, req, res ) => {
  // Do something...
});

// Register a custom global not-found handler

app.onNotFound ( ( req, res ) => {
  // Do something...
});

// Register a middleware for every route
// Each middleware can define an optional third argument, for reading the "next" function:
//   - If it does, the next middleware will be called when the next function is called
//   - If it doesn't, the next middleware will be called when the return of the current middleware resolves
// In any case middlewares are always fully awaited before the response is returned to the client

app.use ( async ( req, res, next ) => {
  const start = Date.now ();
  await next ();
  const elapsed = Date.now () - start;
  console.log ( `Request "${req.url.pathname}" served in: ${elapsed}ms` );
});

// Add a shorthand route

app.get ( '/foo', ( req, res ) => {
  // Req and Res are described in another section below
});

// Add a route for every verb

app.all ( '/all', ( req, res ) => {} );

// Add a route more manually, with a custom list of verbs, paths, and route-level middlewares

app.on ( ['POST', 'PUT'], ['/article/new', '/articles/new'], middleware1, middleware2, ( req, res ) => {} );

// Supported path features

app.get ( '/', handle ); // Root match
app.get ( '/:param([0-9]+)', handle ); // Named parameter with custom regex
app.get ( '/:param', handle ); // Named parameter
app.get ( '/:user/:section?', handle ) // Optional named parameter
app.get ( '/rpc/*', handle ); // Wildcard match
app.get ( '/a*b', handle ) // Zero-or-more modifier
app.get ( '/a+b', handle ) // One-or-more modifier
app.get ( '/a?b', handle ) // Zero-or-one modifier
app.get ( '/some-(foo|bar)', handle ) // Alternation

// Listening on a port

app.listen ( 4000 );

// Get the used port -- useful when setting the port to 0, which lets the OS pick one

app.port ();

// Stopping listening

app.close ();
```

### Req

The req object provides the following APIs:

```ts
// Instance variables

req.body; // Uint8Array containing the payload of the request
req.cookies; // Object containing all received cookies
req.credentials; // Object containing username and password, if any
req.environment; // Object containing environment variables
req.headers; // Object containing all request headers
req.ip; // String containing the first "X-Forwared-For" address, if any
req.ips; // Array containing all "X-Forwared-For" addresses
req.method; // String of the HTTP verb used
req.params; // Object containing path parameters
req.path; // The requested pathname
req.signal; // AbortSignal for the request, if any
req.url; // URL object for the request

// Methods for reading details of the request

req.cookie ( key ); // Get a cookie by name, if any
req.env ( key ); // Get an environment variable by name, if any
req.header ( key ); // Get a header by name, if any
req.param ( key ); // Get a path parameter by name, if any
req.query ( key ); // Get a search query parameter by name, if any
req.queries ( key ); // Get all search query parameters by name

// Methods for reading the body of the request

req.arrayBuffer (); // Read the body as an ArrayBuffer
req.blob (); // Read the body as a Blob
req.formData (); // Read the body as a FormData
req.json (); // Read the body as a JSON value
req.text (); // Read the body as a string
```

### Res

The res object provides the following APIs:

```ts
// Instance variables

res.ended; // Whether the response has been manually .end()-ed or not
res.headers; // Object containing all current response headers
res.statusCode; // Number representing the returned status code
res.body; // String or Uint8Array containing the response payload, if any

// Methods for logging, efficiently

res.log.error ( 'Message' ); // Log an error-level message
res.log.warn ( 'Message' ); // Log a warning-level message
res.log.info ( 'Message' ); // Log an info-level message
res.log.debug ( 'Message' ); // Log a debug-level message

// Methods for writing details of the response

res.append ( key, value ); // Append a header
res.code ( code ); // Set the status code
res.cookie ( key, value, options ); // Set a cookie
res.header ( key, value ); // Set a header
res.redirect ( url, status ); // Redirect to a url with a status code
res.status ( code, message ); // Set the status code and a textual response body
res.type ( type ); // Set the MIME type of the response body

// Methods for writing the body of the response

res.html ( value ); // Set an HTML string as the response body, with proper MIME type
res.json ( value ); // Set a JSON value as the response body, with proper MIME type
res.text ( value ); // Set a plain string as the response body, with proper MIME type
res.send ( value ); // Set a string or Uint8Array as the response body, with no automatic MIME type

// Other methods

res.end (); // This method stops execution of middlewares, even if the `next()` function is called
```

### Middlewares

Middlewares are used like this:

```ts
import Server from 'noren/node';

const app = new Server ();

// Creating a custom middleware

const customMiddleware = () => {
  return async ( req, res, next ) => {
    // Maybe do something before executing the other middlewares...
    await next (); // Waiting for the other middlewares to execute
    await next ( new Error () ); // Exiting immediately, unsuccessfully, with an error
    await next ( true ); // Exiting immediately, successfully, skipping other middlewares
    // Maybe do something after executing the other middlewares...
  };
};

// Registering a global middleware

app.use ( customMiddleware () );

// Register a route-level middleware

app.get ( '/foo', customMiddleware (), ( req, res ) => {
  // Handle the request...
});
```

The following built-in middlewares are provided:

```ts
import {basicAuth, cors, etag, favicon, logger, poweredBy, serveStatic} from 'noren/middlewares';
import Server from 'noren/node';

const app = new Server ();

// Putting routes under Basic authentication

app.use ( basicAuth ({
  users: [
    {
      username: 'aladdin',
      password: 'opensesame'
    },
    {
      username: 'hermione',
      password: 'alohomora'
    }
  ]
}));

// Allowing CORS requests (no options are implemented at the moment, this middleware is super basic)

app.use ( cors () );

// Returning ETag headers, only strong etags are supported, which are somewhat expensive to generate

app.use ( etag () );

// Serve requests for "/favicon.ico" quickly from memory

app.use ( favicon ( './public/favicon.ico' ) );

// Log requests to the console, with very little overhead

app.use ( logger () );

// Add the X-Powered-By header, with "Noren" as the value, to every response

app.use ( poweredBy () );

// Serve static files from a folder (this middleware is pretty basic, not intended for production use)

app.use ( serveStatic ( '/public', {
  dotfiles: true, // Serve dot files, and files in dot folders, also
  fallback: true, // Pass the request to the next middleware instead of failing if the file is not found
  immutable: true, // Mark the returned response as immutable
  maxAge: 1000 // Set the "Cache-Control" header to "max-age=1000"
}));
```

## License

MIT © Fabio Spampinato
