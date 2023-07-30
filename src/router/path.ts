
/* IMPORT */

import {match, or, star, parse} from 'grammex';
import {identity} from '~/router/utils';

/* GRAMMAR */

//TODO: Support full-blown embedded regexes, currently parentheses are forbidden

const ParameterWithRegex = match ( /:([a-zA-Z_][a-zA-Z0-9_]*)\(([^\(\)]+)\)/, ( _, identifier, re ) => `(?<${identifier}>${re})` );
const Parameter = match ( /:([a-zA-Z_][a-zA-Z0-9_]*)/, ( _, identifier ) => `(?<${identifier}>[^/#?]+?)` );

const Escaped = match ( /\\./, identity );
const Wildcard = match ( /(?:^|\/)\*/, '(?:/*$|(?:^|/+)[^#?]*?)' );
const Modifier = match ( /[*+?()\|]/, identity );
const Escape = match ( /[$.*+?^(){}[\]\|]/, char => `\\${char}` );
const Slash = match ( '/', '(?:\/+|$)' );
const Passthrough = match ( /./, identity );

const Grammar = star ( or ([ ParameterWithRegex, Parameter, Escaped, Wildcard, Modifier, Escape, Slash, Passthrough ]) );

/* MAIN */

const compile = ( input: string, caseSensitive: boolean ): RegExp => {

  const source = parse ( input, Grammar, { memoization: false } ).join ( '' );
  const flags = caseSensitive ? '' : 'i';

  return new RegExp ( `^(?:${source})/*$`, flags );

};

/* EXPORT */

export {compile};
