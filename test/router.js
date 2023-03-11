
/* IMPORT */

import {describe} from 'fava';
import {METHODS} from '../dist/router/constants.js';
import Router from '../dist/router/index.js';
import {appWith, test} from './fixtures.js';

/* HELPERS */

const app = () => {

  return appWith ( app => {

    app.copy ( '/verb', ( req, res ) => res.text ( 'copy' ) );
    app.delete ( '/verb', ( req, res ) => res.text ( 'delete' ) );
    app.get ( '/verb', ( req, res ) => res.text ( 'get' ) );
    app.head ( '/verb', ( req, res ) => res.text ( 'head' ) );
    app.lock ( '/verb', ( req, res ) => res.text ( 'lock' ) );
    app.mkcol ( '/verb', ( req, res ) => res.text ( 'mkcol' ) );
    app.move ( '/verb', ( req, res ) => res.text ( 'move' ) );
    app.options ( '/verb', ( req, res ) => res.text ( 'options' ) );
    app.patch ( '/verb', ( req, res ) => res.text ( 'patch' ) );
    app.post ( '/verb', ( req, res ) => res.text ( 'post' ) );
    app.propfind ( '/verb', ( req, res ) => res.text ( 'propfind' ) );
    app.proppatch ( '/verb', ( req, res ) => res.text ( 'proppatch' ) );
    app.put ( '/verb', ( req, res ) => res.text ( 'put' ) );
    app.search ( '/verb', ( req, res ) => res.text ( 'search' ) );
    app.unlock ( '/verb', ( req, res ) => res.text ( 'unlock' ) );
    app.on ( 'ANNOUNCE', '/verb', ( req, res ) => res.text ( 'announce' ) );

    app.get ( '/params/:name/:section', ( req, res ) => res.json ( req.params ) );
    app.get ( '/re-params/:name([A-Z]+)/:section([0-9]+)', ( req, res ) => res.json ( req.params ) );
    app.get ( '/opt-params/:name?/:section?', ( req, res ) => res.json ( req.params ) );
    app.get ( '/alt-params/(:alpha([A-Z]+)|:num([0-9]+))', ( req, res ) => res.json ( req.params ) );

    app.get ( '/escape/_$', ( req, res ) => res.text ( '$' ) );
    app.get ( '/escape/_.', ( req, res ) => res.text ( '.' ) );
    app.get ( '/escape/_^', ( req, res ) => res.text ( '^' ) );
    app.get ( '/escape/_{', ( req, res ) => res.text ( '{' ) );
    app.get ( '/escape/_}', ( req, res ) => res.text ( '}' ) );
    app.get ( '/escape/_[', ( req, res ) => res.text ( '[' ) );
    app.get ( '/escape/_]', ( req, res ) => res.text ( ']' ) );

    app.get ( '/escaped/a\\+b', ( req, res ) => res.text ( 'a+b' ) );

    app.get ( '/mod/star/a*b', ( req, res ) => res.text ( 'star' ) );
    app.get ( '/mod/plus/a+b', ( req, res ) => res.text ( 'plus' ) );
    app.get ( '/mod/question/a?b', ( req, res ) => res.text ( 'question' ) );
    app.get ( '/mod/alternation/a(foo|bar)b', ( req, res ) => res.text ( 'alternation' ) );

    app.get ( '/wildcard/*', ( req, res ) => res.json ( req.params ) );
    app.get ( '/wildcard-param/*/:user', ( req, res ) => res.json ( req.params ) );

    app.get ( '/', ( req, res ) => res.text ( 'root' ) );
    app.get ( '/slash-missing', ( req, res ) => res.text ( 'slash-missing' ) );
    app.get ( '/slash-required/', ( req, res ) => res.text ( 'slash-required' ) );

    app.get ( '/one/two', ( req, res ) => res.text ( 'one/two' ) );

    app.on ( ['GET', 'POST', 'PUT'], ['/multi-1', '/multi-2'], ( req, res ) => res.text ( 'multi' ) );

  });

};

/* MAIN */

describe ( 'Router', it => {

  it ( 'supports all shorthanded verbs', async t => {

    for ( const METHOD of METHODS ) {

      const text = ( METHOD === 'HEAD' ) ? '' : METHOD.toLowerCase ();

      await test ( t, app, '/verb', { method: METHOD }, { text } );

    }

  });

  it ( 'supports named parameters', async t => {

    await test ( t, app, '/params/John/Profile', {}, { json: { name: 'John', section: 'Profile' } } );
    await test ( t, app, '/params/John/123', {}, { json: { name: 'John', section: '123' } } );
    await test ( t, app, '/params/John', {}, { statusCode: 404 } );

  });

  it ( 'supports named paramenter with custsom regex', async t => {

    await test ( t, app, '/re-params/John/123', {}, { json: { name: 'John', section: '123' } } );
    await test ( t, app, '/re-params/John/Alpha', {}, { statusCode: 404 } );
    await test ( t, app, '/re-params/123/John', {}, { statusCode: 404 } );

  });

  it ( 'supports optional named parameters', async t => {

    await test ( t, app, '/opt-params', {}, { json: {} } );
    await test ( t, app, '/opt-params/John', {}, { json: { name: 'John' } } );
    await test ( t, app, '/opt-params/John/Profile', {}, { json: { name: 'John', section: 'Profile' } } );

  });

  it ( 'supports alternation of parameters', async t => {

    await test ( t, app, '/alt-params', {}, { statusCode: 404 } );
    await test ( t, app, '/alt-params/John', {}, { json: { alpha: 'John' } } );
    await test ( t, app, '/alt-params/123', {}, { json: { num: '123' } } );
    await test ( t, app, '/alt-params/John123', {}, { statusCode: 404 } );

  });

  it ( 'supports some special characters as is', async t => {

    await test ( t, app, '/escape/_$', {}, { text: '$' } );
    await test ( t, app, '/escape/_.', {}, { text: '.' } );
    await test ( t, app, '/escape/_^', {}, { text: '^' } );
    await test ( t, app, '/escape/_{', {}, { text: '{' } );
    await test ( t, app, '/escape/_}', {}, { text: '}' } );
    await test ( t, app, '/escape/_[', {}, { text: '[' } );
    await test ( t, app, '/escape/_]', {}, { text: ']' } );

  });

  it ( 'supports escaped characters', async t => {

    await test ( t, app, '/escaped/ab', {}, { statusCode: 404 } );
    await test ( t, app, '/escaped/a+b', {}, { text: 'a+b' } );

  });

  it ( 'supports some allowed modifier characters', async t => {

    await test ( t, app, '/mod/star/b', {}, { text: 'star' } );
    await test ( t, app, '/mod/star/ab', {}, { text: 'star' } );
    await test ( t, app, '/mod/star/aaaaab', {}, { text: 'star' } );

    await test ( t, app, '/mod/plus/b', {}, { statusCode: 404 } );
    await test ( t, app, '/mod/plus/ab', {}, { text: 'plus' } );
    await test ( t, app, '/mod/plus/aaaaab', {}, { text: 'plus' } );

    await test ( t, app, '/mod/question/b', {}, { text: 'question' } );
    await test ( t, app, '/mod/question/ab', {}, { text: 'question' } );
    await test ( t, app, '/mod/question/aab', {}, { statusCode: 404 } );

    await test ( t, app, '/mod/alternation/b', {}, { statusCode: 404 } );
    await test ( t, app, '/mod/alternation/ab', {}, { statusCode: 404 } );
    await test ( t, app, '/mod/alternation/afoob', {}, { text: 'alternation' } );
    await test ( t, app, '/mod/alternation/abarb', {}, { text: 'alternation' } );

  });

  it ( 'supports wildcards', async t => {

    await test ( t, app, '/wildcard', {}, { json: {} } );
    await test ( t, app, '/wildcard/', {}, { json: {} } );
    await test ( t, app, '/wildcard/foo', {}, { json: {} } );
    await test ( t, app, '/wildcard/foo/bar', {}, { json: {} } );

  });

  it ( 'supports wildcards and parameters', async t => {

    await test ( t, app, '/wildcard-param', {}, { statusCode: 404 } );
    await test ( t, app, '/wildcard-param/', {}, { statusCode: 404 } );
    await test ( t, app, '/wildcard-param/foo', {}, { statusCode: 404 } );
    await test ( t, app, '/wildcard-param/foo/bar', {}, { json: { user: 'bar' } } );
    await test ( t, app, '/wildcard-param/foo/bar/baz', {}, { json: { user: 'baz' } } );

  });

  it ( 'supports querying the root', async t => {

    await test ( t, app, '/', {}, { text: 'root' } );

  });

  it ( 'supports considering the trailing slash as optional, both in the router and in the request', async t => {

    await test ( t, app, '/slash-missing', {}, { text: 'slash-missing' } );
    await test ( t, app, '/slash-missing/', {}, { text: 'slash-missing' } );

    await test ( t, app, '/slash-required', {}, { text: 'slash-required' } );
    await test ( t, app, '/slash-required/', {}, { text: 'slash-required' } );

  });

  it ( 'supports treating multiple consecutive slashes as one', async t => {

    await test ( t, app, '///one///two///', {}, { text: 'one/two' } );

  });

  it ( 'matches urls case insensitively', async t => {

    await test ( t, app, '/ONE/TWO', {}, { text: 'one/two' } );
    await test ( t, app, '/one/two', {}, { text: 'one/two' } );
    await test ( t, app, '/ONE/two', {}, { text: 'one/two' } );
    await test ( t, app, '/one/TWO', {}, { text: 'one/two' } );

  });

  it ( 'supports attaching multiple methods and paths to the same handler', async t => {

    await test ( t, app, '/multi-1', { method: 'GET' }, { text: 'multi' } );
    await test ( t, app, '/multi-1', { method: 'POST' }, { text: 'multi' } );
    await test ( t, app, '/multi-1', { method: 'PUT' }, { text: 'multi' } );
    await test ( t, app, '/multi-2', { method: 'GET' }, { text: 'multi' } );
    await test ( t, app, '/multi-2', { method: 'POST' }, { text: 'multi' } );
    await test ( t, app, '/multi-2', { method: 'PUT' }, { text: 'multi' } );

  });

  it ( 'supports normalizing paths', async t => {

    const router = new Router ();
    const handler = () => {};

    router.get ( '/normalized', handler );

    t.is ( router.route ( 'GET', '/normalized' ).route.handlers[0], handler );
    t.is ( router.route ( 'GET', '/normalized?foo' ).route.handlers[0], handler );
    t.is ( router.route ( 'GET', '/normalized#foo' ).route.handlers[0], handler );
    t.is ( router.route ( 'GET', '/normalized?foo#foo' ).route.handlers[0], handler );

  });

});
