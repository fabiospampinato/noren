
/* IMPORT */

import {METHODS} from '~/router/constants';
import type {Method} from '~/router/types';

/* MAIN */

const castArray = <T> ( value: T | T[] ): T[] => {

  return Array.isArray ( value ) ? value : [value];

};

const identity = <T> ( value: T ): T => {

  return value;

};

const isMethod = (() => {

  const methodsSet = new Set ( METHODS );

  return ( value: any ): value is Method => {

    return methodsSet.has ( value );

  };

})();

/* EXPORT */

export {castArray, identity, isMethod};
