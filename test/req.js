
/* IMPORT */

import {describe} from 'fava';
import process from 'node:process';
import U8 from 'uint8-encoding';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const app = () => {

  return appWith ( app => {

    app.get ( '/:user/:section', ( req, res ) => {} );
    app.get ( '*', ( req, res ) => {} );

  });

};

/* MAIN */

describe ( 'Req', it => {

  it ( 'can read the body', async t => {

    await test ( t, app, '/', 'body', req => {

      t.deepEqual ( req.body, U8.encode ( 'body' ) );

    });

    await test ( t, app, '/', {}, req => {

      t.deepEqual ( req.body, new Uint8Array () );

    });

  });

  it ( 'can read cookies', async t => {

    await test ( t, app, '/', {
      headers: {
        Cookie: 'name=value; name2=value2; name3  =  value3;name4=value4;'
      }
    }, req => {

      t.deepEqual ( req.cookies, {
        name: 'value',
        name2: 'value2',
        name3: 'value3',
        name4: 'value4'
      });

    });

    await test ( t, app, '/', {}, req => {

      t.deepEqual ( req.cookies, {} );

    });

  });

  it ( 'can read credentials', async t => {

    await test ( t, app, '/', {
      headers: {
        Authorization: 'BaSiC YWxhZGRpbjpvcGVuc2VzYW1l'
      }
    }, req => {

      t.deepEqual ( req.credentials, {
        username: 'aladdin',
        password: 'opensesame'
      });

    });

    await test ( t, app, '/', {}, req => {

      t.is ( req.credentials, undefined );

    });

  });

  it ( 'can read env variables', async t => {

    await test ( t, app, '/', {}, req => {

      t.deepEqual ( req.environment, process.env );

    });

  });

  it ( 'can read headers', async t => {

    await test ( t, app, '/', {
      headers: {
        Foo: 'valueFoo',
        Bar: 'valueBar'
      }
    }, req => {

      const headers = Object.fromEntries ( req.headers.entries () );

      t.like ( headers, {
        foo: 'valueFoo',
        bar: 'valueBar'
      });

    });

  });

  it ( 'can read ips', async t => {

    await test ( t, app, '/', {
      headers: {
        'X-Forwarded-For': '127.0.0.1  ,  client, whatever'
      }
    }, req => {

      t.deepEqual ( req.ips, ['127.0.0.1', 'client', 'whatever'] );

    });

  });

  it ( 'can read the main ip', async t => {

    await test ( t, app, '/', {
      headers: {
        'X-Forwarded-For': '127.0.0.1  ,  client, whatever'
      }
    }, req => {

      t.is ( req.ip, '127.0.0.1' );

    });

  });

  it ( 'can read the method', async t => {

    await test ( t, app, '/', { method: 'GET' }, req => {

      t.is ( req.method, 'GET' );

    });

    await test ( t, app, '/', { method: 'POST' }, req => {

      t.is ( req.method, 'POST' );

    });

  });

  it ( 'can read params', async t => {

    await test ( t, app, '/John/Profile', {}, req => {

      t.deepEqual ( req.params, {
        user: 'John',
        section: 'Profile'
      });

    });

    await test ( t, app, '/', {}, req => {

      t.deepEqual ( req.params, {} );

    });

  });

  it ( 'can read search params', async t => {

    await test ( t, app, '/?foo=vf&bar=vb', {}, req => {

      t.is ( req.url.searchParams.get ( 'foo' ), 'vf' );
      t.is ( req.url.searchParams.get ( 'bar' ), 'vb' );

    });

  });

  it ( 'can read the path', async t => {

    await test ( t, app, '/foo/bar?param', {}, req => {

      t.is ( req.path, '/foo/bar' );

    });

  });

  it ( 'can read the signal', async t => {

    //TODO: Test an actual signal also

    await test ( t, app, '/', {}, req => {

      t.is ( req.signal, null );

    });

  });

  it ( 'can read the url', async t => {

    await test ( t, app, '/hello', {}, req => {

      console.log ( req.url );

      t.true ( req.url instanceof URL );
      t.is ( req.url.pathname, '/hello' );

    });

  });

  it ( 'can read a cookie', async t => {

    await test ( t, app, '/', {
      headers: {
        Cookie: 'name=value; name2=value2; name3  =  value3;name4=value4;'
      }
    }, req => {

      t.is ( req.cookie ( 'name' ), 'value' );
      t.is ( req.cookie ( 'name2' ), 'value2' );
      t.is ( req.cookie ( 'name3' ), 'value3' );
      t.is ( req.cookie ( 'name4' ), 'value4' );
      t.is ( req.cookie ( 'name5' ), undefined );

    });

  });

  it ( 'can read an env variable', async t => {

    await test ( t, app, '/', {
      headers: {
        Cookie: 'name=value; name2=value2; name3  =  value3;name4=value4;'
      }
    }, req => {

      t.is ( req.env ( 'SHELL' ), process.env.SHELL );
      t.is ( req.env ( 'HOME' ), process.env.HOME );
      t.is ( req.env ( 'XXX' ), undefined );

    });

  });

  it ( 'can read a header', async t => {

    await test ( t, app, '/', {
      headers: {
        Foo: 'valueFoo',
        Bar: 'valueBar'
      }
    }, req => {

      t.is ( req.header ( 'foo' ), 'valueFoo' );
      t.is ( req.header ( 'bar' ), 'valueBar' );
      t.is ( req.header ( 'baz' ), undefined );

    });

  });

  it ( 'can read a param', async t => {

    await test ( t, app, '/John/Profile', {}, req => {

      t.is ( req.param ( 'user' ), 'John' );
      t.is ( req.param ( 'section' ), 'Profile' );
      t.is ( req.param ( 'missing' ), undefined );

    });

  });

  it ( 'can read a search param', async t => {

    await test ( t, app, '/?foo=vf&bar=vb', {}, req => {

      t.is ( req.query ( 'foo' ), 'vf' );
      t.is ( req.query ( 'bar' ), 'vb' );
      t.is ( req.query ( 'baz' ), undefined );

    });

  });

  it ( 'can read a search param, containing multiple values', async t => {

    await test ( t, app, '/?foo=vf1&foo=vf2', {}, req => {

      t.is ( req.query ( 'foo' ), 'vf1' );
      t.deepEqual ( req.queries ( 'foo' ), ['vf1', 'vf2'] );
      t.deepEqual ( req.queries ( 'bar' ), [] );

    });

  });

  it ( 'can read the body as an ArrayBuffer', async t => {

    await test ( t, app, '/', 'body', async req => {

      t.deepEqual ( await req.arrayBuffer (), U8.encode ( 'body' ).buffer );

    });

  });

  it.todo ( 'can read the body as a Blob' );

  it ( 'can read the body as a FormData, from a urlencoded body', async t => {

    await test ( t, app, '/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'name=John&surname=Doe'
    }, async req => {

      const formData = await req.formData ();

      t.is ( formData.get ( 'name' ), 'John' );
      t.is ( formData.get ( 'surname' ), 'Doe' );

    });

  });

  it.todo ( 'can read the body as a FormData, from a multipart body' );

  it ( 'can read the body as a JSON', async t => {

    await test ( t, app, '/', '{"name":"John"}', async req => {

      t.deepEqual ( await req.json (), { name: 'John' } );

    });

  });

  it ( 'can read the body as a text', async t => {

    await test ( t, app, '/', 'body', async req => {

      t.deepEqual ( await req.text (), 'body' );

    });

  });

});
